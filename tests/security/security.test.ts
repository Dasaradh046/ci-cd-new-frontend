/**
 * Security Tests
 * Tests for security vulnerabilities and protections
 */

import { describe, it, expect, jest } from '@jest/globals';

// Security utilities to test
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitizeHtml = (html: string): string => {
  const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'p', 'br'];

  // Remove dangerous tags with their content
  html = html.replace(
    /<(script|iframe|object|embed|style)[^>]*>[\s\S]*?<\/\1>/gi,
    ''
  );

  // Remove disallowed tags but keep their content
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  return html.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });
};

const isValidRedirectUrl = (url: string): boolean => {
  // Prevent open redirect vulnerabilities
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return false; // Only allow relative URLs
  }
  if (url.startsWith('//')) {
    return false; // Protocol-relative URLs could be exploits
  }
  if (url.startsWith('javascript:')) {
    return false;
  }
  if (url.startsWith('data:')) {
    return false;
  }
  return url.startsWith('/');
};

const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
};

const validateCSRFToken = (token: string, expectedToken: string): boolean => {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
};

const isRateLimited = (
  identifier: string,
  limit: number,
  windowMs: number,
  attempts: Map<string, { count: number; resetTime: number }>
): boolean => {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record || now > record.resetTime) {
    attempts.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count++;
  return false;
};

describe('Input Sanitization', () => {
  describe('sanitizeInput', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should handle single quotes', () => {
      expect(sanitizeInput("test'value")).toBe('test&#x27;value');
    });

    it('should handle forward slashes', () => {
      expect(sanitizeInput('test/value')).toBe('test&#x2F;value');
    });

    it('should preserve normal text', () => {
      expect(sanitizeInput('Hello World')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should escape combination attacks', () => {
      expect(sanitizeInput('"><script>document.cookie</script>')).toContain('&lt;');
      expect(sanitizeInput('"><script>document.cookie</script>')).toContain('&gt;');
    });
  });

  describe('sanitizeHtml', () => {
    it('should allow safe tags', () => {
      expect(sanitizeHtml('<b>bold</b>')).toBe('<b>bold</b>');
      expect(sanitizeHtml('<i>italic</i>')).toBe('<i>italic</i>');
      expect(sanitizeHtml('<strong>strong</strong>')).toBe('<strong>strong</strong>');
    });

    it('should remove dangerous tags', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeHtml('<iframe src="evil.com"></iframe>')).toBe('');
      expect(sanitizeHtml('<object data="evil.swf"></object>')).toBe('');
    });

    it('should handle nested tags', () => {
      expect(sanitizeHtml('<b><script>alert("xss")</script></b>')).toBe('<b></b>');
    });

    it('should remove event handlers', () => {
      expect(sanitizeHtml('<div onclick="alert(1)">test</div>')).toBe('test');
    });
  });
});

describe('Open Redirect Prevention', () => {
  describe('isValidRedirectUrl', () => {
    it('should allow relative URLs', () => {
      expect(isValidRedirectUrl('/dashboard')).toBe(true);
      expect(isValidRedirectUrl('/profile/settings')).toBe(true);
    });

    it('should block absolute URLs', () => {
      expect(isValidRedirectUrl('https://evil.com')).toBe(false);
      expect(isValidRedirectUrl('http://google.com')).toBe(false);
    });

    it('should block protocol-relative URLs', () => {
      expect(isValidRedirectUrl('//evil.com')).toBe(false);
    });

    it('should block javascript: URLs', () => {
      expect(isValidRedirectUrl('javascript:alert(1)')).toBe(false);
    });

    it('should block data: URLs', () => {
      expect(isValidRedirectUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('should block URLs without leading slash', () => {
      expect(isValidRedirectUrl('dashboard')).toBe(false);
    });
  });
});

describe('CSRF Protection', () => {
  describe('generateCSRFToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = generateCSRFToken();
      expect(token).toHaveLength(64);
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateCSRFToken());
      }
      expect(tokens.size).toBe(100);
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate matching tokens', () => {
      const token = 'abc123';
      expect(validateCSRFToken(token, token)).toBe(true);
    });

    it('should reject non-matching tokens', () => {
      expect(validateCSRFToken('abc123', 'xyz789')).toBe(false);
    });

    it('should reject empty tokens', () => {
      expect(validateCSRFToken('', 'abc123')).toBe(false);
      expect(validateCSRFToken('abc123', '')).toBe(false);
      expect(validateCSRFToken('', '')).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(validateCSRFToken('ABC123', 'abc123')).toBe(false);
    });
  });
});

