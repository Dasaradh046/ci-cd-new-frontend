/**
 * Feature Tests - Notifications System
 * Tests for notification creation, management, and real-time delivery
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Types
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    system: boolean;
    security: boolean;
    updates: boolean;
    messages: boolean;
  };
}

// Notification utilities
const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
};

const getNotificationIcon = (type: Notification['type']): string => {
  const icons: Record<Notification['type'], string> = {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'x-circle',
    system: 'settings',
  };
  return icons[type];
};

const getNotificationColor = (type: Notification['type']): string => {
  const colors: Record<Notification['type'], string> = {
    info: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    system: 'gray',
  };
  return colors[type];
};

const groupNotificationsByDate = (
  notifications: Notification[]
): Record<string, Notification[]> => {
  const groups: Record<string, Notification[]> = {};
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  notifications.forEach((n) => {
    const date = new Date(n.createdAt).toDateString();
    let groupKey: string;

    if (date === today) {
      groupKey = 'Today';
    } else if (date === yesterday) {
      groupKey = 'Yesterday';
    } else {
      groupKey = new Date(n.createdAt).toLocaleDateString();
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(n);
  });

  return groups;
};

const filterUnread = (notifications: Notification[]): Notification[] => {
  return notifications.filter((n) => !n.read);
};

const filterByType = (
  notifications: Notification[],
  types: Notification['type'][]
): Notification[] => {
  return notifications.filter((n) => types.includes(n.type));
};

const countUnread = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.read).length;
};

const markAsRead = (notification: Notification): Notification => {
  return { ...notification, read: true };
};

const markAllAsRead = (notifications: Notification[]): Notification[] => {
  return notifications.map((n) => ({ ...n, read: true }));
};

describe('Notification Utilities', () => {
  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    it('should format seconds ago', () => {
      const date = new Date('2024-01-15T11:59:30');
      expect(formatRelativeTime(date)).toBe('Just now');
    });

    it('should format minutes ago', () => {
      const date = new Date('2024-01-15T11:55:00');
      expect(formatRelativeTime(date)).toBe('5m ago');
    });

    it('should format hours ago', () => {
      const date = new Date('2024-01-15T09:00:00');
      expect(formatRelativeTime(date)).toBe('3h ago');
    });

    it('should format days ago', () => {
      const date = new Date('2024-01-12T12:00:00');
      expect(formatRelativeTime(date)).toBe('3d ago');
    });

    it('should format older dates with locale string', () => {
      const date = new Date('2024-01-01T12:00:00');
      const result = formatRelativeTime(date);
      expect(result).not.toContain('ago');
    });
  });

  describe('getNotificationIcon', () => {
    it('should return correct icon for each type', () => {
      expect(getNotificationIcon('info')).toBe('info');
      expect(getNotificationIcon('success')).toBe('check-circle');
      expect(getNotificationIcon('warning')).toBe('alert-triangle');
      expect(getNotificationIcon('error')).toBe('x-circle');
      expect(getNotificationIcon('system')).toBe('settings');
    });
  });

  describe('getNotificationColor', () => {
    it('should return correct color for each type', () => {
      expect(getNotificationColor('info')).toBe('blue');
      expect(getNotificationColor('success')).toBe('green');
      expect(getNotificationColor('warning')).toBe('yellow');
      expect(getNotificationColor('error')).toBe('red');
      expect(getNotificationColor('system')).toBe('gray');
    });
  });
});

describe('Notification Filtering', () => {
  const mockNotifications: Notification[] = [
    { id: '1', type: 'info', title: 'New feature', message: 'Check out the new feature', read: false, createdAt: '2024-01-15T10:00:00' },
    { id: '2', type: 'warning', title: 'Security alert', message: 'New login detected', read: true, createdAt: '2024-01-15T09:00:00' },
    { id: '3', type: 'success', title: 'Upload complete', message: 'File uploaded successfully', read: false, createdAt: '2024-01-14T15:00:00' },
    { id: '4', type: 'error', title: 'Error', message: 'Something went wrong', read: true, createdAt: '2024-01-14T10:00:00' },
    { id: '5', type: 'system', title: 'Maintenance', message: 'Scheduled maintenance', read: false, createdAt: '2024-01-13T08:00:00' },
  ];

  describe('filterUnread', () => {
    it('should return only unread notifications', () => {
      const unread = filterUnread(mockNotifications);
      expect(unread).toHaveLength(3);
      expect(unread.every((n) => !n.read)).toBe(true);
    });
  });

  describe('filterByType', () => {
    it('should filter by single type', () => {
      const errors = filterByType(mockNotifications, ['error']);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('error');
    });

    it('should filter by multiple types', () => {
      const alerts = filterByType(mockNotifications, ['warning', 'error']);
      expect(alerts).toHaveLength(2);
    });

    it('should return empty for no matches', () => {
      const result = filterByType(mockNotifications, []);
      expect(result).toHaveLength(0);
    });
  });

  describe('countUnread', () => {
    it('should count unread notifications', () => {
      expect(countUnread(mockNotifications)).toBe(3);
    });

    it('should return 0 for all read', () => {
      const allRead = mockNotifications.map((n) => ({ ...n, read: true }));
      expect(countUnread(allRead)).toBe(0);
    });
  });

  describe('groupNotificationsByDate', () => {
    it('should group notifications by date', () => {
      const groups = groupNotificationsByDate(mockNotifications);

      expect(groups['Today']).toBeDefined();
      expect(groups['Yesterday']).toBeDefined();
    });

    it('should maintain notification order within groups', () => {
      const groups = groupNotificationsByDate(mockNotifications);

      if (groups['Today']) {
        const timestamps = groups['Today'].map((n) => new Date(n.createdAt).getTime());
        expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a));
      }
    });
  });
});

describe('Notification Actions', () => {
  describe('markAsRead', () => {
    it('should mark notification as read', () => {
      const notification: Notification = {
        id: '1',
        type: 'info',
        title: 'Test',
        message: 'Test message',
        read: false,
        createdAt: '2024-01-15T10:00:00',
      };

      const read = markAsRead(notification);
      expect(read.read).toBe(true);
      expect(read.id).toBe(notification.id);
    });

    it('should not modify original notification', () => {
      const notification: Notification = {
        id: '1',
        type: 'info',
        title: 'Test',
        message: 'Test message',
        read: false,
        createdAt: '2024-01-15T10:00:00',
      };

      markAsRead(notification);
      expect(notification.read).toBe(false);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      const notifications: Notification[] = [
        { id: '1', type: 'info', title: 'Test 1', message: 'Message 1', read: false, createdAt: '2024-01-15T10:00:00' },
        { id: '2', type: 'info', title: 'Test 2', message: 'Message 2', read: false, createdAt: '2024-01-15T09:00:00' },
      ];

      const allRead = markAllAsRead(notifications);
      expect(allRead.every((n) => n.read)).toBe(true);
    });
  });
});

describe('Notification Preferences', () => {
  const defaultPreferences: NotificationPreferences = {
    email: true,
    push: true,
    inApp: true,
    types: {
      system: true,
      security: true,
      updates: true,
      messages: true,
    },
  };

  const shouldSendNotification = (
    prefs: NotificationPreferences,
    channel: 'email' | 'push' | 'inApp',
    type: keyof typeof defaultPreferences.types
  ): boolean => {
    if (!prefs[channel]) return false;
    return prefs.types[type];
  };

  it('should send notification when all preferences enabled', () => {
    expect(shouldSendNotification(defaultPreferences, 'email', 'system')).toBe(true);
    expect(shouldSendNotification(defaultPreferences, 'push', 'security')).toBe(true);
    expect(shouldSendNotification(defaultPreferences, 'inApp', 'updates')).toBe(true);
  });

  it('should not send when channel disabled', () => {
    const prefs: NotificationPreferences = {
      ...defaultPreferences,
      email: false,
    };

    expect(shouldSendNotification(prefs, 'email', 'system')).toBe(false);
    expect(shouldSendNotification(prefs, 'push', 'system')).toBe(true);
  });

  it('should not send when type disabled', () => {
    const prefs: NotificationPreferences = {
      ...defaultPreferences,
      types: {
        ...defaultPreferences.types,
        system: false,
      },
    };

    expect(shouldSendNotification(prefs, 'email', 'system')).toBe(false);
    expect(shouldSendNotification(prefs, 'email', 'security')).toBe(true);
  });
});

describe('Notification Priority', () => {
  type Priority = 'low' | 'medium' | 'high' | 'urgent';

  const getPriority = (type: Notification['type'], metadata?: Record<string, unknown>): Priority => {
    if (metadata?.priority) return metadata.priority as Priority;

    switch (type) {
      case 'error':
        return 'high';
      case 'warning':
        return 'medium';
      case 'system':
        return 'medium';
      default:
        return 'low';
    }
  };

  it('should assign priority based on type', () => {
    expect(getPriority('error')).toBe('high');
    expect(getPriority('warning')).toBe('medium');
    expect(getPriority('info')).toBe('low');
    expect(getPriority('success')).toBe('low');
  });

  it('should use metadata priority when provided', () => {
    expect(getPriority('info', { priority: 'urgent' })).toBe('urgent');
    expect(getPriority('error', { priority: 'low' })).toBe('low');
  });
});

describe('Notification Deduplication', () => {
  const isDuplicate = (
    newNotification: Pick<Notification, 'type' | 'title' | 'message'>,
    existing: Notification[],
    timeWindowMs: number = 60000
  ): boolean => {
    const now = Date.now();
    return existing.some((n) => {
      const notificationTime = new Date(n.createdAt).getTime();
      const withinWindow = now - notificationTime < timeWindowMs;
      const sameContent =
        n.type === newNotification.type &&
        n.title === newNotification.title &&
        n.message === newNotification.message;
      return withinWindow && sameContent;
    });
  };

  it('should detect duplicates within time window', () => {
    const existing: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Test',
        message: 'Test message',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];

    const duplicate = isDuplicate(
      { type: 'info', title: 'Test', message: 'Test message' },
      existing
    );

    expect(duplicate).toBe(true);
  });

  it('should not detect duplicates outside time window', () => {
    const existing: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Test',
        message: 'Test message',
        read: false,
        createdAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
      },
    ];

    const duplicate = isDuplicate(
      { type: 'info', title: 'Test', message: 'Test message' },
      existing
    );

    expect(duplicate).toBe(false);
  });

  it('should not detect duplicates with different content', () => {
    const existing: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Test',
        message: 'Different message',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];

    const duplicate = isDuplicate(
      { type: 'info', title: 'Test', message: 'Test message' },
      existing
    );

    expect(duplicate).toBe(false);
  });
});
