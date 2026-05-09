# Security policy

This policy covers S-Agent Core, the open-source semantic analysis engine in
this repository.

## Reporting vulnerabilities

Do not open public GitHub issues for security vulnerabilities.

Use GitHub private vulnerability reporting if it is enabled for the repository.
If that is not available, contact the maintainers privately through the
repository owner.

Include as much detail as you can:

- affected version or commit;
- command or API used;
- rule file or project fixture if relevant;
- expected behavior;
- actual behavior;
- reproduction steps;
- impact assessment.

## Supported versions

S-Agent Core is currently experimental. Until the project reaches a stable
`1.0.0` release, maintainers support the latest release and the `main` branch
on a best-effort basis.

| Version | Supported |
| --- | --- |
| `main` | Yes, best effort |
| Latest release | Yes, best effort |
| Older releases | No |

## Response process

Maintainers will review security reports, confirm the scope, and determine a
fix plan. Response time depends on maintainer availability and the severity of
the report.

When a fix is ready, maintainers may publish a release and disclose the issue
with appropriate credit if the reporter wants to be named.

## Scope

Security reports may include:

- unsafe file handling;
- command execution risks;
- dependency vulnerabilities that affect S-Agent Core;
- report generation issues that could expose data unexpectedly;
- rule parsing or validation issues with security impact.

Future commercial AxiomGuard services will have separate security processes
when they exist.

## Dependency security

Contributors should avoid unnecessary dependencies. New dependencies must have
a clear purpose, active maintenance, and a compatible license.

When updating dependencies, run the normal validation commands:

```sh
pnpm build
pnpm test
pnpm lint
pnpm analyze:demo
```

This project does not currently offer a bug bounty program.