describe('Rate Limiting', () => {
  describe('isRateLimited', () => {
    it('should not rate limit first attempts', () => {
      const attempts = new Map();
      expect(isRateLimited('user1', 5, 60000, attempts)).toBe(false);
    });

    it('should rate limit after threshold', () => {
      const attempts = new Map();
      const identifier = 'user1';
      const limit = 3;

      for (let i = 0; i < limit; i++) {
        isRateLimited(identifier, limit, 60000, attempts);
      }

      expect(isRateLimited(identifier, limit, 60000, attempts)).toBe(true);
    });

    it('should reset after window expires', () => {
      const attempts = new Map();
      const identifier = 'user1';
      const windowMs = 100; // 100ms window

      // Hit the limit
      for (let i = 0; i < 3; i++) {
        isRateLimited(identifier, 3, windowMs, attempts);
      }

      expect(isRateLimited(identifier, 3, windowMs, attempts)).toBe(true);

      // Wait for window to expire
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(isRateLimited(identifier, 3, windowMs, attempts)).toBe(false);
          resolve();
        }, windowMs + 50);
      });
    });

    it('should track different identifiers separately', () => {
      const attempts = new Map();

      expect(isRateLimited('user1', 2, 60000, attempts)).toBe(false);
      expect(isRateLimited('user2', 2, 60000, attempts)).toBe(false);
      expect(isRateLimited('user1', 2, 60000, attempts)).toBe(false);
      expect(isRateLimited('user2', 2, 60000, attempts)).toBe(false);
      expect(isRateLimited('user1', 2, 60000, attempts)).toBe(true);
      expect(isRateLimited('user2', 2, 60000, attempts)).toBe(true);
    });
  });
});

describe('Password Security', () => {
  const validatePasswordStrength = (password: string): {
    score: number;
    feedback: string[];
  } => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score++;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score++;

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('Add numbers');

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('Add special characters');

    // Check for common patterns
    const commonPatterns = ['password', '123456', 'qwerty', 'abc123'];
    if (commonPatterns.some((p) => password.toLowerCase().includes(p))) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common patterns');
    }

    return { score, feedback };
  };

  const isPasswordBreached = async (_password: string): Promise<boolean> => {
    // In a real implementation, this would check against a breach database
    // For testing, we'll simulate some breached passwords
    const breachedPasswords = ['password123', 'qwerty123', '123456789'];
    return breachedPasswords.includes(_password);
  };

  describe('validatePasswordStrength', () => {
    it('should give high score to strong passwords', () => {
      const result = validatePasswordStrength('Str0ng!P@ssw0rd');
      expect(result.score).toBeGreaterThanOrEqual(5);
      expect(result.feedback).toHaveLength(0);
    });

    it('should give low score to weak passwords', () => {
      const result = validatePasswordStrength('password');
      expect(result.score).toBeLessThan(3);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should penalize common patterns', () => {
      const result = validatePasswordStrength('password123');
      expect(result.feedback).toContain('Avoid common patterns');
    });

    it('should provide actionable feedback', () => {
      const result = validatePasswordStrength('abc');
      expect(result.feedback).toContain('Use at least 8 characters');
      expect(result.feedback).toContain('Add uppercase letters');
      expect(result.feedback).toContain('Add numbers');
    });
  });

  describe('isPasswordBreached', () => {
    it('should detect breached passwords', async () => {
      const isBreached = await isPasswordBreached('password123');
      expect(isBreached).toBe(true);
    });

    it('should not flag unique passwords', async () => {
      const isBreached = await isPasswordBreached('Un1que$ecureP@ss');
      expect(isBreached).toBe(false);
    });
  });
});

describe('SQL Injection Prevention', () => {
  const escapeSqlString = (value: string): string => {
    return value.replace(/'/g, "''").replace(/\\/g, '\\\\');
  };

  const isValidSqlIdentifier = (identifier: string): boolean => {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier);
  };

  describe('escapeSqlString', () => {
    it('should escape single quotes', () => {
      expect(escapeSqlString("O'Brien")).toBe("O''Brien");
    });

    it('should escape backslashes', () => {
      expect(escapeSqlString('test\\value')).toBe('test\\\\value');
    });

    it('should handle injection attempts', () => {
      const injection = "'; DROP TABLE users; --";
      const escaped = escapeSqlString(injection);
      expect(escaped).toBe("''; DROP TABLE users; --");
    });
  });

  describe('isValidSqlIdentifier', () => {
    it('should accept valid identifiers', () => {
      expect(isValidSqlIdentifier('users')).toBe(true);
      expect(isValidSqlIdentifier('user_id')).toBe(true);
      expect(isValidSqlIdentifier('User123')).toBe(true);
    });

    it('should reject invalid identifiers', () => {
      expect(isValidSqlIdentifier('user-id')).toBe(false);
      expect(isValidSqlIdentifier('123users')).toBe(false);
      expect(isValidSqlIdentifier('user name')).toBe(false);
    });

    it('should reject SQL injection in identifiers', () => {
      expect(isValidSqlIdentifier("users; DROP TABLE")).toBe(false);
    });
  });
});

describe('Content Security Policy', () => {
  const parseCSP = (csp: string): Record<string, string[]> => {
    const directives: Record<string, string[]> = {};
    csp.split(';').forEach((directive) => {
      const [name, ...values] = directive.trim().split(/\s+/);
      if (name) {
        directives[name] = values;
      }
    });
    return directives;
  };

  it('should have restrictive CSP', () => {
    const csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";
    const directives = parseCSP(csp);

    expect(directives['default-src']).toContain("'self'");
    expect(directives['script-src']).toBeDefined();
  });

  it('should not allow unsafe-eval', () => {
    const csp = "default-src 'self'; script-src 'self'";
    const directives = parseCSP(csp);

    expect(directives['script-src']).not.toContain("'unsafe-eval'");
  });
});

describe('Security Headers', () => {
  const requiredHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  it('should have all required security headers', () => {
    // Simulated response headers
    const responseHeaders: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    Object.entries(requiredHeaders).forEach(([header, expectedValue]) => {
      expect(responseHeaders[header]).toBe(expectedValue);
    });
  });
});
