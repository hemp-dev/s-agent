# Rule suggestion

S-Agent should make it easier to discover candidate `SemanticRule` ideas, but
approved YAML rules must remain the source of truth.

This design is documentation-only for now.

## Goal

Rule suggestion should point maintainers toward likely rule coverage gaps using
simple, explainable methods. It should not require an LLM, vector database, or
hosted service.

Suggested rules are candidates only. A human must review, edit, and approve a
rule before it can produce blocking findings.

## Classical-first approach

The MVP should start with TF-IDF and other transparent scoring methods over:

- existing rule text;
- file paths;
- exported symbols and function names;
- test names and fixture names;
- documentation headings;
- commit messages when local git history is available.

No vector database is needed in the MVP.

## Candidate workflows

The future command can inspect a project and emit candidate rule ideas:

```sh
s-agent suggest-rules --project .
```

Initial suggestions should be grouped by likely invariant type:

- layer boundary;
- forbidden side effect;
- value invariant.

For each candidate, output:

- suggested rule title;
- likely invariant type;
- supporting files and symbols;
- matched docs or tests;
- confidence score;
- reason the candidate is not approved yet.

## Approval boundary

Suggestions must never write approved blocking rules automatically.

A generated rule file, when supported, should use `status: candidate` by
default. Maintainers must promote it to `approved` after review and tests.

## Why TF-IDF first

TF-IDF is enough for the first useful version because S-Agent's early rule
space is small and domain-specific. It is inspectable, deterministic, easy to
test, and works without external services.

More advanced retrieval can be revisited later if fixtures prove that simple
methods miss important rule candidates.

## Test expectations

Every implemented suggestion method must include fixtures that prove:

- suggestions are stable;
- irrelevant files don't dominate results;
- candidate rules are not approved automatically;
- no suggestion can block;
- no network or LLM call is required.

