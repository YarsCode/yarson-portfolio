# Component Contracts

**Feature**: Yarson Portfolio Homepage  
**Date**: 2025-10-28

## Overview

This document defines the public interfaces (contracts) for all components in the Yarson Portfolio homepage. Each component contract specifies its props, behavior, and guarantees.

---

## Server Components

### 1. Header Component

**File**: `app/components/Header.tsx`

**Contract**:
```typescript
interface HeaderProps {
  // No props - uses shared constants
}

export function Header(): JSX.Element;
```

**Behavior**:
- Renders a fixed/floating header at the top of the viewport
- Contains brand/logo and Navigation component
- Always visible during scroll (position: fixed)
- Server-rendered shell (Navigation is client component)

**Accessibility**:
- Uses `<header>` semantic element
- Contains `role="banner"` landmark
- Ensures logical tab order through child components

**CSS Classes** (Tailwind):
```typescript
className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
```

**Guarantees**:
- ✅ Always renders without errors
- ✅ No layout shift (explicit height: h-16 = 64px)
- ✅ Minimal client JavaScript (only in Navigation child)
- ✅ Works without CSS (progressive enhancement)

---

### 2. Footer Component

**File**: `app/components/Footer.tsx`

**Contract**:
```typescript
interface FooterProps {
  // No props - uses shared constants
}

export function Footer(): JSX.Element;
```

**Behavior**:
- Renders footer with navigation links and copyright
- Navigation links identical to header (same order)
- Copyright text auto-updates with current year
- Server-rendered (no client JavaScript)

**Accessibility**:
- Uses `<footer>` semantic element
- Contains `role="contentinfo"` landmark
- Navigation uses `<nav role="navigation" aria-label="Footer navigation">`
- Copyright text in `<p>` element

**CSS Classes**:
```typescript
className="bg-gray-900 text-white py-8"
```

**Guarantees**:
- ✅ Copyright year is always current
- ✅ Navigation links match header
- ✅ Zero client JavaScript
- ✅ Renders correctly at all breakpoints

---

## Client Components

### 3. Navigation Component (Unified)

**File**: `app/components/Navigation.tsx`

**Contract**:
```typescript
'use client';

interface NavigationProps {
  links: NavigationLink[];
  className?: string;
  ariaLabel?: string;
}

interface NavigationState {
  isMobileMenuOpen: boolean;
}

export function Navigation(props: NavigationProps): JSX.Element;
```

**Props**:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `links` | `NavigationLink[]` | Yes | - | Array of navigation links to render |
| `className` | `string` | No | `""` | Additional CSS classes |
| `ariaLabel` | `string` | No | `"Main navigation"` | Accessible label for nav element |

**State**:

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `isMobileMenuOpen` | `boolean` | `false` | Whether mobile menu drawer is open |

**Behavior**:

**Desktop (≥640px)**:
- Renders horizontal list of navigation links
- Each link is keyboard accessible (Tab/Enter)
- Hover states for visual feedback
- No hamburger menu visible

**Mobile (<640px)**:
- Shows hamburger button only
- Desktop links hidden
- Hamburger button toggles mobile menu drawer
- Menu slides in/out with animation (Framer Motion)
- Clicking outside menu closes it
- Clicking any menu link closes menu
- Pressing Escape key closes menu

**Interactions**:

```typescript
// Toggle mobile menu
const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

// Close mobile menu (multiple triggers)
const closeMobileMenu = () => setIsMobileMenuOpen(false);

// Click outside detection
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (isMobileMenuOpen && !menuRef.current?.contains(e.target as Node)) {
      closeMobileMenu();
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isMobileMenuOpen]);

// Escape key handler
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileMenuOpen) closeMobileMenu();
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [isMobileMenuOpen]);

// Handle link clicks (scroll-to-top or placeholder)
const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavigationLink) => {
  if (link.action === 'scroll-to-top') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (link.action === 'placeholder') {
    e.preventDefault();
  }
  // Close mobile menu if open
  if (isMobileMenuOpen) closeMobileMenu();
};
```

