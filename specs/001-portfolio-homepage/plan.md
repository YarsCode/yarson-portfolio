# Implementation Plan: Yarson Portfolio Homepage

**Branch**: `001-portfolio-homepage` | **Date**: 2025-10-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-portfolio-homepage/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Build the foundational homepage for Yarson Portfolio featuring a floating navigation header, main content placeholder, and footer with navigation links and copyright. The homepage establishes brand presence with responsive design from mobile (320px) to desktop (1440px), including a hamburger menu for phones (<640px). Uses Next.js 16 App Router with Server Components by default, TypeScript strict mode, Tailwind for styling, Framer Motion for animations, shadcn/ui for accessible components, and zod for validation.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode enabled  
**Primary Dependencies**: 
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4.x
- Framer Motion 11.x (animations)
- shadcn/ui (accessible component primitives)
- zod 3.x (schema validation)

**Storage**: N/A (static homepage, no persistence layer required)  
**Testing**: Playwright (E2E), Vitest (unit/integration), React Testing Library (component testing)  
**Target Platform**: Web (browsers: Chrome/Firefox/Safari/Edge latest 2 versions, iOS Safari 15+, Android Chrome latest)  
**Project Type**: Web application (Next.js App Router single-page app)  
**Performance Goals**: 
- LCP ≤ 2.5s (p75)
- INP ≤ 200ms (p75)
- CLS ≤ 0.1 (p75)
- First paint within 1 second on broadband

**Constraints**: 
- Responsive design from 320px to 1440px viewport
- Hamburger menu trigger at <640px
- No JavaScript required for core content visibility (progressive enhancement)
- Keyboard navigation fully supported

**Scale/Scope**: Single homepage, 3 shared layout components (header, footer, unified navigation), ~4-5 components total, foundation for future pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The plan MUST explicitly satisfy these gates:

✅ **TDD**: Test-first approach with three layers:
  - **Unit tests** (Vitest + RTL): Component rendering, prop handling, event handlers written before implementation
  - **Integration tests** (Vitest): Navigation state, mobile menu toggle, keyboard navigation flow
  - **E2E tests** (Playwright): Full user journeys from spec acceptance scenarios (scroll behavior, responsive breakpoints, menu interactions)
  - Failure observation: Red test suite before any component code; validate accessibility violations with axe-core

✅ **Next.js 16 Approach**: 
  - **Server Components by default**: Layout (header/footer), homepage main content
  - **Client Components** (with `"use client"`):
    - Unified Navigation component (requires useState for mobile menu toggle, useEffect for outside click detection, browser APIs for scroll and responsive logic)
  - **Cache/Revalidation**: Static generation for homepage (no dynamic data), force-static for layout components

✅ **Accessibility**: WCAG 2.2 AA compliance
  - Keyboard navigation: Tab order through all nav links (header → footer), Enter/Space to activate
  - ARIA: `aria-expanded` on hamburger button, `aria-label` for nav landmarks, `role="navigation"`
  - Focus management: Visible focus indicators, logical tab order preserved at all breakpoints
  - CI automated checks: axe-core in Playwright tests for critical violations
  - Manual testing plan: Keyboard-only navigation test, screen reader spot check (VoiceOver/NVDA)

✅ **Performance**: CWV targets with measurement
  - LCP ≤ 2.5s: Static generation, optimized fonts via next/font
  - INP ≤ 200ms: Minimal client JS, debounced interactions
  - CLS ≤ 0.1: Fixed header with explicit height, no layout shifts
  - Measurement: Playwright traces in E2E suite, Lighthouse CI on deployment preview

✅ **Type Safety**: 
  - TypeScript strict mode enabled in tsconfig.json
  - Zod schemas for nav link configuration and copyright data structures
  - Typed props for all components with explicit interfaces
  - No `any` types; use `unknown` with type guards where dynamic

✅ **Observability**: 
  - Console.debug for mobile menu state changes (development only)
  - Performance marks for initial render timing
  - Error boundaries to capture component failures
  - Future: Analytics events for nav clicks (placeholder hooks)

