import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NAV_LINKS } from '@/app/lib/constants';
import { Navigation } from '@/app/components/Navigation';

describe('Navigation', () => {
  it('should render all links with correct labels and hrefs', () => {
    render(<Navigation links={NAV_LINKS.links} />);
    
    const navLinks = screen.getAllByRole('link');
    expect(navLinks).toHaveLength(NAV_LINKS.links.length);
    
    NAV_LINKS.links.forEach((expectedLink, index) => {
      expect(navLinks[index]).toHaveTextContent(expectedLink.label);
      expect(navLinks[index]).toHaveAttribute('href', expectedLink.href);
    });
  });

  it('should have navigation landmark with aria-label', () => {
    const { container } = render(
      <Navigation links={NAV_LINKS.links} ariaLabel="Main navigation" />
    );
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });
});