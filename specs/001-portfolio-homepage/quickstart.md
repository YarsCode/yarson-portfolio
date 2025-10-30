# Quickstart Guide

**Feature**: Yarson Portfolio Homepage  
**Date**: 2025-10-28  
**Estimated Time**: 4-6 hours (TDD approach)

## Overview

This guide walks you through implementing the Yarson Portfolio homepage from scratch using Test-Driven Development (TDD). Follow the steps in order to build a production-ready homepage with proper testing, accessibility, and performance.

---

## Prerequisites

### Required Tools

- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+
- **Git**: Latest version
- **IDE**: VS Code (recommended) or your preferred editor

### Recommended VS Code Extensions

```bash
# Install via VS Code Extensions Marketplace
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript
- Playwright Test for VSCode
- Error Lens
```

---

## Step 1: Verify Environment

**Estimated Time**: 5 minutes

```bash
# Navigate to project root
cd /Users/yars/Documents/VSCode/yarson-portfolio

# Verify Node.js version (should be 18+)
node --version

# Verify npm version (should be 9+)
npm --version

# Verify Next.js is installed
npm list next
```

**Expected Output**: Next.js 16.x, React 19.x already installed

---

## Step 2: Install Dependencies

**Estimated Time**: 10 minutes

### Core Dependencies

```bash
# Install Framer Motion for animations
npm install framer-motion

# Install Zod for validation
npm install zod

# Install class-variance-authority and utility libraries (for shadcn)
npm install class-variance-authority clsx tailwind-merge
```

### Development Dependencies (Testing)

```bash
# Install Vitest and React Testing Library
npm install -D vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @vitest/ui jsdom

# Install Playwright for E2E testing
npm install -D @playwright/test
npm install -D @axe-core/playwright

# Install Playwright browsers
npx playwright install
```

### shadcn/ui Setup

```bash
# Initialize shadcn/ui (follow prompts)
npx shadcn@latest init

# When prompted, choose:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate (or your preference)
# - CSS variables: Yes
# - Import alias: @/
```

**Note**: This creates `components.json` and sets up the basic configuration.

---

## Step 3: Configure Testing Frameworks

**Estimated Time**: 15 minutes

### Create Vitest Configuration

**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.*',
        '.next/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### Create Test Setup File

**File**: `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers with Testing Library matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

### Create Playwright Configuration

**File**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Update package.json Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## Step 4: Create Directory Structure

**Estimated Time**: 5 minutes

```bash
# Create component directories
mkdir -p app/components/ui
mkdir -p app/lib
mkdir -p app/types

# Create test directories
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e
mkdir -p tests/fixtures
```

---

## Step 5: Define Types and Schemas (TDD Foundation)

**Estimated Time**: 30 minutes

### Create Zod Schemas

**File**: `app/types/schemas.ts`

```typescript
import { z } from 'zod';

export const NavigationLinkSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  label: z.string().min(1).max(20),
  href: z.union([z.string().url(), z.literal('#')]),
  action: z.enum(['navigate', 'scroll-to-top', 'placeholder']),
  order: z.number().int().nonnegative(),
});

export const NavigationConfigSchema = z.object({
  links: z.array(NavigationLinkSchema).min(1).max(10),
});

export const CopyrightInfoSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  owner: z.string().min(1).max(100),
});

export const MobileMenuStateSchema = z.object({
  isOpen: z.boolean(),
});

export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
export type NavigationConfig = z.infer<typeof NavigationConfigSchema>;
export type CopyrightInfo = z.infer<typeof CopyrightInfoSchema>;
export type MobileMenuState = z.infer<typeof MobileMenuStateSchema>;
export type NavigationAction = NavigationLink['action'];
```

### Create Type Interfaces

**File**: `app/types/components.ts`

```typescript
import { NavigationLink } from './schemas';

export interface HeaderProps {}

export interface NavigationProps {
  links: NavigationLink[];
  className?: string;
  ariaLabel?: string;
}

export interface FooterProps {}

export interface RootLayoutProps {
  children: React.ReactNode;
}
```

### Create Constants

**File**: `app/lib/constants.ts`

```typescript
import { NavigationConfig, NavigationConfigSchema, CopyrightInfo } from '@/app/types/schemas';

export const NAV_LINKS: NavigationConfig = {
  links: [
    { id: 'home', label: 'Home', href: '#', action: 'scroll-to-top', order: 0 },
    { id: 'work', label: 'Work', href: '#', action: 'placeholder', order: 1 },
    { id: 'about', label: 'About', href: '#', action: 'placeholder', order: 2 },
    { id: 'contact', label: 'Contact', href: '#', action: 'placeholder', order: 3 },
  ],
};

// Validate at module load
NavigationConfigSchema.parse(NAV_LINKS);

export const COPYRIGHT_OWNER = 'Yarson';

export const getCopyrightInfo = (): CopyrightInfo => ({
  year: new Date().getFullYear(),
  owner: COPYRIGHT_OWNER,
});

