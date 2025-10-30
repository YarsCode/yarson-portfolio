import { describe, it, expect } from 'vitest';
import { 
  NavigationConfigSchema,
} from '@/app/types/schemas';

describe('NavigationConfigSchema', () => {
    it('enforces unique link IDs', () => {
      const duplicateIds = {
        links: [
          { id: 'home', label: 'Home', href: '#', action: 'navigate' as const, order: 0 },
          { id: 'home', label: 'Home2', href: '#', action: 'navigate' as const, order: 1 },
        ],
      };
      
      expect(NavigationConfigSchema.safeParse(duplicateIds).success).toBe(false);
    });
  
    it('enforces unique link orders', () => {
      const duplicateOrders = {
        links: [
          { id: 'home', label: 'Home', href: '#', action: 'navigate' as const, order: 0 },
          { id: 'work', label: 'Work', href: '#work', action: 'navigate' as const, order: 0 },
        ],
      };
      
      expect(NavigationConfigSchema.safeParse(duplicateOrders).success).toBe(false);
    });
  });
