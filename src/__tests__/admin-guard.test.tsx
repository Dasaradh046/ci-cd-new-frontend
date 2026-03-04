/**
 * Admin Guard Component Tests
 * Tests for role-based access control
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminGuard } from '../components/auth/admin-guard';

// Mock the auth store hooks
jest.mock('../lib/stores/auth.store', () => ({
  useAuthStore: jest.fn(),
  useIsAdmin: jest.fn(),
  useIsAuthenticated: jest.fn(),
}));

import { useAuthStore, useIsAdmin, useIsAuthenticated } from '../lib/stores/auth.store';

describe('AdminGuard', () => {
  const mockChildren = <div>Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user is admin', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isInitialized: true,
    });
    (useIsAuthenticated as unknown as jest.Mock).mockReturnValue(true);
    (useIsAdmin as unknown as jest.Mock).mockReturnValue(true);
    
    render(<AdminGuard>{mockChildren}</AdminGuard>);
    
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  it('should show access denied when not authenticated', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isInitialized: true,
    });
    (useIsAuthenticated as unknown as jest.Mock).mockReturnValue(false);
    (useIsAdmin as unknown as jest.Mock).mockReturnValue(false);
    
    render(<AdminGuard>{mockChildren}</AdminGuard>);
    
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it('should show access denied when authenticated but not admin', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isInitialized: true,
    });
    (useIsAuthenticated as unknown as jest.Mock).mockReturnValue(true);
    (useIsAdmin as unknown as jest.Mock).mockReturnValue(false);
    
    render(<AdminGuard>{mockChildren}</AdminGuard>);
    
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });
});