✅ **UX**: 
  - Responsive: Tailwind breakpoints (sm: 640px for hamburger toggle)
  - Design tokens: Tailwind config with custom colors, spacing scale
  - Clear affordances: Hover states on links, focus rings, hamburger icon recognizable
  - Copy: Placeholder sentence specified in spec; footer copyright auto-updates year

✅ **Security**: 
  - **Input validation**: No user input in this feature; future forms will use zod server-side
  - **AuthN/Z**: Not applicable (public homepage)
  - **CSRF**: Not applicable (no mutations)
  - **Security headers**: Next.js security headers in next.config.ts (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
  - **CSP**: Content-Security-Policy with nonce for inline styles from Framer Motion
  - **Secrets**: No secrets required for this feature
  - **Dependencies**: npm audit in CI, Dependabot alerts enabled
  - **Rate limiting**: Not applicable (static site)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── layout.tsx              # Root layout with Header and Footer (Server Component)
├── page.tsx                # Homepage main content (Server Component)
├── globals.css             # Tailwind imports and custom global styles
├── components/
│   ├── Header.tsx          # Fixed navigation header (Server Component shell)
│   ├── Navigation.tsx      # Unified navigation (Client Component - handles desktop & mobile)
│   ├── Footer.tsx          # Footer with nav and copyright (Server Component)
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx      # Button primitive (if needed for hamburger)
│       └── [other shadcn components as needed]
├── lib/
│   ├── utils.ts            # cn() helper for Tailwind class merging
│   └── constants.ts        # Nav items config, copyright text
└── types/
    └── nav.ts              # TypeScript interfaces for navigation data

tests/
├── e2e/
│   ├── homepage.spec.ts    # Playwright E2E tests for user stories
│   └── accessibility.spec.ts # Playwright + axe-core a11y tests
├── integration/
│   └── navigation.test.tsx # Vitest tests for nav behavior (responsive + mobile menu)
└── unit/
    ├── Header.test.tsx     # Vitest + RTL component tests
    ├── Navigation.test.tsx # Unified navigation component tests
    └── Footer.test.tsx

components.json             # shadcn/ui configuration
tailwind.config.ts          # Tailwind theme tokens
vitest.config.ts            # Vitest configuration
playwright.config.ts        # Playwright configuration
```

**Structure Decision**: Next.js App Router structure with colocation of components in `app/components/`. Server Components by default in layout and page files; Client Components explicitly marked. Unified Navigation component handles both desktop and mobile responsive behavior internally. Tests organized by type (E2E, integration, unit) following TDD principle. shadcn/ui provides accessible component primitives in `app/components/ui/`. Shared types and utilities in `app/types/` and `app/lib/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution gates are satisfied.

---

## Post-Design Constitution Re-evaluation

**Date**: 2025-10-28  
**Status**: ✅ PASSED

After completing Phase 0 (Research) and Phase 1 (Design & Contracts), the implementation plan has been re-evaluated against all constitution gates:

### Gate Re-check Results

✅ **TDD Gate**: 
- **Status**: PASS
- **Evidence**: Comprehensive test strategy documented in `research.md` and `quickstart.md`
- **Test Coverage**: Unit tests (Vitest + RTL), Integration tests (Vitest), E2E tests (Playwright + axe-core)
- **TDD Workflow**: Red → Green → Refactor cycle explicitly documented in quickstart guide

✅ **Next.js 16 Approach Gate**:
- **Status**: PASS
- **Evidence**: Server Components are default in `data-model.md` and `component-contracts.md`
- **Client Components**: Only Navigation.tsx marked with `"use client"` (justified by state requirements for mobile menu toggle and responsive logic)
- **Cache Strategy**: Static generation documented in Technical Context and Constitution Check

✅ **Accessibility Gate**:
- **Status**: PASS
- **Evidence**: WCAG 2.2 AA compliance documented across all artifacts
- **ARIA Implementation**: Documented in `component-contracts.md` with explicit attributes
- **Testing**: axe-core integration in Playwright tests (`quickstart.md` Step 6)
- **Manual Testing**: Keyboard navigation and screen reader testing plan included

✅ **Performance Gate**:
- **Status**: PASS
- **Evidence**: CWV targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) in Technical Context
- **Optimization Strategy**: Documented in `research.md` (Server Components, bundle optimization, font loading)
- **Measurement**: Playwright traces and Lighthouse CI documented in `quickstart.md` Step 10

