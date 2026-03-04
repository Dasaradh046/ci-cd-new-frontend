/**
 * Status Badge Component
 * Displays user status with appropriate styling using theme colors
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { UserStatus } from '@/lib/models';

interface StatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  pending_verification: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

/**
 * Role Badge Component
 * Displays user role with appropriate styling
 */
interface RoleBadgeProps {
  role: string;
  className?: string;
}

const roleConfig: Record<string, { label: string; className: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  ADMIN: {
    label: 'Admin',
    className: 'bg-coral/10 text-coral border-coral/20',
  },
  MANAGER: {
    label: 'Manager',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  USER: {
    label: 'User',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  GUEST: {
    label: 'Guest',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role] || roleConfig.USER;

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

/**
 * Notification Type Badge
 */
interface NotificationBadgeProps {
  type: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

const notificationConfig = {
  info: {
    className: 'bg-info/10 text-info border-info/20',
  },
  success: {
    className: 'bg-success/10 text-success border-success/20',
  },
  warning: {
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  error: {
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function NotificationBadge({ type, className }: NotificationBadgeProps) {
  const config = notificationConfig[type];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}
