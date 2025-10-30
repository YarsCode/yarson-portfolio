# Data Model

**Feature**: Yarson Portfolio Homepage  
**Phase**: 1 (Design & Contracts)  
**Date**: 2025-10-28

## Overview

This document defines the data structures, entities, validation rules, and state management for the Yarson Portfolio homepage. Since this is a static homepage without backend persistence, the model focuses on client-side data structures and validation.

---

## Entities

### 1. NavigationLink

**Description**: Represents a single navigation link in the header or footer navigation.

**Schema** (Zod):
```typescript
import { z } from 'zod';

export const NavigationLinkSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(20),
  href: z.string().url().or(z.literal('#')),
  action: z.enum(['navigate', 'scroll-to-top', 'placeholder']),
  order: z.number().int().nonnegative(),
});

export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
```

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | Non-empty string | Unique identifier (e.g., "home", "work") |
| `label` | string | Yes | 1-20 characters | Display text (e.g., "Home", "Work") |
| `href` | string | Yes | Valid URL or "#" | Link destination |
| `action` | enum | Yes | One of: navigate, scroll-to-top, placeholder | Link behavior |
| `order` | number | Yes | Non-negative integer | Display order (0-based) |

**Validation Rules**:
- `label` must be non-empty and readable (1-20 chars)
- `href` must be valid URL or "#" for placeholder links
- `action` determines click behavior:
  - `navigate`: Normal link navigation
  - `scroll-to-top`: Scroll viewport to top (Home link)
  - `placeholder`: Prevent default, no navigation (Work/About/Contact)
- `order` ensures consistent rendering order

**Example Instance**:
```typescript
const homeLink: NavigationLink = {
  id: 'home',
  label: 'Home',
  href: '#',
  action: 'scroll-to-top',
  order: 0,
};

const workLink: NavigationLink = {
  id: 'work',
  label: 'Work',
  href: '#',
  action: 'placeholder',
  order: 1,
};
```

---

### 2. NavigationConfig

**Description**: Complete navigation configuration for the entire site.

**Schema** (Zod):
```typescript
export const NavigationConfigSchema = z.object({
  links: z.array(NavigationLinkSchema).min(1).max(10),
});

export type NavigationConfig = z.infer<typeof NavigationConfigSchema>;
```

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `links` | NavigationLink[] | Yes | 1-10 items, unique IDs | Array of navigation links |

**Validation Rules**:
- Must contain at least 1 link, maximum 10 links
- All link IDs must be unique
- Links should be ordered by `order` field

**Example Instance**:
```typescript
const navigationConfig: NavigationConfig = {
  links: [
    { id: 'home', label: 'Home', href: '#', action: 'scroll-to-top', order: 0 },
    { id: 'work', label: 'Work', href: '#', action: 'placeholder', order: 1 },
    { id: 'about', label: 'About', href: '#', action: 'placeholder', order: 2 },
    { id: 'contact', label: 'Contact', href: '#', action: 'placeholder', order: 3 },
  ],
};
```

---

### 3. CopyrightInfo

**Description**: Copyright information displayed in the footer.

**Schema** (Zod):
```typescript
export const CopyrightInfoSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  owner: z.string().min(1).max(100),
});

export type CopyrightInfo = z.infer<typeof CopyrightInfoSchema>;
```

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `year` | number | Yes | Integer between 2000-2100 | Copyright year (current year) |
| `owner` | string | Yes | 1-100 characters | Copyright holder name |

**Validation Rules**:
- `year` must be realistic (2000-2100 range)
- `owner` must be non-empty string
- Year should be computed at runtime (current year)

**Example Instance**:
```typescript
const copyrightInfo: CopyrightInfo = {
  year: new Date().getFullYear(),
  owner: 'Yarson',
};
```

**Display Format**: `© {year} {owner}` (e.g., "© 2025 Yarson")

---

### 4. MobileMenuState

**Description**: Client-side state for mobile hamburger menu.

**Schema** (Zod):
```typescript
export const MobileMenuStateSchema = z.object({
  isOpen: z.boolean(),
});

export type MobileMenuState = z.infer<typeof MobileMenuStateSchema>;
```

**Fields**:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `isOpen` | boolean | Yes | false | Whether mobile menu is open |

**State Transitions**:
```
Initial State: { isOpen: false }

Transitions:
1. Toggle button clicked: isOpen = !isOpen
2. Click outside menu: isOpen = false
3. Click menu link: isOpen = false
4. Escape key pressed: isOpen = false
```

**Example Usage** (React):
```typescript
const [menuState, setMenuState] = useState<MobileMenuState>({ isOpen: false });

const toggleMenu = () => {
  setMenuState({ isOpen: !menuState.isOpen });
};

const closeMenu = () => {
  setMenuState({ isOpen: false });
};
```

---

## Constants

### Navigation Links Configuration

**File**: `app/lib/constants.ts`

