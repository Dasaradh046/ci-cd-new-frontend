/**
 * Notifications API Service
 * Handles all notification API calls with fallback
 */

import {
  fetchPaginatedWithFallback,
  postWithFallback,
  FallbackResponse,
} from './client';
import type { Notification, PaginatedResponse, ApiResponse } from '../models';

/**
 * Get all notifications for current user
 */
export async function getNotifications(
  page: number = 1,
  pageSize: number = 10,
  unreadOnly: boolean = false
): Promise<FallbackResponse<PaginatedResponse<Notification>>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(unreadOnly && { unreadOnly: 'true' }),
  });

  return fetchPaginatedWithFallback<Notification>(
    `/notifications?${params.toString()}`,
    'notifications.json'
  );
}

/**
 * Mark notification as read
 */
export async function markAsRead(
  id: string
): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    `/notifications/${id}/read`,
    'notifications.json',
    {},
    { success: true, data: null }
  );
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    '/notifications/read-all',
    'notifications.json',
    {},
    { success: true, data: null }
  );
}

/**
 * Delete notification
 */
export async function deleteNotification(
  id: string
): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    `/notifications/${id}/delete`,
    'notifications.json',
    {},
    { success: true, data: null }
  );
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<FallbackResponse<ApiResponse<{ count: number }>>> {
  return postWithFallback(
    '/notifications/unread-count',
    'notifications.json',
    {},
    { success: true, data: { count: 3 } }
  );
}

/**
 * Get notification icon based on type
 */
export function getNotificationIcon(type: string): string {
  switch (type) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'alert-triangle';
    case 'error':
      return 'x-circle';
    case 'info':
    default:
      return 'info';
  }
}
