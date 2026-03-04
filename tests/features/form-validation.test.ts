/**
 * Form Validation Tests
 * Tests for form validation, sanitization, and error handling
 */

import { describe, it, expect } from '@jest/globals';

// Types
interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}

interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

// Validation utilities
const validateField = (
  value: unknown,
  rules: FieldValidation,
  fieldName: string
): string[] => {
  const errors: string[] = [];

  // Required check
  if (rules.required) {
    if (value === undefined || value === null || value === '') {
      errors.push(`${fieldName} is required`);
      return errors; // Don't continue if required field is empty
    }
  }

  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return errors;
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      errors.push(`${fieldName} must not exceed ${rules.maxLength} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${fieldName} format is invalid`);
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`${fieldName} must be at least ${rules.min}`);
    }

    if (rules.max !== undefined && value > rules.max) {
      errors.push(`${fieldName} must not exceed ${rules.max}`);
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return errors;
};

const validateForm = (
  values: Record<string, unknown>,
  schema: Record<string, FieldValidation>
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  Object.entries(schema).forEach(([fieldName, rules]) => {
    const fieldErrors = validateField(values[fieldName], rules, fieldName);
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
interface PasswordStrength {
  score: number;
  label: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
}

const validatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'admin'];
  if (commonPatterns.some((p) => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns');
  }

  const label: PasswordStrength['label'] =
    score <= 2 ? 'weak' : score <= 4 ? 'fair' : score <= 6 ? 'good' : 'strong';

  return { score, label, feedback };
};

// Phone number validation
const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// URL validation
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date validation
const isValidDate = (date: string): boolean => {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};

const isDateInRange = (
  date: string,
  minDate?: string,
  maxDate?: string
): boolean => {
  const parsed = new Date(date);

  if (minDate && parsed < new Date(minDate)) return false;
  if (maxDate && parsed > new Date(maxDate)) return false;

  return true;
};

// Sanitization
const sanitizeString = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

const sanitizeHtml = (html: string): string => {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

describe('Field Validation', () => {
  describe('required fields', () => {
    const schema: Record<string, FieldValidation> = {
      name: { required: true },
    };

    it('should fail for empty string', () => {
      const result = validateForm({ name: '' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.name).toContain('name is required');
    });

    it('should fail for null', () => {
      const result = validateForm({ name: null }, schema);
      expect(result.valid).toBe(false);
    });

    it('should fail for undefined', () => {
      const result = validateForm({ name: undefined }, schema);
      expect(result.valid).toBe(false);
    });

    it('should pass for non-empty value', () => {
      const result = validateForm({ name: 'John' }, schema);
      expect(result.valid).toBe(true);
    });
  });

  describe('minLength validation', () => {
    const schema: Record<string, FieldValidation> = {
      password: { required: true, minLength: 8 },
    };

    it('should fail for short value', () => {
      const result = validateForm({ password: 'short' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.password[0]).toContain('at least 8 characters');
    });

    it('should pass for exact length', () => {
      const result = validateForm({ password: '12345678' }, schema);
      expect(result.valid).toBe(true);
    });

    it('should pass for longer value', () => {
      const result = validateForm({ password: '123456789' }, schema);
      expect(result.valid).toBe(true);
    });
  });

  describe('maxLength validation', () => {
    const schema: Record<string, FieldValidation> = {
      bio: { maxLength: 500 },
    };

    it('should fail for long value', () => {
      const result = validateForm({ bio: 'x'.repeat(501) }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.bio[0]).toContain('not exceed 500 characters');
    });

    it('should pass for exact length', () => {
      const result = validateForm({ bio: 'x'.repeat(500) }, schema);
      expect(result.valid).toBe(true);
    });
  });

  describe('pattern validation', () => {
    const schema: Record<string, FieldValidation> = {
      username: {
        required: true,
        pattern: /^[a-zA-Z0-9_]+$/,
      },
    };

    it('should fail for invalid pattern', () => {
      const result = validateForm({ username: 'user@name' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.username[0]).toContain('format is invalid');
    });

    it('should pass for valid pattern', () => {
      const result = validateForm({ username: 'user_name123' }, schema);
      expect(result.valid).toBe(true);
    });
  });

  describe('numeric validation', () => {
    const schema: Record<string, FieldValidation> = {
      age: { required: true, min: 18, max: 120 },
    };

    it('should fail for value below min', () => {
      const result = validateForm({ age: 17 }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.age[0]).toContain('at least 18');
    });

    it('should fail for value above max', () => {
      const result = validateForm({ age: 150 }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.age[0]).toContain('not exceed 120');
    });

    it('should pass for value in range', () => {
      const result = validateForm({ age: 25 }, schema);
      expect(result.valid).toBe(true);
    });
  });

  describe('custom validation', () => {
    const schema: Record<string, FieldValidation> = {
      confirmPassword: {
        required: true,
        custom: (value) => {
          // This would compare with password in real scenario
          if (value !== 'password123') {
            return 'Passwords do not match';
          }
          return null;
        },
      },
    };

    it('should fail custom validation', () => {
      const result = validateForm({ confirmPassword: 'different' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.confirmPassword).toContain('Passwords do not match');
    });

    it('should pass custom validation', () => {
      const result = validateForm({ confirmPassword: 'password123' }, schema);
      expect(result.valid).toBe(true);
    });
  });
});

describe('Email Validation', () => {
  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    expect(isValidEmail('test+tag@example.org')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
    expect(isValidEmail('test@domain')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('Password Strength Validation', () => {
  describe('validatePasswordStrength', () => {
    it('should rate weak passwords', () => {
      const result = validatePasswordStrength('abc');
      expect(result.label).toBe('weak');
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should rate fair passwords', () => {
      const result = validatePasswordStrength('Password1');
      expect(result.label).toBe('fair');
    });

    it('should rate good passwords', () => {
      const result = validatePasswordStrength('Password123!');
      expect(result.score).toBeGreaterThanOrEqual(5);
    });

    it('should rate strong passwords', () => {
      const result = validatePasswordStrength('MyV3ry$tr0ngP@ssw0rd!');
      expect(result.label).toBe('strong');
    });

    it('should penalize common patterns', () => {
      const result = validatePasswordStrength('password123');
      expect(result.feedback).toContain('Avoid common patterns');
    });

    it('should provide actionable feedback', () => {
      const result = validatePasswordStrength('a');
      expect(result.feedback).toContain('Use at least 8 characters');
      expect(result.feedback).toContain('Add uppercase letters');
      expect(result.feedback).toContain('Add numbers');
    });
  });
});

describe('Phone Number Validation', () => {
  it('should validate correct phone numbers', () => {
    expect(isValidPhoneNumber('+1234567890')).toBe(true);
    expect(isValidPhoneNumber('1234567890')).toBe(true);
    expect(isValidPhoneNumber('+1 (234) 567-8901')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(isValidPhoneNumber('123')).toBe(false);
    expect(isValidPhoneNumber('abcdefg')).toBe(false);
  });
});

describe('URL Validation', () => {
  it('should validate correct URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
    expect(isValidUrl('https://sub.domain.com/path?query=1')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('htp://invalid')).toBe(false);
  });
});

describe('Date Validation', () => {
  describe('isValidDate', () => {
    it('should validate correct dates', () => {
      expect(isValidDate('2024-01-15')).toBe(true);
      expect(isValidDate('2024/01/15')).toBe(true);
      expect(isValidDate('January 15, 2024')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidDate('not-a-date')).toBe(false);
      expect(isValidDate('2024-13-45')).toBe(false);
    });
  });

  describe('isDateInRange', () => {
    it('should pass for date in range', () => {
      expect(isDateInRange('2024-06-15', '2024-01-01', '2024-12-31')).toBe(true);
    });

    it('should fail for date before min', () => {
      expect(isDateInRange('2023-12-31', '2024-01-01', '2024-12-31')).toBe(false);
    });

    it('should fail for date after max', () => {
      expect(isDateInRange('2025-01-01', '2024-01-01', '2024-12-31')).toBe(false);
    });

    it('should work with only min', () => {
      expect(isDateInRange('2024-06-15', '2024-01-01')).toBe(true);
      expect(isDateInRange('2023-12-31', '2024-01-01')).toBe(false);
    });
  });
});

describe('Form Integration Tests', () => {
  const registrationSchema: Record<string, FieldValidation> = {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, custom: (value) => isValidEmail(value as string) ? null : 'Invalid email' },
    password: { required: true, minLength: 8 },
    confirmPassword: { required: true },
  };

  it('should validate complete registration form', () => {
    const result = validateForm(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      },
      registrationSchema
    );

    expect(result.valid).toBe(true);
  });

  it('should fail for multiple invalid fields', () => {
    const result = validateForm(
      {
        name: 'J',
        email: 'invalid-email',
        password: 'short',
        confirmPassword: '',
      },
      registrationSchema
    );

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
    expect(result.errors.confirmPassword).toBeDefined();
  });

  it('should provide all error messages', () => {
    const result = validateForm(
      {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      registrationSchema
    );

    expect(Object.keys(result.errors)).toHaveLength(4);
  });
});

describe('Input Sanitization', () => {
  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should collapse multiple spaces', () => {
      expect(sanitizeString('hello    world')).toBe('hello world');
    });

    it('should handle empty string', () => {
      expect(sanitizeString('')).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should preserve normal text', () => {
      expect(sanitizeHtml('Hello World')).toBe('Hello World');
    });
  });
});

describe('Real-time Validation Scenarios', () => {
  const validateTypingState = (
    value: string,
    fieldName: string,
    isTouched: boolean
  ): string | null => {
    if (!isTouched) return null;

    if (fieldName === 'email' && value && !isValidEmail(value)) {
      return 'Invalid email format';
    }

    if (fieldName === 'password' && value && value.length < 8) {
      return 'Password too short';
    }

    return null;
  };

  it('should not show errors for untouched fields', () => {
    const error = validateTypingState('invalid-email', 'email', false);
    expect(error).toBeNull();
  });

  it('should show errors for touched fields', () => {
    const error = validateTypingState('invalid-email', 'email', true);
    expect(error).toBe('Invalid email format');
  });

  it('should clear errors when fixed', () => {
    const error = validateTypingState('valid@email.com', 'email', true);
    expect(error).toBeNull();
  });
});

describe('Debounced Validation', () => {
  const createDebouncedValidator = (
    validate: (value: string) => boolean,
    delay: number
  ): { validate: (value: string) => void; getLastResult: () => boolean | null } => {
    let lastResult: boolean | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return {
      validate: (value: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastResult = validate(value);
        }, delay);
      },
      getLastResult: () => lastResult,
    };
  };

  it('should debounce validation calls', () => {
    jest.useFakeTimers();

    const validator = createDebouncedValidator(isValidEmail, 300);

    validator.validate('t');
    validator.validate('te');
    validator.validate('tes');
    validator.validate('test@example.com');

    // Should not have validated yet
    expect(validator.getLastResult()).toBeNull();

    // Advance past debounce delay
    jest.advanceTimersByTime(300);

    // Should have validated only once with final value
    expect(validator.getLastResult()).toBe(true);

    jest.useRealTimers();
  });
});
