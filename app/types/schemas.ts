import { z } from 'zod';

/**
 * Zod schema for a single navigation link
 * Validates structure, data types, and business rules
 */
export const NavigationLinkSchema = z.object({
  id: z.string()
    .min(1, 'Link ID cannot be empty'),
  
  label: z.string()
    .min(1, 'Link label cannot be empty'),
  
  href: z.string()
    .min(1, 'Link href cannot be empty')
    .refine(
      (val) => val.startsWith('#') || val.startsWith('/') || z.string().url().safeParse(val).success,
      'Must be a valid URL, path, or anchor link'
    ),
  
  action: z.enum(['navigate', 'scroll-to-top', 'placeholder'], {
    message: 'Invalid action type',
  }),
  
  order: z.number()
    .int('Order must be an integer')
    .nonnegative('Order must be non-negative'),
});

export type NavigationLink = z.infer<typeof NavigationLinkSchema>;

/**
 * Zod schema for navigation configuration
 * Validates array of links with uniqueness constraints
 */
export const NavigationConfigSchema = z.object({
  links: z.array(NavigationLinkSchema)
    .min(1, 'Navigation must have at least one link')
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

/**
 * Zod schema for copyright information
 */
export const CopyrightInfoSchema = z.object({
  year: z.number()
    .int('Year must be an integer'),
  
  owner: z.string()
    .min(1, 'Copyright owner cannot be empty'),
});

export type CopyrightInfo = z.infer<typeof CopyrightInfoSchema>;

/**
 * Zod schema for mobile menu state
 * Simple boolean state for open/closed
 */
export const MobileMenuStateSchema = z.object({
  isOpen: z.boolean(),
});

export type MobileMenuState = z.infer<typeof MobileMenuStateSchema>;

