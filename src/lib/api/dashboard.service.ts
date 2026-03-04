/**
 * Dashboard API Service
 * Handles dashboard statistics and activity API calls with fallback
 */

import { fetchWithFallback, FallbackResponse } from './client';
import type { DashboardStats, ApiResponse } from '../models';

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<FallbackResponse<ApiResponse<DashboardStats>>> {
  return fetchWithFallback('/dashboard/stats', 'dashboard.json');
}

/**
 * Format storage size for display
 */
export function formatStorageSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate storage percentage
 */
export function calculateStoragePercentage(used: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((used / limit) * 100);
}
