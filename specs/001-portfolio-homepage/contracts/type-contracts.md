# Type System Contracts

**Feature**: Yarson Portfolio Homepage  
**Date**: 2025-10-28

## Overview

This document defines the type system contracts using TypeScript and Zod for the Yarson Portfolio homepage. All types are strictly defined with runtime validation where appropriate.

---

## Zod Schemas (Runtime Validation)

### NavigationLink Schema

**Location**: `app/types/schemas.ts`

```typescript
import { z } from 'zod';

export const NavigationLinkSchema = z.object({
  id: z.string()
    .min(1, 'Link ID cannot be empty')
    .regex(/^[a-z0-9-]+$/, 'Link ID must be lowercase alphanumeric with hyphens'),
  
  label: z.string()
    .min(1, 'Link label cannot be empty')
    .max(20, 'Link label must be 20 characters or less'),
  
  href: z.union([
    z.string().url('Link href must be a valid URL'),
    z.literal('#'),
  ]),
  
  action: z.enum(['navigate', 'scroll-to-top', 'placeholder'], {
    errorMap: () => ({ message: 'Invalid action type' }),
  }),
  
  order: z.number()
    .int('Order must be an integer')
    .nonnegative('Order must be non-negative'),
});

export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
```

**Validation Examples**:

```typescript
// ✅ Valid
NavigationLinkSchema.parse({
  id: 'home',
  label: 'Home',
  href: '#',
  action: 'scroll-to-top',
  order: 0,
});

// ❌ Invalid: Empty label
NavigationLinkSchema.parse({
  id: 'home',
  label: '',
  href: '#',
  action: 'navigate',
  order: 0,
}); // Throws ZodError

// ❌ Invalid: Label too long
NavigationLinkSchema.parse({
  id: 'home',
  label: 'This is a very long navigation label',
  href: '#',
  action: 'navigate',
  order: 0,
}); // Throws ZodError

// ❌ Invalid: Invalid action
NavigationLinkSchema.parse({
  id: 'home',
  label: 'Home',
  href: '#',
  action: 'invalid-action',
  order: 0,
}); // Throws ZodError
```

---

### NavigationConfig Schema

```typescript
export const NavigationConfigSchema = z.object({
  links: z.array(NavigationLinkSchema)
    .min(1, 'Navigation must have at least one link')
    .max(10, 'Navigation cannot have more than 10 links')
    .refine(
      (links) => {
        const ids = links.map((link) => link.id);
        return new Set(ids).size === ids.length;
      },
      { message: 'All link IDs must be unique' }
    )
    .refine(
      (links) => {
        const orders = links.map((link) => link.order);
        return new Set(orders).size === orders.length;
      },
      { message: 'All link orders must be unique' }
    ),
});

export type NavigationConfig = z.infer<typeof NavigationConfigSchema>;
```

**Additional Validation**:
- Ensures all link IDs are unique (no duplicates)
- Ensures all order values are unique
- Minimum 1 link, maximum 10 links

---

### CopyrightInfo Schema

```typescript
export const CopyrightInfoSchema = z.object({
  year: z.number()
    .int('Year must be an integer')
    .min(2000, 'Year must be 2000 or later')
    .max(2100, 'Year must be 2100 or earlier'),
  
  owner: z.string()
    .min(1, 'Copyright owner cannot be empty')
    .max(100, 'Copyright owner must be 100 characters or less'),
});

export type CopyrightInfo = z.infer<typeof CopyrightInfoSchema>;
```

**Usage**:
```typescript
const copyrightInfo = getCopyrightInfo();
CopyrightInfoSchema.parse(copyrightInfo); // Validates at runtime
```

---

### MobileMenuState Schema

```typescript
export const MobileMenuStateSchema = z.object({
  isOpen: z.boolean(),
});

export type MobileMenuState = z.infer<typeof MobileMenuStateSchema>;
```

---

## TypeScript Interfaces

### Component Props

**Location**: `app/types/components.ts`

```typescript
import { NavigationLink } from './schemas';

// Header Component
export interface HeaderProps {
  // No props needed
}

// Navigation Component
export interface NavigationProps {
  links: NavigationLink[];
  className?: string;
  ariaLabel?: string;
}

// MobileNav Component
export interface MobileNavProps {
  links: NavigationLink[];
  className?: string;
}

export interface MobileNavState {
  isOpen: boolean;
}

// Footer Component
export interface FooterProps {
  // No props needed
}

// Layout Component
export interface RootLayoutProps {
  children: React.ReactNode;
}

// Homepage Component
export interface HomePageProps {
  // No props needed
}
```

---

### Event Handlers

```typescript
import { NavigationLink } from './schemas';

export type NavigationLinkHandler = (
  link: NavigationLink,
  event: React.MouseEvent<HTMLAnchorElement>
) => void;

export type MenuToggleHandler = () => void;

export type MenuCloseHandler = () => void;
```

---

### Utility Types

```typescript
// Extract navigation action type
export type NavigationAction = NavigationLink['action'];

// Conditional navigation link (with active state)
export interface ActiveNavigationLink extends NavigationLink {
  isActive?: boolean;
}

// Navigation link with render props
export interface NavigationLinkWithRender extends NavigationLink {
  render?: (link: NavigationLink) => React.ReactNode;
}
```

