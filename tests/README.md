# DevSecOps Platform - Test Suite

This directory contains comprehensive tests for the DevSecOps Platform, organized by test type and designed to run in CI/CD pipelines.

## Directory Structure

```
tests/
├── README.md                     # This file
├── e2e/                          # End-to-end tests (Playwright)
│   ├── auth.spec.ts              # Authentication flow tests
│   └── navigation.spec.ts        # Navigation and routing tests
├── unit/                         # Unit tests (Jest)
│   ├── utils.test.ts             # Utility functions tests
│   └── api-client.test.ts        # API client tests
├── integration/                  # Integration tests (Jest)
│   ├── auth-flow.test.ts         # Authentication integration tests
│   └── api.test.ts               # API endpoint integration tests
├── security/                     # Security tests (Jest)
│   └── security.test.ts          # Security vulnerability tests
├── performance/                  # Performance tests (Jest)
│   └── performance.test.ts       # Performance benchmarking tests
├── accessibility/                # Accessibility tests (Jest)
│   └── accessibility.test.ts     # WCAG compliance tests
└── features/                     # Feature-specific tests (Jest)
    ├── files.test.ts             # File management tests
    ├── notifications.test.ts     # Notification system tests
    ├── rbac.test.ts              # Role-based access control tests
    └── form-validation.test.ts   # Form validation tests
```

## Test Types

### 1. Unit Tests (`unit/`)

Unit tests verify individual functions and components in isolation.

**What's tested:**
- Utility functions (formatting, validation, transformations)
- API client methods (GET, POST, PUT, DELETE)
- Data processing logic
- Pure functions

**Run:**
```bash
bun run test tests/unit/
```

### 2. Integration Tests (`integration/`)

Integration tests verify multiple components working together.

**What's tested:**
- Authentication flow (login, logout, register)
- Session management
- State persistence
- All API endpoints (Auth, Users, Files, Notifications, Dashboard, RBAC)
- Error handling and response parsing

**Run:**
```bash
bun run test tests/integration/
```

### 3. End-to-End Tests (`e2e/`)

E2E tests verify complete user journeys through the application.

**What's tested:**
- User registration and login
- Navigation flows
- Protected route access
- Admin functionality

**Run:**
```bash
bun run test:e2e
```

**With UI:**
```bash
bun run test:e2e:ui
```

### 4. Security Tests (`security/`)

Security tests verify protection against common vulnerabilities.

**What's tested:**
- Input sanitization (XSS prevention)
- SQL injection prevention
- CSRF protection
- Open redirect prevention
- Rate limiting
- Password security
- Security headers
- Content Security Policy

**Run:**
```bash
bun run test tests/security/
```

### 5. Performance Tests (`performance/`)

Performance tests verify application meets performance requirements.

**What's tested:**
- Memoization and caching
- Debounce/throttle functions
- Bundle size estimation
- Render performance
- API response times
- Memory usage tracking
- Performance budgets

**Run:**
```bash
bun run test tests/performance/
```

### 6. Accessibility Tests (`accessibility/`)

Accessibility tests verify WCAG 2.1 Level AA compliance.

**What's tested:**
- Image alt text
- Button/Link accessible names
- Form labels
- Heading order
- Color contrast
- ARIA roles
- Keyboard navigation
- Screen reader support
- Skip links
- Page landmarks

**Run:**
```bash
bun run test tests/accessibility/
```

### 7. Feature Tests (`features/`)

Feature-specific tests for core application functionality.

#### Files Management (`files.test.ts`)
- File size formatting
- File type validation
- Upload validation
- File permissions
- Search and filtering
- Sorting operations

#### Notifications (`notifications.test.ts`)
- Time formatting
- Notification grouping
- Read/unread states
- Preferences
- Priority levels
- Deduplication

#### RBAC (`rbac.test.ts`)
- Role hierarchy
- Permission checking
- User management permissions
- Role transitions
- Permission conditions
- Permission matrix

#### Form Validation (`form-validation.test.ts`)
- Required field validation
- Min/max length validation
- Pattern validation
- Email/phone/URL validation
- Password strength
- Date validation
- Input sanitization

**Run:**
```bash
bun run test tests/features/
```

## Running All Tests

### Run all unit/integration tests:
```bash
bun run test
```

### Run with coverage:
```bash
bun run test --coverage
```

### Run specific test file:
```bash
bun run test tests/security/security.test.ts
```

### Run tests in watch mode:
```bash
bun run test:watch
```

### Run specific test categories:
```bash
bun run test tests/unit/
bun run test tests/integration/
bun run test tests/security/
bun run test tests/accessibility/
bun run test tests/performance/
bun run test tests/features/
```

## Test Coverage Summary

| Category | Files | Test Cases | Coverage |
|----------|-------|------------|----------|
| Unit | 2 | 60+ | Utils, API Client |
| Integration | 2 | 70+ | Auth, API Endpoints |
| Security | 1 | 50+ | XSS, CSRF, SQL Injection |
| Performance | 1 | 40+ | Caching, Rendering |
| Accessibility | 1 | 35+ | WCAG 2.1 AA |
| Features | 4 | 100+ | Files, Notifications, RBAC, Forms |
| E2E | 2 | 20+ | Auth, Navigation |

## CI/CD Integration

These tests are designed to run in CI/CD pipelines. Here's a sample GitHub Actions workflow:

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test tests/integration/

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bun run test:e2e
        env:
          CI: true

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test tests/security/

  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test tests/accessibility/

  feature-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test tests/features/
```

## Test Coverage Requirements

| Category | Minimum Coverage |
|----------|-----------------|
| Branches | 50% |
| Functions | 50% |
| Lines | 50% |
| Statements | 50% |

Coverage thresholds are configured in `jest.config.ts`.

## Writing New Tests

### Unit Test Template

```typescript
import { describe, it, expect } from '@jest/globals';

describe('MyComponent', () => {
  describe('methodName', () => {
    it('should do something', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = myFunction(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Integration Test Template

```typescript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('API Endpoint', () => {
  beforeEach(() => {
    // Setup mocks
  });

  it('should return expected response', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    // Act
    const result = await api.getData();

    // Assert
    expect(result.data).toBe('test');
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    
    await expect(page.getByRole('heading')).toBeVisible();
    await page.getByRole('button', { name: /submit/i }).click();
    
    await expect(page).toHaveURL(/success/);
  });
});
```

## Test Data

Mock data for tests is located in:
- `/public/dummy-data/` - JSON mock data for API responses
- Test factories in individual test files

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Descriptive names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert**: Follow the AAA pattern for clarity
4. **Mock external dependencies**: Use mocks for API calls, timers, etc.
5. **Test edge cases**: Don't just test happy paths
6. **Keep tests fast**: Slow tests reduce developer productivity

## Troubleshooting

### Tests fail locally but pass in CI
- Check for environment-specific configurations
- Ensure all dependencies are installed
- Clear Jest cache: `bun run test --clearCache`

### E2E tests timeout
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network connectivity

### Coverage is too low
- Run `bun run test --coverage` to identify uncovered files
- Add tests for uncovered branches
- Focus on critical paths first

## Contributing

When adding new features, please ensure:
1. Unit tests for new utility functions
2. Integration tests for new API endpoints
3. Feature tests for complex functionality
4. Security tests for authentication/authorization changes
5. Accessibility tests for UI components
6. Update this README with new test files
