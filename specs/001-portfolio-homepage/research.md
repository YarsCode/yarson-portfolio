# Research & Technical Decisions

**Feature**: Yarson Portfolio Homepage  
**Phase**: 0 (Outline & Research)  
**Date**: 2025-10-28

## Overview

This document captures all technical research, decisions, and rationale for implementing the Yarson Portfolio homepage. All NEEDS CLARIFICATION items from the Technical Context have been resolved.

---

## Technology Stack Decisions

### 1. Testing Framework Selection

**Decision**: Playwright (E2E) + Vitest (unit/integration) + React Testing Library (component testing)

**Rationale**:
- **Playwright for E2E**: Industry standard for cross-browser testing with excellent developer experience, built-in accessibility testing via axe-core integration, trace viewer for debugging, and parallel execution
- **Vitest for unit/integration**: Modern, fast alternative to Jest with native ESM support, TypeScript first-class support, compatible with React Testing Library, better performance than Jest for Vite/Next.js projects
- **React Testing Library**: Best practice for component testing with focus on user behavior rather than implementation details, encourages accessibility-first testing patterns

**Alternatives Considered**:
- Jest + RTL: Slower than Vitest, requires additional ESM configuration for modern Next.js
- Cypress: Good E2E tool but Playwright has better API, TypeScript support, and trace debugging
- Testing Library alone: Insufficient for E2E browser testing and performance measurement

**Best Practices**:
- Write E2E tests for critical user journeys (spec acceptance scenarios)
- Use Vitest for fast component unit tests with RTL queries
- Run Playwright tests in CI on Chrome, Firefox, Safari
- Include axe-core accessibility checks in E2E suite
- Measure CWV with Playwright traces

---

### 2. Component Library: shadcn/ui

**Decision**: Use shadcn/ui for component primitives

**Rationale**:
- Copy-paste component approach (not a dependency) gives full control over code
- Built on Radix UI primitives for excellent accessibility (WCAG 2.2 AA compliant)
- Tailwind-first styling matches our stack
- TypeScript native with proper type safety
- Highly customizable without fighting framework opinions
- Great for building consistent design system

**Alternatives Considered**:
- Material UI (MUI): Too heavy, opinionated styling conflicts with custom design
- Chakra UI: Good but adds runtime overhead, not as lightweight
- Headless UI: Good primitives but shadcn provides more complete components
- Build from scratch: Reinventing accessible components is error-prone and time-consuming

**Implementation Notes**:
- Install via CLI: `npx shadcn@latest init`
- Only install components we need (button, potentially sheet for mobile menu)
- Customize theme tokens in `components.json` and `tailwind.config.ts`

---

### 3. Animation Library: Framer Motion

**Decision**: Framer Motion 11.x for animations

**Rationale**:
- Declarative animation API that integrates seamlessly with React
- Performance optimized with GPU acceleration
- Excellent TypeScript support
- Powerful gesture handling for mobile interactions
- Built-in layout animations for mobile menu slide-in/out
- Production-grade with large community (used by major companies)

**Alternatives Considered**:
- CSS transitions: Limited control, harder to coordinate complex animations
- React Spring: Good but more complex API, overkill for simple animations
- GSAP: Imperative API less React-friendly, larger bundle size
- Tailwind transitions: Too simple for mobile menu animations

**Implementation Notes**:
- Use `motion.div` for mobile menu with slide animation
- Animate menu items with stagger effect for polish
- Keep animations under 300ms for responsiveness (per constitution INP target)
- Use `AnimatePresence` for mount/unmount animations

---

### 4. Validation Library: Zod

**Decision**: Zod 3.x for schema validation and type safety

**Rationale**:
- TypeScript-first with automatic type inference
- Runtime validation ensures type safety at boundaries
- Excellent error messages for debugging
- Lightweight and performant
- Industry standard in Next.js ecosystem
- Future-proof for form validation when additional pages are added

