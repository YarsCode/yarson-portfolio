import { NavigationConfig, NavigationConfigSchema, CopyrightInfo, CopyrightInfoSchema } from '@/app/types/schemas';

/**
 * Navigation links configuration
 * Defines all navigation items for header and footer
 */
export const NAV_LINKS: NavigationConfig = {
  links: [
    {
      id: 'home',
      label: 'Home',
      href: '/',
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

// Validate navigation config at module load time
NavigationConfigSchema.parse(NAV_LINKS);

/**
 * Copyright configuration
 */
export const COPYRIGHT_OWNER = 'Yarson';

/**
 * Get copyright information with current year
 * @returns CopyrightInfo object with current year and owner
 */
export const getCopyrightInfo = (): CopyrightInfo => ({
  year: new Date().getFullYear(),
  owner: COPYRIGHT_OWNER,
});

/**
 * Get formatted copyright text
 * @returns Formatted copyright string (e.g., "© 2025 Yarson")
 */
export const getCopyrightText = (): string => {
  const info = getCopyrightInfo();
  CopyrightInfoSchema.parse(info);
  return `© ${info.year} ${info.owner}`;
};

