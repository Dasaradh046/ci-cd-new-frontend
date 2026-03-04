/**
 * Unit Tests for Utility Functions
 * Tests for common utility functions used across the application
 */

import { describe, it, expect } from '@jest/globals';

// Utility functions to test
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should filter out falsy values', () => {
      expect(cn('foo', false, 'bar', null, undefined, 'baz')).toBe('foo bar baz');
    });

    it('should return empty string for no arguments', () => {
      expect(cn()).toBe('');
    });

    it('should handle all falsy values', () => {
      expect(cn(false, null, undefined, '')).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format a date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toMatch(/Jan/);
      expect(formatDate(date)).toMatch(/15/);
      expect(formatDate(date)).toMatch(/2024/);
    });

    it('should handle string dates', () => {
      expect(formatDate('2024-06-20')).toMatch(/Jun/);
    });

    it('should handle ISO string dates', () => {
      expect(formatDate('2024-12-25T00:00:00.000Z')).toMatch(/Dec/);
    });
  });

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should truncate long text with ellipsis', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
    });

    it('should handle exact length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('generateId', () => {
    it('should generate a string', () => {
      expect(typeof generateId()).toBe('string');
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });

    it('should have reasonable length', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(5);
      expect(id.length).toBeLessThan(20);
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
    });

    it('should lowercase rest of string', () => {
      expect(capitalizeFirst('HELLO')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalizeFirst('a')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });
  });

  describe('slugify', () => {
    it('should convert to lowercase', () => {
      expect(slugify('HELLO WORLD')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('hello!@#$world')).toBe('helloworld');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('hello    world')).toBe('hello-world');
    });

    it('should trim leading/trailing hyphens', () => {
      expect(slugify('---hello world---')).toBe('hello-world');
    });
  });
});

describe('Validation Utilities', () => {
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
    return { valid: errors.length === 0, errors };
  };

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      const result = isValidPassword('Password123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short passwords', () => {
      const result = isValidPassword('Pass1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    it('should reject passwords without uppercase', () => {
      const result = isValidPassword('password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain an uppercase letter');
    });

    it('should reject passwords without lowercase', () => {
      const result = isValidPassword('PASSWORD123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain a lowercase letter');
    });

    it('should reject passwords without numbers', () => {
      const result = isValidPassword('Passwords');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain a number');
    });
  });

  describe('getPasswordStrength', () => {
    it('should return weak for simple passwords', () => {
      expect(getPasswordStrength('abc')).toBe('weak');
      expect(getPasswordStrength('password')).toBe('weak');
    });

    it('should return medium for moderate passwords', () => {
      expect(getPasswordStrength('Password1')).toBe('medium');
    });

    it('should return strong for complex passwords', () => {
      expect(getPasswordStrength('Password123!')).toBe('strong');
      expect(getPasswordStrength('MyVeryL0ngP@ssword')).toBe('strong');
    });
  });
});

describe('Array Utilities', () => {
  const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

  const groupBy = <T, K extends string | number>(
    arr: T[],
    keyFn: (item: T) => K
  ): Record<K, T[]> => {
    return arr.reduce((groups, item) => {
      const key = keyFn(item);
      (groups[key] = groups[key] || []).push(item);
      return groups;
    }, {} as Record<K, T[]>);
  };

  const sortBy = <T>(arr: T[], keyFn: (item: T) => number | string): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = keyFn(a);
      const bVal = keyFn(b);
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });
  };

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should preserve order', () => {
      expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });

    it('should handle strings', () => {
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('groupBy', () => {
    it('should group items by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const grouped = groupBy(items, (item) => item.type);
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });

    it('should handle empty array', () => {
      expect(groupBy([], (item: { type: string }) => item.type)).toEqual({});
    });
  });

  describe('sortBy', () => {
    it('should sort by numeric key', () => {
      const items = [{ v: 3 }, { v: 1 }, { v: 2 }];
      const sorted = sortBy(items, (item) => item.v);
      expect(sorted.map((i) => i.v)).toEqual([1, 2, 3]);
    });

    it('should sort by string key', () => {
      const items = [{ name: 'c' }, { name: 'a' }, { name: 'b' }];
      const sorted = sortBy(items, (item) => item.name);
      expect(sorted.map((i) => i.name)).toEqual(['a', 'b', 'c']);
    });

    it('should not modify original array', () => {
      const items = [{ v: 3 }, { v: 1 }];
      sortBy(items, (item) => item.v);
      expect(items[0].v).toBe(3);
    });
  });
});