**Alternatives Considered**:
- Yup: Older library, less TypeScript-native
- Joi: Browser bundle is larger, Node-first design
- Ajv: JSON Schema based, more verbose
- TypeScript alone: No runtime validation

**Implementation Notes**:
- Define schemas for nav links configuration
- Validate copyright data structure
- Use `.parse()` for strict validation, `.safeParse()` where errors expected
- Extract TypeScript types with `z.infer<typeof schema>`

---

### 5. Styling Approach: Tailwind CSS 4.x

**Decision**: Tailwind CSS 4.x (already installed) with custom design tokens

**Rationale**:
- Utility-first CSS reduces bundle size (only used classes shipped)
- Excellent DX with IntelliSense and type safety via plugin
- Mobile-first responsive design built-in
- Dark mode support for future enhancement
- Works seamlessly with shadcn/ui
- JIT compiler for instant feedback

**Best Practices**:
- Define custom colors, spacing, typography in `tailwind.config.ts`
- Use `@layer` directives for component-specific styles
- Leverage `cn()` utility from shadcn for conditional classes
- Create reusable component variants with CVA (class-variance-authority)
- Keep mobile-first: base styles for mobile, `sm:` for desktop

**Implementation Notes**:
```typescript
// tailwind.config.ts structure
export default {
  theme: {
    extend: {
      colors: {
        brand: { /* custom brand colors */ },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
      },
    },
  },
}
```

---

## Architecture Patterns

### Server vs Client Components

**Pattern**: Server Components by default, Client Components only when necessary

**Server Components** (no `"use client"`):
- Layout: `app/layout.tsx` with Header and Footer
- Header: `app/components/Header.tsx` (structural wrapper)
- Footer: `app/components/Footer.tsx`
- Homepage: `app/page.tsx`

**Client Components** (explicit `"use client"`):
- `app/components/Navigation.tsx`: Unified navigation component that handles both desktop and mobile views. Requires useState for mobile menu toggle, useEffect for click-outside detection, useMediaQuery or CSS-based responsive logic for breakpoint handling, and browser APIs for smooth scroll behavior.

**Rationale**: 
- Server Components reduce JavaScript bundle size (zero JS for static content)
- Improved initial page load (HTML streamed to client)
- Better SEO and accessibility (content in HTML)
- Progressive enhancement (works without JavaScript for header structure)
- **Unified Navigation**: Single component simplifies maintenance, reduces prop drilling, and keeps all navigation logic colocated. Responsive behavior handled internally with CSS classes and minimal state management.

---

### Component Composition Strategy

**Pattern**: Composition over inheritance, prop drilling over context for simple state

**Component Hierarchy**:
```
Layout (Server)
├── Header (Server)
│   ├── Logo/Brand
│   └── Navigation (Client - unified responsive component)
└── Footer (Server)
    ├── Footer Navigation
    └── Copyright
```

**Data Flow**:
- Nav items defined in `app/lib/constants.ts`
- Imported by components (no prop drilling needed for constants)
- Mobile menu state is local (useState in Navigation component)
- Responsive logic handled via CSS classes and state within Navigation component
- No global state management needed

**Unified Navigation Benefits**:
- **Simpler architecture**: One component vs two separate components
- **Colocated logic**: All navigation behavior (desktop + mobile) in one place
- **Easier testing**: Test responsive behavior within single component
- **DRY principle**: Shared link rendering logic, no duplication
- **State management**: Mobile menu state lives in same component as the UI

---

### Responsive Design Pattern

**Breakpoint Strategy**: Mobile-first with single breakpoint at 640px

**Implementation**:
```tsx
// Unified Navigation component with internal responsive logic
<Navigation links={NAV_LINKS.links} />

// Inside Navigation.tsx:
// Desktop links (hidden on mobile)
<div className="hidden sm:flex sm:gap-6">
  {links.map(link => <a>{link.label}</a>)}
</div>

// Mobile hamburger + drawer (hidden on desktop)
<div className="flex sm:hidden">
  <button onClick={toggleMenu}>☰</button>
  {isOpen && <MobileDrawer />}
</div>
```