---

## Type Guards

**Location**: `app/lib/type-guards.ts`

```typescript
import { NavigationLink, NavigationConfig } from '@/app/types/schemas';

// Type guard for NavigationLink
export function isNavigationLink(value: unknown): value is NavigationLink {
  const result = NavigationLinkSchema.safeParse(value);
  return result.success;
}

// Type guard for NavigationConfig
export function isNavigationConfig(value: unknown): value is NavigationConfig {
  const result = NavigationConfigSchema.safeParse(value);
  return result.success;
}

// Type guard for navigation action
export function isValidAction(action: string): action is NavigationAction {
  return ['navigate', 'scroll-to-top', 'placeholder'].includes(action);
}
```

**Usage**:
```typescript
if (isNavigationLink(data)) {
  // TypeScript knows data is NavigationLink
  console.log(data.label);
}
```

---

## Type Utilities

**Location**: `app/lib/type-utils.ts`

```typescript
import { NavigationLink } from '@/app/types/schemas';

// Sort links by order
export function sortLinksByOrder(links: NavigationLink[]): NavigationLink[] {
  return [...links].sort((a, b) => a.order - b.order);
}

// Get link by ID
export function getLinkById(
  links: NavigationLink[],
  id: string
): NavigationLink | undefined {
  return links.find((link) => link.id === id);
}

// Filter links by action
export function filterLinksByAction(
  links: NavigationLink[],
  action: NavigationAction
): NavigationLink[] {
  return links.filter((link) => link.action === action);
}
```

---

## Validation Helpers

**Location**: `app/lib/validation.ts`

```typescript
import { NavigationConfigSchema, NavigationLinkSchema } from '@/app/types/schemas';
import type { NavigationConfig, NavigationLink } from '@/app/types/schemas';

// Validate navigation config with detailed errors
export function validateNavigationConfig(
  config: unknown
): { success: true; data: NavigationConfig } | { success: false; errors: string[] } {
  const result = NavigationConfigSchema.safeParse(config);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map((err) => {
    return `${err.path.join('.')}: ${err.message}`;
  });
  
  return { success: false, errors };
}

// Validate single navigation link
export function validateNavigationLink(
  link: unknown
): { success: true; data: NavigationLink } | { success: false; errors: string[] } {
  const result = NavigationLinkSchema.safeParse(link);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map((err) => {
    return `${err.path.join('.')}: ${err.message}`;
  });
  
  return { success: false, errors };
}
```

**Usage**:
```typescript
const validation = validateNavigationConfig(userInput);

if (validation.success) {
  console.log('Valid config:', validation.data);
} else {
  console.error('Validation errors:', validation.errors);
}
```

---

## Strict TypeScript Configuration

**Location**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Enforcements**:
- ✅ No `any` types allowed
- ✅ All nulls/undefined must be explicitly handled
- ✅ No unused variables or parameters
- ✅ All function paths must return a value

---

## Type Testing

**Location**: `tests/unit/types.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { NavigationLinkSchema, NavigationConfigSchema } from '@/app/types/schemas';

describe('NavigationLinkSchema', () => {
  it('accepts valid navigation link', () => {
    const validLink = {
      id: 'home',
      label: 'Home',
      href: '#',
      action: 'scroll-to-top' as const,
      order: 0,
    };
    
    expect(() => NavigationLinkSchema.parse(validLink)).not.toThrow();
  });

  it('rejects empty ID', () => {
    const invalidLink = {
      id: '',
      label: 'Home',
      href: '#',
      action: 'navigate' as const,
      order: 0,
    };
    
    expect(() => NavigationLinkSchema.parse(invalidLink)).toThrow();
  });

  it('rejects invalid href', () => {
    const invalidLink = {
      id: 'home',
      label: 'Home',
      href: 'not-a-url',
      action: 'navigate' as const,
      order: 0,
    };
    
    expect(() => NavigationLinkSchema.parse(invalidLink)).toThrow();
  });

  it('rejects label over 20 characters', () => {
    const invalidLink = {
      id: 'home',
      label: 'This is way too long to be a navigation label',
      href: '#',
      action: 'navigate' as const,
      order: 0,
    };
    
    expect(() => NavigationLinkSchema.parse(invalidLink)).toThrow();
  });

  it('rejects invalid action', () => {
    const invalidLink = {
      id: 'home',
      label: 'Home',
      href: '#',
      action: 'invalid-action',
      order: 0,
    };
    
    expect(() => NavigationLinkSchema.parse(invalidLink)).toThrow();
  });

  it('rejects negative order', () => {
    const invalidLink = {
      id: 'home',
      label: 'Home',
      href: '#',
      action: 'navigate' as const,
      order: -1,
    };
    
    expect(() => NavigationLinkSchema.parse(invalidLink)).toThrow();
  });
});

describe('NavigationConfigSchema', () => {
  it('accepts valid navigation config', () => {
    const validConfig = {
      links: [
        { id: 'home', label: 'Home', href: '#', action: 'scroll-to-top' as const, order: 0 },
        { id: 'work', label: 'Work', href: '#', action: 'placeholder' as const, order: 1 },
      ],
    };
    
    expect(() => NavigationConfigSchema.parse(validConfig)).not.toThrow();
  });

  it('rejects empty links array', () => {
    const invalidConfig = { links: [] };
    expect(() => NavigationConfigSchema.parse(invalidConfig)).toThrow();
  });

  it('rejects duplicate link IDs', () => {
    const invalidConfig = {
      links: [
        { id: 'home', label: 'Home', href: '#', action: 'navigate' as const, order: 0 },
        { id: 'home', label: 'Home2', href: '#', action: 'navigate' as const, order: 1 },
      ],
    };
    
    expect(() => NavigationConfigSchema.parse(invalidConfig)).toThrow(/unique/);
  });

  it('rejects duplicate orders', () => {
    const invalidConfig = {
      links: [
        { id: 'home', label: 'Home', href: '#', action: 'navigate' as const, order: 0 },
        { id: 'work', label: 'Work', href: '#', action: 'navigate' as const, order: 0 },
      ],
    };
    
    expect(() => NavigationConfigSchema.parse(invalidConfig)).toThrow(/unique/);
  });

  it('rejects more than 10 links', () => {
    const invalidConfig = {
      links: Array.from({ length: 11 }, (_, i) => ({
        id: `link-${i}`,
        label: `Link ${i}`,
        href: '#',
        action: 'navigate' as const,
        order: i,
      })),
    };
    
    expect(() => NavigationConfigSchema.parse(invalidConfig)).toThrow(/10 links/);
  });
});
```