export const getCopyrightText = (): string => {
  const info = getCopyrightInfo();
  return `© ${info.year} ${info.owner}`;
};
```

### Create Utility Functions

**File**: `app/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Step 6: Write Tests First (Red Phase)

**Estimated Time**: 60 minutes

### Unit Tests for Navigation (Unified Component)

**File**: `tests/unit/Navigation.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from '@/app/components/Navigation';
import { NAV_LINKS } from '@/app/lib/constants';

describe('Navigation', () => {
  describe('Desktop view', () => {
    it('renders all navigation links', () => {
      render(<Navigation links={NAV_LINKS.links} />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders navigation with correct ARIA label', () => {
      render(<Navigation links={NAV_LINKS.links} ariaLabel="Main navigation" />);
      
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();
    });

    it('renders links in correct order', () => {
      render(<Navigation links={NAV_LINKS.links} />);
      
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveTextContent('Home');
      expect(links[1]).toHaveTextContent('Work');
      expect(links[2]).toHaveTextContent('About');
      expect(links[3]).toHaveTextContent('Contact');
    });
  });

  describe('Mobile view', () => {
    it('renders hamburger button', () => {
      render(<Navigation links={NAV_LINKS.links} />);
      
      const button = screen.getByLabelText('Toggle menu');
      expect(button).toBeInTheDocument();
    });

    it('opens mobile menu when hamburger clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation links={NAV_LINKS.links} />);
      
      const button = screen.getByLabelText('Toggle menu');
      await user.click(button);
      
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes mobile menu when link clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation links={NAV_LINKS.links} />);
      
      const button = screen.getByLabelText('Toggle menu');
      await user.click(button);
      
      const homeLink = screen.getAllByText('Home')[0];
      await user.click(homeLink);
      
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
```

### Unit Tests for Footer

**File**: `tests/unit/Footer.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/app/components/Footer';

describe('Footer', () => {
  it('renders footer element', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays current year in copyright', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Yarson`))).toBeInTheDocument();
  });

  it('renders navigation links in footer', () => {
    render(<Footer />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
```

### E2E Tests

**File**: `tests/e2e/homepage.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with header, main content, and footer', async ({ page }) => {
    await page.goto('/');
    
    // Check header
    await expect(page.locator('header')).toBeVisible();
    
    // Check main content
    const main = page.locator('main');
    await expect(main).toBeVisible();
    await expect(main).toContainText('AI-driven automations and integrations by Yarson');
    
    // Check footer
    await expect(page.locator('footer')).toBeVisible();
  });

  test('header remains fixed on scroll', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('header');
    const initialPosition = await header.boundingBox();
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    
    const scrolledPosition = await header.boundingBox();
    expect(scrolledPosition?.y).toBe(initialPosition?.y);
  });

  test('displays correct copyright year', async ({ page }) => {
    await page.goto('/');
    
    const currentYear = new Date().getFullYear();
    await expect(page.locator('footer')).toContainText(`© ${currentYear} Yarson`);
  });
});
```

### Run Tests (Should Fail - Red Phase)

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

**Expected**: All tests fail because components don't exist yet. This is correct TDD!

---

## Step 7: Implement Components (Green Phase)

**Estimated Time**: 90 minutes

### Navigation Component (Unified)

**File**: `app/components/Navigation.tsx`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationProps } from '@/app/types/components';
import { cn } from '@/app/lib/utils';

export function Navigation({ links, className, ariaLabel = 'Main navigation' }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, action: string) => {
    if (action === 'scroll-to-top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'placeholder') {
      e.preventDefault();
    }
    if (isMobileMenuOpen) closeMobileMenu();
  };

  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

  return (
    <div ref={menuRef} className={cn('flex items-center', className)}>
      {/* Desktop Navigation */}
      <nav 
        role="navigation" 
        aria-label={ariaLabel}
        className="hidden sm:flex items-center gap-6"
      >
        {sortedLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.action)}
            className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Mobile Menu */}
      <div className="flex sm:hidden">
        {/* Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
          className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={cn('h-0.5 w-full bg-gray-700 transition-transform', isMobileMenuOpen && 'rotate-45 translate-y-2')} />
            <span className={cn('h-0.5 w-full bg-gray-700 transition-opacity', isMobileMenuOpen && 'opacity-0')} />
            <span className={cn('h-0.5 w-full bg-gray-700 transition-transform', isMobileMenuOpen && '-rotate-45 -translate-y-2')} />
          </div>
        </button>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-lg z-40"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col p-6 gap-4">
                {sortedLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.action)}
                    className="text-gray-700 hover:text-gray-900 text-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

### Header Component

**File**: `app/components/Header.tsx`

```typescript
import { Navigation } from './Navigation';
import { NAV_LINKS } from '@/app/lib/constants';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-16" role="banner">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="text-xl font-bold">Yarson</div>
        
        {/* Unified Navigation (handles desktop + mobile) */}
        <Navigation links={NAV_LINKS.links} />
      </div>
    </header>
  );
}
```

### Footer Component

**File**: `app/components/Footer.tsx`

```typescript
import { NAV_LINKS, getCopyrightText } from '@/app/lib/constants';