**Rationale**:
- Simplifies logic (one breakpoint matches spec requirement)
- Tailwind `sm:` prefix at 640px matches spec exactly
- Mobile-first ensures smallest devices work correctly
- Single breakpoint reduces test matrix
- **Unified component**: Both desktop and mobile UI in one component, responsive via CSS classes

---

### Accessibility Implementation

**ARIA Patterns**:
- Navigation landmark: `<nav role="navigation" aria-label="Main navigation">`
- Hamburger button: `<button aria-expanded={isOpen} aria-label="Toggle menu">`
- Focus trap: Keep focus within mobile menu when open
- Skip link: Add skip-to-main-content link for keyboard users

**Keyboard Navigation**:
- Tab/Shift+Tab through all links in logical order
- Enter/Space to activate links and buttons
- Escape to close mobile menu
- Focus visible indicators (outline-2 outline-offset-2)

**Testing Strategy**:
- Automated: axe-core in Playwright for WCAG violations
- Manual: Keyboard-only navigation through all flows
- Manual: Screen reader spot check (VoiceOver on Safari, NVDA on Firefox)

---

## Performance Optimization

### Core Web Vitals Strategy

**LCP (Largest Contentful Paint) ≤ 2.5s**:
- Static generation (no server-side rendering delay)
- Font optimization with `next/font` (preload, font-display: swap)
- Minimal external resources (no third-party scripts on homepage)
- Critical CSS inlined automatically by Next.js

**INP (Interaction to Next Paint) ≤ 200ms**:
- Minimal client-side JavaScript (only mobile menu logic)
- Framer Motion GPU-accelerated animations
- Debounced click handlers if needed
- No blocking main thread operations

**CLS (Cumulative Layout Shift) ≤ 0.1**:
- Fixed header with explicit height (h-16 = 64px)
- No font-size changes after load (next/font prevents FOIT/FOUT)
- No ads or dynamic content injections
- Explicit image dimensions if images added

**Measurement**:
- Playwright traces capture CWV metrics
- Lighthouse CI on deployment previews
- Real User Monitoring (RUM) for production (future)

---

### Bundle Size Optimization

**Strategies**:
- Server Components eliminate client JavaScript for static content
- Tree-shaking with ES modules
- Only import used shadcn components
- Framer Motion lazy-load only when mobile menu rendered
- No polyfills for modern browsers (target last 2 versions)

**Target Bundle Sizes**:
- First Load JS: < 100kb (gzipped)
- Client bundle: < 50kb (gzipped) for homepage
- CSS: < 10kb (gzipped) with Tailwind purge

---

## Testing Strategy

### Test Pyramid

**E2E Tests (Playwright)** - ~10 tests:
- User Story 1: Homepage loads with all elements visible
- User Story 1: Header remains fixed on scroll
- User Story 2: Nav links don't navigate away
- User Story 2: Home link scrolls to top
- User Story 3: Keyboard navigation through all links
- User Story 3: Responsive layout at 320px, 375px, 640px, 1440px
- User Story 3: Mobile menu toggle behavior
- User Story 3: Click outside closes menu
- User Story 3: Clicking menu link closes menu
- Accessibility: No critical axe-core violations

**Integration Tests (Vitest)** - ~5-8 tests:
- Navigation state management
- Mobile menu toggle with keyboard
- Click outside detection
- Footer copyright year updates

**Unit Tests (Vitest + RTL)** - ~15-20 tests:
- Header renders with correct structure
- Navigation renders all links in order
- MobileNav toggle state
- Footer renders copyright with current year
- Each component prop handling

### TDD Workflow

**Red → Green → Refactor**:

1. **Red**: Write failing test
   ```typescript
   test('Header renders logo and navigation', () => {
     render(<Header />);
     expect(screen.getByRole('banner')).toBeInTheDocument();
     expect(screen.getByRole('navigation')).toBeInTheDocument();
   });
   ```