✅ **Type Safety Gate**:
- **Status**: PASS
- **Evidence**: TypeScript strict mode in Technical Context
- **Zod Schemas**: Comprehensive schemas in `type-contracts.md` for all data boundaries
- **Type Interfaces**: All component props typed in `component-contracts.md`
- **Validation**: Build-time and runtime validation documented in `data-model.md`

✅ **Observability Gate**:
- **Status**: PASS
- **Evidence**: Logging strategy in Constitution Check (console.debug for dev)
- **Error Handling**: Error boundaries documented in `component-contracts.md`
- **Performance Tracking**: Performance marks for render timing
- **Future Analytics**: Placeholder hooks documented for nav click events

✅ **UX Gate**:
- **Status**: PASS
- **Evidence**: Responsive design with Tailwind breakpoints (320px to 1440px)
- **Design Tokens**: Tailwind config with custom theme in `research.md`
- **Affordances**: Hover states, focus indicators, recognizable hamburger icon
- **Copy**: Exact placeholder text specified and auto-updating copyright

✅ **Security Gate**:
- **Status**: PASS
- **Evidence**: Security headers in `quickstart.md` Step 8 (HSTS, X-Frame-Options, CSP, etc.)
- **Input Validation**: zod validation at data boundaries (type-contracts.md)
- **Dependencies**: npm audit and Dependabot mentioned in `research.md`
- **No Secrets**: Static site with no secrets required
- **CSP**: Content-Security-Policy with nonce strategy for Framer Motion

### Design Artifacts Verification

✅ **research.md**: Complete
- All technology decisions documented
- Rationale and alternatives provided
- Best practices and patterns defined
- Performance optimization strategies
- Security considerations detailed

✅ **data-model.md**: Complete
- All entities defined with Zod schemas
- Validation rules documented
- State transitions specified
- Edge cases identified
- Type safety ensured

✅ **contracts/**: Complete
- `component-contracts.md`: All component interfaces defined
- `type-contracts.md`: Complete type system with Zod schemas
- Testing contracts specified
- Performance contracts established
- Security contracts documented

✅ **quickstart.md**: Complete
- Step-by-step TDD implementation guide
- All dependencies and setup documented
- Test examples provided (Red → Green phases)
- Manual testing checklist included
- Performance verification steps

### Compliance Summary

| Gate | Initial Check | Post-Design Check | Notes |
|------|---------------|-------------------|-------|
| TDD | ✅ PASS | ✅ PASS | Comprehensive test strategy |
| Next.js 16 | ✅ PASS | ✅ PASS | Server Components default |
| Accessibility | ✅ PASS | ✅ PASS | WCAG 2.2 AA compliant |
| Performance | ✅ PASS | ✅ PASS | CWV targets defined |
| Type Safety | ✅ PASS | ✅ PASS | Strict mode + Zod |
| Observability | ✅ PASS | ✅ PASS | Logging & error boundaries |
| UX | ✅ PASS | ✅ PASS | Responsive & accessible |
| Security | ✅ PASS | ✅ PASS | Headers + validation |

### Conclusion

**Overall Status**: ✅ **ALL GATES PASSED**

The implementation plan fully satisfies all constitution requirements. The design is:
- **Test-driven**: Comprehensive TDD approach with Red-Green-Refactor workflow
- **Modern**: Next.js 16 App Router with Server Components
- **Accessible**: WCAG 2.2 AA compliant with automated and manual testing
- **Performant**: CWV targets with measurement strategy
- **Type-safe**: TypeScript strict mode with Zod validation
- **Observable**: Logging, error tracking, performance monitoring
- **User-friendly**: Responsive design with clear affordances
- **Secure**: Security headers, input validation, dependency scanning

**Ready for Implementation**: The plan is complete and approved to proceed to Phase 2 (Tasks breakdown via `/speckit.tasks` command).

**Signed off by**: AI Planning Agent  
**Date**: 2025-10-28