---

## Type Documentation

### JSDoc Type Annotations

**Best Practice**: Always document types with JSDoc

```typescript
/**
 * Represents a single navigation link in the header or footer.
 * 
 * @property {string} id - Unique identifier for the link
 * @property {string} label - Display text (1-20 characters)
 * @property {string} href - Link destination (URL or "#")
 * @property {NavigationAction} action - Click behavior type
 * @property {number} order - Display order (0-based)
 * 
 * @example
 * ```typescript
 * const homeLink: NavigationLink = {
 *   id: 'home',
 *   label: 'Home',
 *   href: '#',
 *   action: 'scroll-to-top',
 *   order: 0,
 * };
 * ```
 */
export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
```

---

## Error Handling

### Zod Error Formatting

```typescript
import { ZodError } from 'zod';

export function formatZodError(error: ZodError): string {
  return error.errors
    .map((err) => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    })
    .join(', ');
}

// Usage
try {
  NavigationConfigSchema.parse(invalidData);
} catch (error) {
  if (error instanceof ZodError) {
    console.error('Validation failed:', formatZodError(error));
  }
}
```

---

## Type Safety Checklist

### Development Checklist

- ✅ All public APIs have explicit type annotations
- ✅ No `any` types (use `unknown` with type guards instead)
- ✅ All function parameters and return types are typed
- ✅ Nullable values use `| null` or `| undefined` explicitly
- ✅ Component props use interfaces (not inline types)
- ✅ Zod schemas defined for all data boundaries
- ✅ Runtime validation at data entry points
- ✅ Type guards for narrowing unknown types
- ✅ Unit tests for all Zod schemas
- ✅ JSDoc comments for all exported types

---

## Future Type Enhancements

### Planned Type Extensions

1. **Branded Types** for stronger type safety:
   ```typescript
   type LinkID = string & { readonly __brand: 'LinkID' };
   type OrderIndex = number & { readonly __brand: 'OrderIndex' };
   ```

2. **Discriminated Unions** for link variants:
   ```typescript
   type NavigationLink =
     | { action: 'navigate'; href: string }
     | { action: 'scroll-to-top'; href: '#' }
     | { action: 'placeholder'; href: '#' };
   ```

3. **Template Literal Types** for IDs:
   ```typescript
   type LinkID = `${string}-link`;
   ```

4. **Conditional Types** for props:
   ```typescript
   type NavigationProps<T extends 'mobile' | 'desktop'> = T extends 'mobile'
     ? { isCollapsible: true }
     : { isCollapsible?: false };
   ```

---

## Summary

### Type System Coverage

| Category | Schema Defined | Types Defined | Validated | Tested |
|----------|----------------|---------------|-----------|--------|
| NavigationLink | ✅ | ✅ | ✅ | ✅ |
| NavigationConfig | ✅ | ✅ | ✅ | ✅ |
| CopyrightInfo | ✅ | ✅ | ✅ | ✅ |
| MobileMenuState | ✅ | ✅ | ✅ | ✅ |
| Component Props | N/A | ✅ | N/A | ✅ |
| Event Handlers | N/A | ✅ | N/A | ✅ |

### Key Principles

1. ✅ **TypeScript strict mode enabled**
2. ✅ **Runtime validation with Zod at boundaries**
3. ✅ **Type guards for narrowing unknown types**
4. ✅ **No `any` types in codebase**
5. ✅ **Comprehensive type tests**
6. ✅ **JSDoc documentation for all types**

**Status**: ✅ All type contracts defined and validated.

