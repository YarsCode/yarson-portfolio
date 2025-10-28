<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: None
- Added sections: VI. Security by Design and Operations; Security items in Additional Constraints
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (add Security gates)
  - ✅ .specify/templates/tasks-template.md (add Security foundational tasks)
  - ⚠️ README.md (optional: reference security gates and headers)
- Follow-up TODOs: None
-->

# Yarson Portfolio Constitution

## Core Principles

### I. Clear, Concise, Modular Code
Code MUST be easy to read, change, and test. Favor small, single-responsibility
modules with explicit inputs/outputs. Name things precisely (full words, no
cryptic abbreviations). Colocate files by feature. Avoid premature abstraction.

Rationale: Readable, modular code reduces defects, accelerates onboarding, and
enables safe iteration.

### II. Next.js 16 Best Practices
The app MUST use the App Router and prefer Server Components by default. Use
Route Handlers for server APIs. Apply server-first data fetching, cache
semantics, and revalidation. Client Components are used only when interaction
requires client state or browser APIs (explicit `"use client"`). TypeScript is
mandatory with strict mode. Use `next/font`, `next/image`, and metadata API.

Rationale: Aligning to modern Next.js guarantees performance, scalability, and
maintainability.

### III. Test-Driven Development (NON-NEGOTIABLE)
Write tests first. Follow Red → Green → Refactor. Each module MUST have unit
tests; critical flows MUST have integration tests; primary user journeys MUST
have E2E tests. Tests MUST be deterministic and fast. Minimum coverage target:
80% lines/functions with meaningful assertions.

Rationale: TDD improves design, prevents regressions, and documents behavior.

### IV. Product Design and UI/UX Excellence
Design MUST prioritize clarity, accessibility (WCAG 2.2 AA), responsiveness,
and Core Web Vitals. Use consistent patterns, spacing, and typography. Interact
ions MUST be discoverable and have clear affordances and feedback.

Rationale: Great UX reduces cognitive load, boosts conversion, and builds
trust.

### V. Performance, Accessibility, Observability, Versioning
- Performance: Meet CWV targets (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 p75).
- Accessibility: Automated a11y checks in CI; critical journeys manually tested.
- Observability: Structured logs and basic metrics for key actions.
- Versioning: Semantic versioning for user-facing changes; document breaking
  changes and provide migrations.

Rationale: Non-functional quality is a product feature.

### VI. Security by Design and Operations
Security MUST be built in from the start and verified continuously.

- Input validation and output encoding on server boundaries; trust nothing from
  the client.
- Strong defaults: HTTPS only, HSTS, secure cookies (`Secure`, `HttpOnly`,
  `SameSite=strict`), and CSRF protection for mutable endpoints.
- Content Security Policy (CSP) without `unsafe-inline`; disallow mixed content.
- Authentication and authorization are explicit, least-privilege, and audited.
- Secrets are not committed; managed via environment and rotated; access is
  logged.
- Dependency health: lockfiles, automated vulnerability scanning, and timely
  remediation.
- Abuse prevention: rate limiting, bot protection where appropriate, and basic
  anomaly detection.

Rationale: Proactive controls protect users and the business while enabling
confident iteration.

## Additional Constraints

- Language: TypeScript with `"strict": true`.
- Linting/Formatting: ESLint + Prettier; CI MUST block on violations.
- Styling: Prefer a design system and tokens; ensure dark/light support if used.
- Data Fetching: Prefer server-side where possible; define cache policy per
  route/component; avoid ad-hoc client fetches.
- State: Keep local UI state client-side; use server state via fetch or actions.
- Security: Validate inputs on server; sanitize outputs; typed accessors for
  env vars; enforce security headers (HSTS, CSP, X-Frame-Options,
  `X-Content-Type-Options`, `Referrer-Policy`); CSRF protection for mutations;
  secure cookies; rate limiting for APIs; dependencies scanned in CI; no
  secrets in repo; use `.env.local` and deployment secrets store.
- Images/Fonts: Use `next/image` and `next/font`.
- Internationalization (if applicable): Use Next.js i18n routing; content is
  translation-ready.

## Development Workflow

1. Planning: Define user stories with acceptance criteria and UX success metrics.
2. TDD: Write failing tests (unit/integration/E2E) before code.
3. Implementation: Prefer Server Components; document decisions in PR.
4. Review: Two approvals for logic changes; verify tests, a11y, and CWV gates.
5. CI: Lint + typecheck + tests + a11y + basic CWV checks MUST pass.
6. Release: Semver tagging; changelog entries for user-visible changes.

## Governance

- Authority: This constitution supersedes conflicting conventions.
- Compliance: PRs MUST state any deviations and rationale. Deviations require a
  documented follow-up issue to realign.
- Amendments: Proposals via PR including rationale, impact, and migration plan.
- Versioning Policy: Semantic versioning for this document.
  - MAJOR: Principle redefinition/removal creating incompatibilities.
  - MINOR: New principle/section or materially expanded guidance.
  - PATCH: Clarifications and non-semantic edits.
- Reviews: Quarterly compliance review; track actions to close gaps.

**Version**: 1.1.0 | **Ratified**: 2025-10-28 | **Last Amended**: 2025-10-28
