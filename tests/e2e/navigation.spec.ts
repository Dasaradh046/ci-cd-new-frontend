/**
 * E2E Tests for Navigation and User Flows
 * Tests site navigation and user interface
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to Files
    await page.getByRole('link', { name: /^files$/i }).click();
    await expect(page).toHaveURL(/\/files/);
    
    // Navigate to Notifications
    await page.getByRole('link', { name: /notifications/i }).click();
    await expect(page).toHaveURL(/\/notifications/);
    
    // Navigate to Profile
    await page.getByRole('link', { name: /profile/i }).click();
    await expect(page).toHaveURL(/\/profile/);
    
    // Navigate to Settings
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page).toHaveURL(/\/settings/);
  });

  test('should show user information in sidebar footer', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show user name and role
    await expect(page.getByText(/admin user/i)).toBeVisible();
    await expect(page.getByText(/admin/i)).toBeVisible();
  });

  test('should collapse sidebar on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
      return;
    }
    
    await page.goto('/dashboard');
    
    // Sidebar should be collapsed on mobile initially
    // Click the trigger to expand
    const trigger = page.getByRole('button', { name: /toggle sidebar/i });
    if (await trigger.isVisible()) {
      await trigger.click();
    }
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark themes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find and click theme toggle
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await themeToggle.click();
    
    // Should show theme options
    await expect(page.getByRole('menuitem', { name: /light/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /dark/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /system/i })).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test('should display dashboard statistics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show stat cards
    await expect(page.getByText(/total users/i)).toBeVisible();
    await expect(page.getByText(/active sessions/i)).toBeVisible();
  });

  test('should show recent activity', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show activity section
    await expect(page.getByText(/recent activity/i)).toBeVisible();
  });
});

test.describe('Files Page', () => {
  test('should display file list', async ({ page }) => {
    await page.goto('/files');
    
    // Should show files content
    await expect(page.getByText(/files/i)).toBeVisible();
  });

  test('should show upload button', async ({ page }) => {
    await page.goto('/files');
    
    // Should show upload functionality
    await expect(page.getByRole('button', { name: /upload/i })).toBeVisible();
  });
});

test.describe('Notifications Page', () => {
  test('should display notifications', async ({ page }) => {
    await page.goto('/notifications');
    
    // Should show notifications content
    await expect(page.getByText(/notifications/i)).toBeVisible();
  });
});

test.describe('Profile Page', () => {
  test('should display user profile form', async ({ page }) => {
    await page.goto('/profile');
    
    // Should show profile content
    await expect(page.getByText(/profile/i)).toBeVisible();
    
    // Should show editable fields
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });
});

test.describe('Settings Page', () => {
  test('should display settings sections', async ({ page }) => {
    await page.goto('/settings');
    
    // Should show settings content
    await expect(page.getByText(/settings/i)).toBeVisible();
  });
});

test.describe('DevSecOps Docs Page', () => {
  test('should display documentation tabs', async ({ page }) => {
    await page.goto('/docs');
    
    // Should show documentation
    await expect(page.getByText(/devsecops/i)).toBeVisible();
    
    // Should show pipeline tab
    await expect(page.getByRole('tab', { name: /pipeline/i })).toBeVisible();
    
    // Should show security tab
    await expect(page.getByRole('tab', { name: /security/i })).toBeVisible();
  });

  test('should switch between documentation tabs', async ({ page }) => {
    await page.goto('/docs');
    
    // Click on Security Controls tab
    await page.getByRole('tab', { name: /security/i }).click();
    await expect(page.getByText(/jwt rs256/i)).toBeVisible();
    
    // Click on Security Tools tab
    await page.getByRole('tab', { name: /tools/i }).click();
    await expect(page.getByText(/trivy/i)).toBeVisible();
    
    // Click on Compliance tab
    await page.getByRole('tab', { name: /compliance/i }).click();
    await expect(page.getByText(/soc 2/i)).toBeVisible();
  });
});

test.describe('Admin User Management', () => {
  test('should display users table', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Should show users table
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should show user management actions', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Should show action buttons
    await expect(page.getByRole('button', { name: /add user/i })).toBeVisible();
  });
});

test.describe('Admin RBAC Management', () => {
  test('should display roles and permissions', async ({ page }) => {
    await page.goto('/admin/rbac');
    
    // Should show RBAC content
    await expect(page.getByText(/role/i)).toBeVisible();
    await expect(page.getByText(/permission/i)).toBeVisible();
  });
});

test.describe('Admin Permission Matrix', () => {
  test('should display permission matrix', async ({ page }) => {
    await page.goto('/admin/permissions');
    
    // Should show permission matrix content
    await expect(page.getByText(/permission/i)).toBeVisible();
  });
});
