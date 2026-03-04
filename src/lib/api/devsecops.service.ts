/**
 * DevSecOps Documentation API Service
 */

import { fetchWithFallback, FallbackResponse } from './client';
import type { DevSecOpsDoc, ApiResponse } from '../models';

/**
 * Get DevSecOps documentation
 */
export async function getDevSecOpsDoc(): Promise<FallbackResponse<ApiResponse<DevSecOpsDoc>>> {
  return fetchWithFallback('/docs/devsecops', 'devsecops.json');
}
