import { z } from "zod";
import type { SemanticRule } from "./semantic-rule";

export class RuleValidationError extends Error {
  readonly filePath?: string;
  readonly issues: string[];

  constructor(message: string, issues: string[], filePath?: string) {
    super(message);
    this.name = "RuleValidationError";
    this.issues = issues;
    this.filePath = filePath;
  }
}

const invariantSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum([
      "layer_boundary",
      "forbidden_import",
      "forbidden_side_effect",
      "value_invariant"
    ]),
    description: z.string().min(1),
    from: z.string().min(1).optional(),
    to: z.string().min(1).optional(),
    forbidden_imports: z.array(z.string().min(1)).optional(),
    readonly: z.boolean().optional(),
    functions: z.array(z.string().min(1)).optional(),
    forbidden_calls: z.array(z.string().min(1)).optional(),
    value: z
      .object({
        symbol: z.string().min(1),
        max: z.number(),
        operator: z.literal("<=").optional()
      })
      .optional()
  })
  .superRefine((value, context) => {
    if (value.type === "layer_boundary" && (!value.from || !value.to)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "layer_boundary invariants require both 'from' and 'to'"
      });
    }

    if (value.type === "forbidden_import" && !value.forbidden_imports?.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "forbidden_import invariants require at least one forbidden_imports entry"
      });
    }

    if (value.type === "forbidden_side_effect" && value.readonly !== true) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "forbidden_side_effect invariants must set readonly: true"
      });
    }

    if (value.type === "value_invariant" && !value.value) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "value_invariant invariants require a value definition"
      });
    }
  });

const semanticRuleSchema = z.object({
  rule_id: z.string().min(1),
  domain: z.string().min(1),
  status: z.enum(["candidate", "approved", "deprecated", "archived"]),
  owner: z.string().min(1),
  severity: z.enum(["info", "warning", "critical"]),
  scope: z.object({
    modules: z.array(z.string().min(1)).min(1)
  }),
  intent: z.string().min(1),
  invariants: z.array(invariantSchema).min(1),
  enforcement: z.object({
    mode: z.enum(["off", "info", "review", "block"])
  }),
  source: z.object({
    file: z.string().min(1),
    section: z.string().min(1),
    line: z.number().int().positive().optional()
  })
});

function formatIssue(issue: z.ZodIssue): string {
  const path = issue.path.length > 0 ? issue.path.join(".") : "rule";
  return `${path}: ${issue.message}`;
}

export function validateRule(value: unknown, filePath?: string): SemanticRule {
  const result = semanticRuleSchema.safeParse(value);

  if (!result.success) {
    const issues = result.error.issues.map(formatIssue);
    const prefix = filePath ? `Invalid rule in ${filePath}` : "Invalid rule";
    throw new RuleValidationError(`${prefix}: ${issues.join("; ")}`, issues, filePath);
  }

  return result.data;
}

export function validateRules(values: unknown[], filePath?: string): SemanticRule[] {
  return values.map((value, index) => {
    try {
      return validateRule(value, filePath);
    } catch (error) {
      if (error instanceof RuleValidationError) {
        throw new RuleValidationError(
          `${error.message}; rule index: ${index}`,
          error.issues,
          filePath
        );
      }

      throw error;
    }
  });
}
