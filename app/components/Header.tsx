import Link from 'next/link';
import { Navigation } from './Navigation';
import { NAV_LINKS } from '@/app/lib/constants';

/**
 * Header component - Fixed navigation header with brand and navigation
 * Server Component that wraps the client-side Navigation component
 */
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-16" role="banner">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors" aria-label="Yarson homepage">
          Yarson
        </Link>
        <Navigation links={NAV_LINKS.links} ariaLabel="Main navigation" />
      </div>
    </header>
  );
}

