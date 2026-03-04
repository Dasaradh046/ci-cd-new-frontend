/**
 * DevSecOps Application - TypeScript Models
 * Domain models and interfaces following SOLID principles
 */

// ============ User & Authentication Models ============

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST';

export type UserStatus = 'active' | 'suspended' | 'pending_verification';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'assign';
}

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  permissions: Permission[];
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  password: string;
  confirmPassword: string;
}

// ============ File Management Models ============

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  updatedAt: string;
  ownerId: string;
  isPublic: boolean;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  downloadUrl: string;
  expiresAt: string;
  fileId: string;
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// ============ Notification Models ============

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ============ API Response Models ============

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  isMock?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isMock?: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ============ Settings Models ============

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showActivity: boolean;
  };
  language: string;
  timezone: string;
}

// ============ Dashboard Models ============

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalFiles: number;
  storageUsed: number;
  storageLimit: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'user_login' | 'file_upload' | 'user_created' | 'role_changed';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
}

// ============ DevSecOps Documentation Models ============

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  description: string;
  tools: string[];
  failureAction: 'fail' | 'warn' | 'skip';
  estimatedDuration: string;
}

export interface SecurityTool {
  name: string;
  category: 'SAST' | 'SCA' | 'SecretScan' | 'ContainerScan' | 'SBOM';
  description: string;
  documentationUrl: string;
}

export interface DevSecOpsDoc {
  pipelineStages: PipelineStage[];
  securityTools: SecurityTool[];
  complianceFrameworks: string[];
  keyRotationPolicy: string;
  incidentResponseUrl: string;
}