**Definition**:
```typescript
import { NavigationConfig } from '@/app/types/nav';

export const NAV_LINKS: NavigationConfig = {
  links: [
    {
      id: 'home',
      label: 'Home',
      href: '#',
      action: 'scroll-to-top',
      order: 0,
    },
    {
      id: 'work',
      label: 'Work',
      href: '#',
      action: 'placeholder',
      order: 1,
    },
    {
      id: 'about',
      label: 'About',
      href: '#',
      action: 'placeholder',
      order: 2,
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '#',
      action: 'placeholder',
      order: 3,
    },
  ],
};

// Validate at module load time
NavigationConfigSchema.parse(NAV_LINKS);
```

### Copyright Configuration

**Definition**:
```typescript
export const COPYRIGHT_OWNER = 'Yarson';

export const getCopyrightInfo = (): CopyrightInfo => ({
  year: new Date().getFullYear(),
  owner: COPYRIGHT_OWNER,
});

// Validate return value
export const getCopyrightText = (): string => {
  const info = getCopyrightInfo();
  CopyrightInfoSchema.parse(info);
  return `© ${info.year} ${info.owner}`;
};
```

---

## Type Definitions

### TypeScript Interfaces

**File**: `app/types/nav.ts`

```typescript
import { z } from 'zod';

// Re-export Zod schemas for validation
export {
  NavigationLinkSchema,
  NavigationConfigSchema,
  CopyrightInfoSchema,
  MobileMenuStateSchema,
} from './schemas';

// Inferred TypeScript types
export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
export type NavigationConfig = z.infer<typeof NavigationConfigSchema>;
export type CopyrightInfo = z.infer<typeof CopyrightInfoSchema>;
export type MobileMenuState = z.infer<typeof MobileMenuStateSchema>;

// Action type for navigation links
export type NavigationAction = 'navigate' | 'scroll-to-top' | 'placeholder';

// Helper type for link click handlers
export type NavigationLinkHandler = (
  link: NavigationLink,
  event: React.MouseEvent<HTMLAnchorElement>
) => void;
```

---

## Data Flow

### Server Components (No State)

```
Constants (app/lib/constants.ts)
    ↓
Header/Footer Components (Server)
    ↓
Rendered HTML (static wrapper)
```

**Characteristics**:
- No client-side state in Server Components
- Data read from constants at build time
- Fully static HTML generated for layout
- Minimal JavaScript (only in Navigation component)

---

### Client Components (Stateful)

```
Navigation Component (Client - Unified)
    ↓
useState(isMobileMenuOpen) → false
    ↓
User Interactions:
  Desktop (≥640px):
    - Click link → handleLinkClick()
    - No state changes (pure rendering)
  
  Mobile (<640px):
    - Click hamburger → toggleMobileMenu()
    - Click outside → closeMobileMenu()
    - Click link → handleLinkClick() + closeMobileMenu()
    - Press Escape → closeMobileMenu()
    ↓
Re-render with new state (mobile only)
```

**Characteristics**:
- Local component state (no global state)
- State only used for mobile menu drawer
- Desktop navigation is stateless
- Framer Motion animates mobile menu transitions
- ARIA attributes reflect state (`aria-expanded` on hamburger button)
- Responsive behavior handled via CSS classes (hidden/flex sm:hidden/sm:flex)

---

## Validation Strategy

### Build-Time Validation

**Purpose**: Catch configuration errors early in development

**Implementation**:
```typescript
// app/lib/constants.ts
import { NavigationConfigSchema } from '@/app/types/nav';

export const NAV_LINKS = {
  links: [/* ... */],
};

// This will throw if NAV_LINKS is invalid
NavigationConfigSchema.parse(NAV_LINKS);
```

**Benefits**:
- TypeScript compilation fails if schema is violated
- Prevents invalid navigation config from reaching production
- Self-documenting validation rules

---

### Runtime Validation

**Purpose**: Validate dynamic data or external inputs (future-proofing)

**Implementation**:
```typescript
// Example: Validate props in components
export function Navigation({ links }: { links: NavigationLink[] }) {
  // Validate props in development mode
  if (process.env.NODE_ENV === 'development') {
    z.array(NavigationLinkSchema).parse(links);
  }
  
  return (/* component JSX */);
}
```

**Note**: For this feature, runtime validation is minimal since all data is static. Future features with user input or API data will use `.safeParse()` for error handling.

---

## Component Props Interfaces

### Header Component

```typescript
// app/components/Header.tsx
interface HeaderProps {
  // No props needed (uses constants directly)
}
```

### Navigation Component

```typescript
// app/components/Navigation.tsx
interface NavigationProps {
  links: NavigationLink[];
  className?: string;
  ariaLabel?: string;
}
```

### Navigation Component (Unified)

```typescript
// app/components/Navigation.tsx
interface NavigationProps {
  links: NavigationLink[];
  className?: string;
  ariaLabel?: string;
}

interface NavigationState {
  isMobileMenuOpen: boolean;
}
```