export function Footer() {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, action: string) => {
    if (action === 'scroll-to-top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'placeholder') {
      e.preventDefault();
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-8" role="contentinfo">
      <div className="container mx-auto px-4">
        {/* Footer Navigation */}
        <nav role="navigation" aria-label="Footer navigation" className="mb-4">
          <ul className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.links
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.action)}
                    className="hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded px-2 py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-center text-sm text-gray-400">{getCopyrightText()}</p>
      </div>
    </footer>
  );
}
```

### Update Layout

**File**: `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yarson - AI-Driven Automations',
  description: 'Fullstack developer specializing in AI automations, chatbots, and integrations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-16 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### Update Homepage

**File**: `app/page.tsx`

```typescript
export default function HomePage() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900">
        AI-driven automations and integrations by Yarson.
      </h1>
    </section>
  );
}
```

### Run Tests Again (Should Pass - Green Phase)

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

**Expected**: All tests pass! ✅

---

## Step 8: Refactor and Polish

**Estimated Time**: 30 minutes

### Add Security Headers

**File**: `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Update Global Styles

**File**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }

  /* Focus visible styles for accessibility */
  *:focus-visible {
    @apply outline-2 outline-offset-2 outline-blue-500;
  }
}
```

---

## Step 9: Verify Everything Works

**Estimated Time**: 15 minutes

### Run Development Server

```bash
npm run dev
```

### Manual Testing Checklist

Open http://localhost:3000 and verify:

- ✅ Header is visible and fixed at top
- ✅ All 4 nav links present (Home, Work, About, Contact)
- ✅ Clicking "Home" scrolls to top
- ✅ Clicking Work/About/Contact prevents navigation
- ✅ Main tagline is visible
- ✅ Footer is visible with nav links and copyright
- ✅ Resize to <640px shows hamburger menu
- ✅ Hamburger opens/closes menu smoothly
- ✅ Clicking outside menu closes it
- ✅ Pressing Escape closes menu
- ✅ Tab key navigates through links
- ✅ Focus indicators visible

### Run All Tests

```bash
# Unit and integration tests
npm test

# E2E tests (all browsers)
npm run test:e2e

# Coverage report
npm run test:coverage
```

**Expected**: All tests pass with >80% coverage

---

## Step 10: Performance Check

**Estimated Time**: 10 minutes

### Lighthouse Audit

```bash
# Build for production
npm run build

# Start production server
npm start

# Run Lighthouse (in Chrome DevTools)
# Open http://localhost:3000
# DevTools → Lighthouse → Generate Report
```

**Target Scores**:
- Performance: ≥90
- Accessibility: 100
- Best Practices: 100
- SEO: ≥90

### Check Bundle Size

```bash
npm run build
```

Look for output showing bundle sizes. Should see:
- First Load JS: <100kb
- Client bundle: <50kb

---

## Troubleshooting

### Common Issues

1. **Tests fail with "Cannot find module"**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Playwright browsers not installed**
   ```bash
   npx playwright install
   ```

3. **TypeScript errors in test files**
   ```bash
   # Add to tsconfig.json
   {
     "include": ["tests/**/*", "app/**/*"]
   }
   ```

4. **Framer Motion hydration errors**
   - Ensure MobileNav has `'use client'` directive
   - Check that useState is properly initialized

5. **Tailwind classes not applying**
   ```bash
   # Restart dev server
   npm run dev
   ```

---

## Next Steps

After completing this quickstart:

1. **Review generated artifacts**:
   - Read `plan.md` for full implementation details
   - Review `data-model.md` for data structures
   - Check `contracts/` for component interfaces

2. **Run checklist**:
   - Open `specs/001-portfolio-homepage/checklists/requirements.md`
   - Verify all functional requirements

3. **Prepare for next feature**:
   - Feature branch: Create from `001-portfolio-homepage`
   - Follow same TDD workflow

---

## Summary

### What You Built

✅ Responsive portfolio homepage  
✅ Fixed navigation header  
✅ Unified Navigation component with desktop + mobile support  
✅ Mobile hamburger menu with smooth animations  
✅ Footer with auto-updating copyright  
✅ Full test coverage (unit + integration + E2E)  
✅ WCAG 2.2 AA accessible  
✅ Performance optimized  
✅ Security headers configured  

### Time Breakdown

- Setup: 30 minutes
- Types & Constants: 30 minutes
- Tests (Red): 60 minutes
- Implementation (Green): 90 minutes
- Refactor & Polish: 30 minutes
- Verification: 25 minutes

**Total**: ~4-6 hours

### Resources

- **Documentation**: `specs/001-portfolio-homepage/`
- **Tests**: `tests/`
- **Components**: `app/components/`

**Status**: ✅ Homepage implementation complete and production-ready!