**Accessibility**:
- Desktop nav: `<nav role="navigation" aria-label={ariaLabel}>`
- Each link: `<a>` element with valid href, focus indicators
- Hamburger button: `<button aria-expanded={isMobileMenuOpen} aria-label="Toggle menu">`
- Mobile menu: `<nav role="navigation" aria-label="Mobile navigation">`
- Focus management: Focus first link when mobile menu opens
- Keyboard navigation: Tab through links, Escape to close mobile menu

**CSS Classes**:
```typescript
// Desktop navigation (hidden on mobile)
<nav className="hidden sm:flex sm:items-center sm:gap-6">

// Mobile hamburger button (hidden on desktop)
<button className="flex sm:hidden">

// Mobile menu drawer
<nav className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-lg">
```

**Animation** (Mobile Menu):
```typescript
<motion.nav
  initial={{ x: '100%' }}
  animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
>
  {/* mobile menu content */}
</motion.nav>
```

**Validation**:
- Validates `links` prop with NavigationConfigSchema
- Throws error if validation fails (development mode)

**Guarantees**:
- ✅ Renders all links in order (desktop and mobile)
- ✅ Desktop view has zero state (pure render from props)
- ✅ Mobile menu opens/closes smoothly (≤300ms animation)
- ✅ No memory leaks (event listeners cleaned up)
- ✅ Keyboard accessible (Tab, Enter, Escape)
- ✅ ARIA attributes reflect current state
- ✅ Responsive behavior handled internally (no external coordination needed)

---

## Component Composition

### Root Layout

**File**: `app/layout.tsx`

**Contract**:
```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element;
```

**Composition Structure**:
```tsx
<html>
  <body>
    <Header />
    <main>{children}</main>
    <Footer />
  </body>
</html>
```

**Behavior**:
- Header and Footer rendered once for entire app
- Main content area receives page-specific children
- Server-rendered (except Navigation component inside Header)

---

### Homepage

**File**: `app/page.tsx`

**Contract**:
```typescript
export default function HomePage(): JSX.Element;
```

**Behavior**:
- Renders main content section
- Displays placeholder tagline: "AI-driven automations and integrations by Yarson."
- Server-rendered
- No props or state

**Accessibility**:
- Uses `<main>` semantic element
- Heading hierarchy: `<h1>` for tagline
- Skip link target: `id="main-content"`

---

## Navigation Link Handlers

### Link Click Handler

**Contract**:
```typescript
type NavigationLinkHandler = (
  link: NavigationLink,
  event: React.MouseEvent<HTMLAnchorElement>
) => void;

const handleLinkClick: NavigationLinkHandler = (link, event) => {
  switch (link.action) {
    case 'scroll-to-top':
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 'placeholder':
      event.preventDefault();
      // No action (link is placeholder)
      break;
    case 'navigate':
      // Default browser behavior (follow href)
      break;
  }
};
```

**Behavior**:
- `scroll-to-top`: Prevent default, smooth scroll to top
- `placeholder`: Prevent default, no action
- `navigate`: Allow default browser navigation

**Guarantees**:
- ✅ No URL hash changes for placeholder links
- ✅ Smooth scroll animation for "Home" link
- ✅ Keyboard activation works (Enter key)

---

## Error Boundaries

### Component Error Boundary

**Contract**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ComponentErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

**Usage**:
```tsx
<ComponentErrorBoundary fallback={<ErrorFallback />}>
  <MobileNav links={NAV_LINKS.links} />
</ComponentErrorBoundary>
```

---

## Testing Contracts

### Component Test Interface

Each component MUST have corresponding tests that verify:

1. **Rendering Contract**:
   ```typescript
   test('renders without crashing', () => {
     render(<Component {...requiredProps} />);
     expect(screen.getByRole('...')).toBeInTheDocument();
   });
   ```

