/**
 * API Integration Tests
 * Tests for all API endpoints and their interactions
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock fetch
const mockFetch = jest.fn() as jest.Mock;
global.fetch = mockFetch;

// Types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// API Client
class ApiClient {
  private baseUrl = '/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, error.message);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout() {
    return this.request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<{ success: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async verifyEmail(token: string) {
    return this.request<{ success: boolean }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Users endpoints
  async getUsers(page = 1, pageSize = 20) {
    return this.request<PaginatedResponse<User>>(`/users?page=${page}&pageSize=${pageSize}`);
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ success: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Files endpoints
  async getFiles(page = 1, pageSize = 50) {
    return this.request<PaginatedResponse<File>>(`/files?page=${page}&pageSize=${pageSize}`);
  }

  async uploadFile(formData: FormData) {
    return this.request<File>('/files', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async deleteFile(id: string) {
    return this.request<{ success: boolean }>(`/files/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications endpoints
  async getNotifications(page = 1, pageSize = 50) {
    return this.request<PaginatedResponse<Notification>>(
      `/notifications?page=${page}&pageSize=${pageSize}`
    );
  }

  async markNotificationRead(id: string) {
    return this.request<Notification>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsRead() {
    return this.request<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request<{
      totalUsers: number;
      activeUsers: number;
      totalFiles: number;
      storageUsed: number;
    }>('/dashboard/stats');
  }

  // RBAC endpoints
  async getRoles() {
    return this.request<{ id: string; name: string; permissions: string[] }[]>('/rbac/roles');
  }

  async updateRolePermissions(roleId: string, permissions: string[]) {
    return this.request<{ success: boolean }>(`/rbac/roles/${roleId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Initialize client
const api = new ApiClient();

describe('Auth API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'USER' },
        token: 'jwt-token',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.login('test@example.com', 'password123');

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('jwt-token');
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should handle invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      });

      await expect(api.login('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should handle rate limiting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ message: 'Too many attempts' }),
      });

      await expect(api.login('test@example.com', 'password')).rejects.toThrow('Too many attempts');
    });
  });

  describe('POST /auth/register', () => {
    it('should register new user', async () => {
      const mockResponse = {
        user: { id: '1', email: 'new@example.com', name: 'New User', role: 'USER' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.register('New User', 'new@example.com', 'password123');

      expect(result.user.email).toBe('new@example.com');
    });

    it('should handle duplicate email', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ message: 'Email already exists' }),
      });

      await expect(
        api.register('User', 'existing@example.com', 'password')
      ).rejects.toThrow('Email already exists');
    });

    it('should validate password strength', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Password too weak' }),
      });

      await expect(
        api.register('User', 'test@example.com', 'weak')
      ).rejects.toThrow('Password too weak');
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send reset email', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await api.forgotPassword('test@example.com');

      expect(result.success).toBe(true);
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await api.resetPassword('valid-token', 'newpassword123');

      expect(result.success).toBe(true);
    });

    it('should reject expired token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Token expired' }),
      });

      await expect(
        api.resetPassword('expired-token', 'newpassword')
      ).rejects.toThrow('Token expired');
    });
  });
});

describe('Users API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /users', () => {
    it('should return paginated users', async () => {
      const mockResponse: PaginatedResponse<User> = {
        data: [
          { id: '1', email: 'user1@example.com', name: 'User 1', role: 'USER', status: 'ACTIVE', emailVerified: true, createdAt: '2024-01-01' },
          { id: '2', email: 'user2@example.com', name: 'User 2', role: 'USER', status: 'ACTIVE', emailVerified: true, createdAt: '2024-01-02' },
        ],
        pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getUsers();

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should handle pagination', async () => {
      const mockResponse: PaginatedResponse<User> = {
        data: [],
        pagination: { page: 2, pageSize: 20, total: 25, totalPages: 2 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getUsers(2, 20);

      expect(result.pagination.page).toBe(2);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: '2024-01-01',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      const result = await api.getUser('1');

      expect(result.id).toBe('1');
      expect(result.email).toBe('user@example.com');
    });

    it('should handle user not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'User not found' }),
      });

      await expect(api.getUser('999')).rejects.toThrow('User not found');
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user', async () => {
      const mockResponse: User = {
        id: '1',
        email: 'updated@example.com',
        name: 'Updated Name',
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: '2024-01-01',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.updateUser('1', { name: 'Updated Name' });

      expect(result.name).toBe('Updated Name');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await api.deleteUser('1');

      expect(result.success).toBe(true);
    });

    it('should handle unauthorized deletion', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: 'Cannot delete this user' }),
      });

      await expect(api.deleteUser('1')).rejects.toThrow('Cannot delete this user');
    });
  });
});

describe('Files API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /files', () => {
    it('should return paginated files', async () => {
      const mockResponse: PaginatedResponse<File> = {
        data: [
          { id: '1', name: 'document.pdf', size: 1024, type: 'application/pdf', url: '/files/1' },
          { id: '2', name: 'image.jpg', size: 2048, type: 'image/jpeg', url: '/files/2' },
        ],
        pagination: { page: 1, pageSize: 50, total: 2, totalPages: 1 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getFiles();

      expect(result.data).toHaveLength(2);
    });
  });

  describe('POST /files', () => {
    it('should upload file', async () => {
      const mockResponse: File = {
        id: '1',
        name: 'document.pdf',
        size: 1024,
        type: 'application/pdf',
        url: '/files/1',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const formData = new FormData();
      formData.append('file', new Blob(['content']), 'document.pdf');

      const result = await api.uploadFile(formData);

      expect(result.name).toBe('document.pdf');
    });

    it('should reject large files', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: () => Promise.resolve({ message: 'File too large' }),
      });

      const formData = new FormData();
      formData.append('file', new Blob(['x'.repeat(100)]), 'large.pdf');

      await expect(api.uploadFile(formData)).rejects.toThrow('File too large');
    });

    it('should reject invalid file types', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid file type' }),
      });

      const formData = new FormData();
      formData.append('file', new Blob(['content']), 'malware.exe');

      await expect(api.uploadFile(formData)).rejects.toThrow('Invalid file type');
    });
  });

  describe('DELETE /files/:id', () => {
    it('should delete file', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await api.deleteFile('1');

      expect(result.success).toBe(true);
    });

    it('should handle file not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'File not found' }),
      });

      await expect(api.deleteFile('999')).rejects.toThrow('File not found');
    });
  });
});

describe('Notifications API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /notifications', () => {
    it('should return paginated notifications', async () => {
      const mockResponse: PaginatedResponse<Notification> = {
        data: [
          { id: '1', type: 'info', title: 'Test', message: 'Test message', read: false, createdAt: '2024-01-01' },
        ],
        pagination: { page: 1, pageSize: 50, total: 1, totalPages: 1 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getNotifications();

      expect(result.data).toHaveLength(1);
    });
  });

  describe('POST /notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const mockResponse: Notification = {
        id: '1',
        type: 'info',
        title: 'Test',
        message: 'Test message',
        read: true,
        createdAt: '2024-01-01',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.markNotificationRead('1');

      expect(result.read).toBe(true);
    });
  });

  describe('POST /notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await api.markAllNotificationsRead();

      expect(result.success).toBe(true);
    });
  });
});

describe('Dashboard API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /dashboard/stats', () => {
    it('should return dashboard statistics', async () => {
      const mockResponse = {
        totalUsers: 100,
        activeUsers: 75,
        totalFiles: 500,
        storageUsed: 1073741824, // 1GB
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getDashboardStats();

      expect(result.totalUsers).toBe(100);
      expect(result.activeUsers).toBe(75);
    });
  });
});

describe('RBAC API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /rbac/roles', () => {
    it('should return all roles', async () => {
      const mockResponse = [
        { id: '1', name: 'SUPER_ADMIN', permissions: ['users:manage', 'roles:manage'] },
        { id: '2', name: 'ADMIN', permissions: ['users:manage', 'files:manage'] },
        { id: '3', name: 'USER', permissions: ['files:view', 'files:create'] },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getRoles();

      expect(result).toHaveLength(3);
    });
  });

  describe('PUT /rbac/roles/:id/permissions', () => {
    it('should update role permissions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await api.updateRolePermissions('2', ['users:view', 'users:create']);

      expect(result.success).toBe(true);
    });

    it('should reject unauthorized permission changes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: 'Cannot modify SUPER_ADMIN permissions' }),
      });

      await expect(
        api.updateRolePermissions('1', ['users:delete'])
      ).rejects.toThrow('Cannot modify SUPER_ADMIN permissions');
    });
  });
});

describe('API Error Handling', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(api.getUsers()).rejects.toThrow('Network error');
  });

  it('should handle 500 server errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Internal server error' }),
    });

    await expect(api.getUsers()).rejects.toThrow('Internal server error');
  });

  it('should handle 401 unauthorized', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Unauthorized' }),
    });

    await expect(api.getUsers()).rejects.toThrow('Unauthorized');
  });

  it('should handle 403 forbidden', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ message: 'Access denied' }),
    });

    await expect(api.getUsers()).rejects.toThrow('Access denied');
  });

  it('should handle JSON parse errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    await expect(api.getUsers()).rejects.toThrow('Unknown error');
  });
});

describe('API Request Headers', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should include Content-Type header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });

    await api.getUsers();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should send JSON body for POST requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: {}, token: '' }),
    });

    await api.login('test@example.com', 'password');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      })
    );
  });
});
