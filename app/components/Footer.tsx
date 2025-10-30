import Link from 'next/link';
import { NAV_LINKS, getCopyrightText } from '@/app/lib/constants';

export function Footer() {
  const sortedLinks = [...NAV_LINKS.links].sort((a, b) => a.order - b.order);
  const copyrightText = getCopyrightText();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <nav aria-label="Footer navigation" className="mb-4">
          <ul className="flex items-center justify-center gap-6 flex-wrap">
            {sortedLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded px-3 py-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-center text-gray-400 text-sm">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}