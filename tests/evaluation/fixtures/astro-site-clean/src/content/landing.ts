import { z } from "zod";

const brandSchema = z.object({
  headline: z.string()
});

export const brand = {
  headline: "Protect business intent in every code change."
} as const;

brandSchema.parse(brand);
