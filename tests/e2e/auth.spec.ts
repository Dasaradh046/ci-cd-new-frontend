/**
 * E2E Tests for Authentication Flows
 * Tests critical user authentication journeys
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page.getByText(/invalid email/i)).toBeVisible();
    });

    test('should show validation error for invalid email', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page.getByText(/invalid email/i)).toBeVisible();
    });

    test('should navigate to register page', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByRole('link', { name: /sign up/i }).click();
      
      await expect(page).toHaveURL(/\/register/);
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByRole('link', { name: /forgot password/i }).click();
      
      await expect(page).toHaveURL(/\/forgot-password/);
    });
  });

  test.describe('Register Page', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/register');
      
      await expect(page.getByLabel(/name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/^password/i)).toBeVisible();
      await expect(page.getByLabel(/confirm password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
    });

    test('should show password strength indicator', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByLabel(/^password/i).fill('weak');
      
      // Should show some form of strength indicator
      await expect(page.getByText(/weak/i)).toBeVisible();
    });

    test('should show error for mismatched passwords', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByLabel(/name/i).fill('Test User');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/^password/i).fill('password123');
      await page.getByLabel(/confirm password/i).fill('different123');
      await page.getByRole('button', { name: /create account/i }).click();
      
      await expect(page.getByText(/passwords do not match/i)).toBeVisible();
    });
  });

  test.describe('Forgot Password Page', () => {
    test('should display forgot password form', async ({ page }) => {
      await page.goto('/forgot-password');
      
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible();
    });
  });
});

test.describe('Protected Routes', () => {
  test('should allow access to dashboard when authenticated', async ({ page }) => {
    // The app auto-authenticates with demo user in development
    await page.goto('/dashboard');
    
    // Should show dashboard content
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should show sidebar navigation when authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show sidebar with navigation items
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /files/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
  });
});

test.describe('Admin Routes', () => {
  test('should allow admin access to user management', async ({ page }) => {
    // Demo user is ADMIN role
    await page.goto('/admin/users');
    
    // Should show user management content
    await expect(page.getByText(/user management/i)).toBeVisible();
  });

  test('should allow admin access to RBAC management', async ({ page }) => {
    await page.goto('/admin/rbac');
    
    // Should show RBAC content
    await expect(page.getByText(/rbac/i)).toBeVisible();
  });

  test('should allow admin access to permissions matrix', async ({ page }) => {
    await page.goto('/admin/permissions');
    
    // Should show permissions content
    await expect(page.getByText(/permission/i)).toBeVisible();
  });
});
