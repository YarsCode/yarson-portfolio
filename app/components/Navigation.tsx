'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationProps } from '@/app/types/components';

export function Navigation({ links, className = '', ariaLabel = 'Main navigation' }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sortedLinks = useMemo(() => [...links].sort((a, b) => a.order - b.order), [links]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
  
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && 
          buttonRef.current && !buttonRef.current.contains(target)) {
        closeMobileMenu();
      }
    };
  
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden sm:flex ${className}`} aria-label={ariaLabel}>
        <ul className="flex items-center gap-6">
          {sortedLinks.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded px-3 py-2"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="flex sm:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-lg z-40 sm:hidden"
          >
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col p-4 space-y-2">
                {sortedLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="block text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded px-4 py-3"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}