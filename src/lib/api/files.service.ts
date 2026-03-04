/**
 * Files API Service
 * Handles all file management API calls with fallback
 */

import {
  fetchPaginatedWithFallback,
  fetchWithFallback,
  deleteWithFallback,
  postWithFallback,
  FallbackResponse,
} from './client';
import type { FileItem, PaginatedResponse, ApiResponse, PresignedUrlResponse } from '../models';

/**
 * Get all files for current user
 */
export async function getFiles(
  page: number = 1,
  pageSize: number = 10
): Promise<FallbackResponse<PaginatedResponse<FileItem>>> {
  return fetchPaginatedWithFallback<FileItem>(
    `/files?page=${page}&pageSize=${pageSize}`,
    'files.json'
  );
}

/**
 * Get file by ID
 */
export async function getFileById(
  id: string
): Promise<FallbackResponse<ApiResponse<FileItem>>> {
  return fetchWithFallback(`/files/${id}`, 'files.json');
}

/**
 * Get presigned URL for file upload
 */
export async function getPresignedUrl(
  fileName: string,
  fileType: string
): Promise<FallbackResponse<ApiResponse<PresignedUrlResponse>>> {
  const mockResponse: PresignedUrlResponse = {
    uploadUrl: `/api/files/upload/${Date.now()}`,
    downloadUrl: `/files/${fileName}`,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    fileId: `file_${Date.now()}`,
  };

  return fetchWithFallback(
    `/files/presign?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}`,
    'files.json'
  );
}

/**
 * Upload file using presigned URL
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<FallbackResponse<ApiResponse<FileItem>>> {
  // Get presigned URL first
  const presignResult = await getPresignedUrl(file.name, file.type);

  if (presignResult.error) {
    return {
      data: null as unknown as ApiResponse<FileItem>,
      isMock: true,
      error: presignResult.error,
    };
  }

  // Simulate upload progress
  if (onProgress && presignResult.isMock) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 100);
  }

  // Mock successful upload
  const mockFile: FileItem = {
    id: presignResult.data?.data?.fileId || `file_${Date.now()}`,
    name: file.name,
    type: file.type,
    size: file.size,
    url: `/files/${file.name}`,
    thumbnailUrl: file.type.startsWith('image/') ? `/files/thumbnails/${file.name}` : undefined,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 'usr_current',
    isPublic: false,
  };

  return {
    data: { success: true, data: mockFile },
    isMock: presignResult.isMock,
  };
}

/**
 * Delete file
 */
export async function deleteFile(
  id: string
): Promise<FallbackResponse<ApiResponse<null>>> {
  return deleteWithFallback(`/files/${id}`, { success: true, data: null });
}

/**
 * Toggle file public status
 */
export async function toggleFilePublic(
  id: string,
  isPublic: boolean
): Promise<FallbackResponse<ApiResponse<FileItem>>> {
  return postWithFallback(
    `/files/${id}/visibility`,
    'files.json',
    { isPublic },
    { success: true, data: null }
  );
}

/**
 * Download file
 */
export async function downloadFile(
  id: string
): Promise<FallbackResponse<Blob>> {
  try {
    const response = await fetch(`/api/files/${id}/download`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    return { data: blob, isMock: false };
  } catch {
    // Return a mock text blob for demo
    const mockBlob = new Blob(['Mock file content'], { type: 'text/plain' });
    return { data: mockBlob, isMock: true };
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file icon based on type
 */
export function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('word') || type.includes('document')) return 'document';
  if (type.includes('sheet') || type.includes('excel')) return 'spreadsheet';
  if (type.includes('zip') || type.includes('archive')) return 'archive';
  if (type.includes('code') || type.includes('javascript') || type.includes('typescript')) return 'code';
  return 'file';
}