### Footer Component

```typescript
// app/components/Footer.tsx
interface FooterProps {
  links: NavigationLink[];
  copyrightText: string;
}
```

---

## Edge Cases & Constraints

### Navigation Links

**Edge Cases**:
1. **Empty links array**: Validation prevents (min: 1 link required)
2. **Duplicate link IDs**: Should be prevented in constants (future: add validation)
3. **Invalid href**: Zod schema validates URL or "#" only
4. **Very long labels**: Max 20 characters enforced by schema
5. **Out-of-order links**: Should sort by `order` field before rendering

**Constraints**:
- Maximum 10 links (arbitrary limit, can be adjusted)
- Labels must be ASCII-compatible for best browser support
- IDs should be URL-safe (lowercase, no spaces)

---

### Copyright Info

**Edge Cases**:
1. **Year transition**: Function `getCopyrightInfo()` always returns current year (handles Dec 31 → Jan 1 automatically)
2. **Future years**: Validation allows 2000-2100 (prevents obvious errors)
3. **Empty owner**: Validation prevents (min: 1 character)

**Constraints**:
- Year computed at runtime (not build time) to stay current
- Owner name limited to 100 characters

---

### Mobile Menu State

**Edge Cases**:
1. **Multiple rapid toggles**: State updates are batched by React (no race conditions)
2. **Click outside while animating**: Close handler respects animation state
3. **Resize during open**: Menu should close on resize to desktop breakpoint (future enhancement)

**State Invariants**:
- `isOpen` is always boolean (TypeScript enforces)
- Only one menu instance per page (component structure guarantees)

---

## Testing Data

### Test Fixtures

**File**: `tests/fixtures/navigation.ts`

```typescript
import { NavigationConfig, CopyrightInfo } from '@/app/types/nav';

export const mockNavLinks: NavigationConfig = {
  links: [
    { id: 'home', label: 'Home', href: '#', action: 'scroll-to-top', order: 0 },
    { id: 'work', label: 'Work', href: '#', action: 'placeholder', order: 1 },
    { id: 'about', label: 'About', href: '#', action: 'placeholder', order: 2 },
    { id: 'contact', label: 'Contact', href: '#', action: 'placeholder', order: 3 },
  ],
};

export const mockCopyrightInfo: CopyrightInfo = {
  year: 2025,
  owner: 'Yarson',
};

export const mockEmptyNav: NavigationConfig = {
  links: [],
};

export const mockInvalidNav = {
  links: [
    { id: '', label: '', href: 'not-a-url', action: 'invalid', order: -1 },
  ],
};
```

### Validation Test Cases

```typescript
describe('NavigationLinkSchema', () => {
  it('validates correct link', () => {
    const result = NavigationLinkSchema.safeParse({
      id: 'home',
      label: 'Home',
      href: '#',
      action: 'scroll-to-top',
      order: 0,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty label', () => {
    const result = NavigationLinkSchema.safeParse({
      id: 'home',
      label: '',
      href: '#',
      action: 'navigate',
      order: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid action', () => {
    const result = NavigationLinkSchema.safeParse({
      id: 'home',
      label: 'Home',
      href: '#',
      action: 'invalid-action',
      order: 0,
    });
    expect(result.success).toBe(false);
  });
});
```

---

## Future Enhancements

### Potential Data Model Extensions

1. **Multi-level Navigation**: Support nested menu items (dropdowns)
   ```typescript
   children?: NavigationLink[];
   ```

2. **Icon Support**: Add icon field for visual enhancement
   ```typescript
   icon?: string; // Icon name or component reference
   ```

3. **Active Link Detection**: Track current page for highlighting
   ```typescript
   isActive?: boolean;
   ```

4. **External Link Indicators**: Flag external links for visual cue
   ```typescript
   isExternal?: boolean;
   target?: '_blank' | '_self';
   ```

5. **Analytics Tracking**: Add tracking metadata
   ```typescript
   trackingId?: string;
   trackingCategory?: string;
   ```

**Note**: These are intentionally excluded from the MVP to maintain simplicity per the feature spec.

---

## Data Model Summary

### Key Entities
1. ✅ NavigationLink - Individual nav items
2. ✅ NavigationConfig - Complete nav structure
3. ✅ CopyrightInfo - Footer copyright data
4. ✅ MobileMenuState - Client-side menu state

### Validation
- ✅ Zod schemas for runtime validation
- ✅ TypeScript types for compile-time safety
- ✅ Build-time validation of constants

### Data Flow
- ✅ Server Components: Static data from constants
- ✅ Client Components: Local state for interactions
- ✅ No global state management needed

### Testing
- ✅ Mock fixtures for unit tests
- ✅ Validation test cases
- ✅ Edge case handling documented

**Status**: ✅ Data model complete and ready for implementation.