2. **Green**: Minimal implementation to pass
   ```tsx
   export function Header() {
     return (
       <header role="banner">
         <nav role="navigation">{/* links */}</nav>
       </header>
     );
   }
   ```

3. **Refactor**: Improve code quality, extract constants, add types

---

## Security Considerations

### Security Headers

**Configuration** (next.config.ts):
```typescript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'nonce-{NONCE}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
  },
];
```

**Rationale**:
- X-Frame-Options: Prevent clickjacking
- X-Content-Type-Options: Prevent MIME sniffing
- Referrer-Policy: Privacy protection
- HSTS: Force HTTPS (production)
- CSP: XSS protection (nonce for Framer Motion inline styles)

### Dependency Management

**Strategy**:
- npm audit in CI pipeline (fail on high/critical)
- Dependabot alerts enabled
- Lock file committed (package-lock.json)
- Review security advisories before upgrading
- No secrets in repo (use .env.local, .gitignore)

---

## Development Environment Setup

### Required Tools

**Core**:
- Node.js 18+ (LTS)
- npm 9+
- Git

**VS Code Extensions** (recommended):
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript
- Playwright Test for VSCode

### Initial Setup Commands

```bash
# Install dependencies
npm install

# Install shadcn/ui
npx shadcn@latest init

# Install testing tools
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitest/ui
npm install -D playwright @playwright/test @axe-core/playwright

# Install additional dependencies
npm install framer-motion zod class-variance-authority clsx tailwind-merge

# Setup Playwright browsers
npx playwright install
```

### Configuration Files

**vitest.config.ts**: Vitest + React Testing Library setup
**playwright.config.ts**: Playwright browser config, base URL, trace settings
**components.json**: shadcn/ui configuration
**tailwind.config.ts**: Custom theme tokens
**tsconfig.json**: Strict mode enabled, path aliases

---

## Implementation Phases

### Phase 1: Foundation (Test-First)

1. **Setup tooling**: Install dependencies, configure test frameworks
2. **Write E2E tests**: Playwright tests for user stories (failing)
3. **Write component unit tests**: Vitest + RTL for each component (failing)
4. **Implement components**: Make tests pass one at a time
5. **Accessibility audit**: Run axe-core, fix violations

### Phase 2: Refinement

1. **Responsive testing**: Verify all breakpoints
2. **Performance testing**: Measure CWV, optimize if needed
3. **Browser testing**: Test on Chrome, Firefox, Safari, Edge
4. **Accessibility manual testing**: Keyboard navigation, screen reader

### Phase 3: Polish

1. **Animation tuning**: Framer Motion transitions feel smooth
2. **Visual design**: Apply final design tokens, spacing, typography
3. **Documentation**: Update README with setup instructions
4. **CI/CD**: Configure GitHub Actions for tests, linting, type checking

---

## Open Questions & Future Considerations

### Resolved Questions

✅ How to handle JavaScript-disabled users?  
**Answer**: Server Components provide full HTML content without JS. Mobile menu degrades gracefully (fallback to always-visible nav or CSS-only solution).

✅ Should we use next/font for custom fonts?  
**Answer**: Yes, use `next/font/google` or `next/font/local` for optimal font loading (preload, font-display: swap).

✅ How to prevent hash fragments in URL when clicking placeholder links?  
**Answer**: Use `onClick={(e) => e.preventDefault()}` on Work/About/Contact links.

### Future Enhancements (out of scope for this feature)

- Dark mode toggle (planned for future feature)
- Internationalization (i18n) for multi-language support
- Analytics integration (Google Analytics / Plausible)
- Animation preferences (respect prefers-reduced-motion)
- Progressive Web App (PWA) features

---

## References & Resources

### Official Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)
- [Zod](https://zod.dev/)

### Best Practices
- [Next.js Server Components Patterns](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)

### Community Resources
- [shadcn/ui Examples](https://ui.shadcn.com/examples)
- [Framer Motion Examples](https://www.framer.com/motion/examples/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

**Status**: ✅ All technical decisions documented and rationale provided. Ready for Phase 1 (Design & Contracts).