2. **Props Contract**:
   ```typescript
   test('renders with all props', () => {
     render(<Component {...allProps} />);
     // Verify each prop affects output correctly
   });
   ```

3. **Accessibility Contract**:
   ```typescript
   test('has no accessibility violations', async () => {
     const { container } = render(<Component />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

4. **Interaction Contract** (Client Components):
   ```typescript
   test('handles user interaction', async () => {
     render(<MobileNav links={mockLinks} />);
     const button = screen.getByLabelText('Toggle menu');
     await userEvent.click(button);
     expect(button).toHaveAttribute('aria-expanded', 'true');
   });
   ```

---

## Performance Contracts

### Rendering Performance

**Contract**: All components MUST render within performance budgets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Render | <50ms | React DevTools Profiler |
| Re-render (state change) | <16ms | React DevTools Profiler |
| Animation frame rate | 60fps | Browser DevTools Performance |
| Bundle size (Client Components) | <10kb gzipped | Webpack Bundle Analyzer |

**Guarantees**:
- ✅ Server Components have zero client bundle size
- ✅ Client Components use code splitting (lazy load if >10kb)
- ✅ No unnecessary re-renders (React.memo where appropriate)

---

## Security Contracts

### XSS Prevention

**Contract**: All components MUST prevent XSS attacks

**Implementation**:
```typescript
// ✅ Safe: React escapes by default
<div>{userContent}</div>

// ❌ Unsafe: Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Safe: Sanitize if HTML required
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

**Guarantees**:
- ✅ No `dangerouslySetInnerHTML` without sanitization
- ✅ All text content escaped by React
- ✅ Links validated with Zod schema

---

### CSRF Prevention

**Contract**: N/A for this feature (no mutations)

**Future**: When forms added, all mutations MUST use CSRF tokens

---

## Versioning Contract

### Breaking Changes

A breaking change to a component contract is defined as:

1. **Removing or renaming a required prop**
2. **Changing prop type incompatibly** (e.g., string → number)
3. **Changing default behavior** that external code depends on
4. **Removing public methods or callbacks**

**Version Bump Requirements**:
- Breaking changes → MAJOR version bump
- New optional props → MINOR version bump
- Bug fixes without API changes → PATCH version bump

---

## Documentation Contract

### Required Documentation

Each component MUST have:

1. **JSDoc comment** with description and examples
2. **TypeScript interface** for all props
3. **Storybook story** (future) showing usage
4. **README** (for complex components) with:
   - Purpose and use cases
   - Props documentation
   - Examples
   - Accessibility notes

**Example**:
```typescript
/**
 * Navigation component renders a horizontal list of navigation links.
 * 
 * @example
 * ```tsx
 * <Navigation 
 *   links={NAV_LINKS.links} 
 *   ariaLabel="Main navigation"
 * />
 * ```
 * 
 * @param props - Navigation component props
 * @returns Rendered navigation element
 */
export function Navigation(props: NavigationProps): JSX.Element {
  // ...
}
```

---

## Summary

### Component Contracts Overview

| Component | Type | Props | State | Client JS | Tests Required |
|-----------|------|-------|-------|-----------|----------------|
| Header | Server | None | None | No | Unit |
| Navigation | Client | links, className, ariaLabel | isMobileMenuOpen | Yes | Unit + Integration |
| Footer | Server | None | None | No | Unit |
| HomePage | Server | None | None | No | E2E |
| Layout | Server | children | None | No | E2E |

### Key Principles

1. ✅ **Explicit Contracts**: All props typed with TypeScript
2. ✅ **Validation**: Zod schemas validate data at boundaries
3. ✅ **Accessibility**: ARIA attributes and semantic HTML
4. ✅ **Performance**: Budget enforcement and monitoring
5. ✅ **Security**: XSS prevention and input sanitization
6. ✅ **Testing**: Comprehensive test coverage per contract

**Status**: ✅ All component contracts defined and ready for implementation.

