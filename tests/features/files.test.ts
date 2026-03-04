/**
 * Feature Tests - Files Management
 * Tests for file upload, download, and management functionality
 */

import { describe, it, expect } from '@jest/globals';

// Types
interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface FileUploadOptions {
  maxSizeMB: number;
  allowedTypes: string[];
  onProgress?: (progress: number) => void;
}

// File utilities to test
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
};

const isAllowedFileType = (filename: string, allowedTypes: string[]): boolean => {
  const ext = getFileExtension(filename);
  return allowedTypes.some((type) => type.toLowerCase() === ext || type.toLowerCase() === `.${ext}`);
};

const validateFileSize = (file: { size: number }, maxSizeMB: number): { valid: boolean; error?: string } => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }
  return { valid: true };
};

const validateFile = (
  file: { name: string; size: number },
  options: FileUploadOptions
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check file size
  const sizeValidation = validateFileSize(file, options.maxSizeMB);
  if (!sizeValidation.valid) {
    errors.push(sizeValidation.error!);
  }

  // Check file type
  if (!isAllowedFileType(file.name, options.allowedTypes)) {
    errors.push(`File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
};

const generateUniqueFilename = (originalName: string): string => {
  const ext = getFileExtension(originalName);
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseName}_${timestamp}_${random}.${ext}`;
};

const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  return imageExtensions.includes(getFileExtension(filename));
};

const isDocumentFile = (filename: string): boolean => {
  const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'];
  return docExtensions.includes(getFileExtension(filename));
};

describe('File Utilities', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should handle large files', () => {
      expect(formatFileSize(1099511627776)).toBe('1 TB');
    });

    it('should round to 2 decimal places', () => {
      expect(formatFileSize(1234567)).toBe('1.18 MB');
    });
  });

  describe('getFileExtension', () => {
    it('should extract extension from filename', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('image.PNG')).toBe('png');
      expect(getFileExtension('archive.tar.gz')).toBe('gz');
    });

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('README')).toBe('');
      expect(getFileExtension('.gitignore')).toBe('gitignore');
    });
  });

  describe('isAllowedFileType', () => {
    it('should return true for allowed types', () => {
      expect(isAllowedFileType('document.pdf', ['pdf', 'doc', 'docx'])).toBe(true);
      expect(isAllowedFileType('image.jpg', ['jpg', 'jpeg', 'png'])).toBe(true);
    });

    it('should return false for disallowed types', () => {
      expect(isAllowedFileType('script.exe', ['pdf', 'doc'])).toBe(false);
      expect(isAllowedFileType('video.mp4', ['jpg', 'png'])).toBe(false);
    });

    it('should handle extensions with dots', () => {
      expect(isAllowedFileType('document.pdf', ['.pdf', '.doc'])).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(isAllowedFileType('IMAGE.JPG', ['jpg', 'png'])).toBe(true);
    });
  });

  describe('validateFileSize', () => {
    it('should pass for files within limit', () => {
      const result = validateFileSize({ size: 5 * 1024 * 1024 }, 10);
      expect(result.valid).toBe(true);
    });

    it('should fail for files exceeding limit', () => {
      const result = validateFileSize({ size: 15 * 1024 * 1024 }, 10);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    it('should handle edge cases', () => {
      const exactLimit = validateFileSize({ size: 10 * 1024 * 1024 }, 10);
      expect(exactLimit.valid).toBe(true);

      const oneByteOver = validateFileSize({ size: 10 * 1024 * 1024 + 1 }, 10);
      expect(oneByteOver.valid).toBe(false);
    });
  });

  describe('validateFile', () => {
    const defaultOptions: FileUploadOptions = {
      maxSizeMB: 10,
      allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    };

    it('should pass for valid files', () => {
      const result = validateFile(
        { name: 'document.pdf', size: 1024 * 1024 },
        defaultOptions
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for multiple reasons', () => {
      const result = validateFile(
        { name: 'video.mp4', size: 20 * 1024 * 1024 },
        defaultOptions
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('generateUniqueFilename', () => {
    it('should generate unique filename', () => {
      const original = 'document.pdf';
      const unique1 = generateUniqueFilename(original);
      const unique2 = generateUniqueFilename(original);

      expect(unique1).not.toBe(unique2);
      expect(unique1).toMatch(/document_.*\.pdf$/);
    });

    it('should preserve extension', () => {
      expect(generateUniqueFilename('image.jpg')).toMatch(/\.jpg$/);
      expect(generateUniqueFilename('data.json')).toMatch(/\.json$/);
    });

    it('should handle filenames without extension', () => {
      const unique = generateUniqueFilename('README');
      expect(unique).toMatch(/README_/);
    });
  });

  describe('isImageFile', () => {
    it('should return true for image files', () => {
      expect(isImageFile('photo.jpg')).toBe(true);
      expect(isImageFile('icon.png')).toBe(true);
      expect(isImageFile('animation.gif')).toBe(true);
      expect(isImageFile('vector.svg')).toBe(true);
    });

    it('should return false for non-image files', () => {
      expect(isImageFile('document.pdf')).toBe(false);
      expect(isImageFile('video.mp4')).toBe(false);
    });
  });

  describe('isDocumentFile', () => {
    it('should return true for document files', () => {
      expect(isDocumentFile('report.pdf')).toBe(true);
      expect(isDocumentFile('letter.docx')).toBe(true);
      expect(isDocumentFile('spreadsheet.xlsx')).toBe(true);
    });

    it('should return false for non-document files', () => {
      expect(isDocumentFile('photo.jpg')).toBe(false);
      expect(isDocumentFile('video.mp4')).toBe(false);
    });
  });
});

describe('File List Operations', () => {
  const mockFiles: File[] = [
    { id: '1', name: 'report.pdf', size: 1024000, type: 'application/pdf', url: '/files/1', uploadedAt: '2024-01-01', uploadedBy: 'user1' },
    { id: '2', name: 'image.jpg', size: 512000, type: 'image/jpeg', url: '/files/2', uploadedAt: '2024-01-02', uploadedBy: 'user2' },
    { id: '3', name: 'data.xlsx', size: 2048000, type: 'application/vnd.ms-excel', url: '/files/3', uploadedAt: '2024-01-03', uploadedBy: 'user1' },
    { id: '4', name: 'photo.png', size: 3072000, type: 'image/png', url: '/files/4', uploadedAt: '2024-01-04', uploadedBy: 'user3' },
  ];

  const filterFilesByType = (files: File[], typePrefix: string): File[] => {
    return files.filter((f) => f.type.startsWith(typePrefix));
  };

  const sortFilesBySize = (files: File[], ascending = true): File[] => {
    return [...files].sort((a, b) =>
      ascending ? a.size - b.size : b.size - a.size
    );
  };

  const sortFilesByDate = (files: File[], newest = true): File[] => {
    return [...files].sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime();
      const dateB = new Date(b.uploadedAt).getTime();
      return newest ? dateB - dateA : dateA - dateB;
    });
  };

  const searchFiles = (files: File[], query: string): File[] => {
    const lowerQuery = query.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(lowerQuery));
  };

  const getTotalSize = (files: File[]): number => {
    return files.reduce((sum, f) => sum + f.size, 0);
  };

  describe('filterFilesByType', () => {
    it('should filter by image type', () => {
      const images = filterFilesByType(mockFiles, 'image/');
      expect(images).toHaveLength(2);
    });

    it('should filter by application type', () => {
      const docs = filterFilesByType(mockFiles, 'application/');
      expect(docs).toHaveLength(2);
    });

    it('should return empty array for no matches', () => {
      const videos = filterFilesByType(mockFiles, 'video/');
      expect(videos).toHaveLength(0);
    });
  });

  describe('sortFilesBySize', () => {
    it('should sort ascending by size', () => {
      const sorted = sortFilesBySize(mockFiles, true);
      expect(sorted[0].size).toBeLessThanOrEqual(sorted[1].size);
    });

    it('should sort descending by size', () => {
      const sorted = sortFilesBySize(mockFiles, false);
      expect(sorted[0].size).toBeGreaterThanOrEqual(sorted[1].size);
    });
  });

  describe('sortFilesByDate', () => {
    it('should sort newest first', () => {
      const sorted = sortFilesByDate(mockFiles, true);
      expect(new Date(sorted[0].uploadedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[1].uploadedAt).getTime()
      );
    });

    it('should sort oldest first', () => {
      const sorted = sortFilesByDate(mockFiles, false);
      expect(new Date(sorted[0].uploadedAt).getTime()).toBeLessThanOrEqual(
        new Date(sorted[1].uploadedAt).getTime()
      );
    });
  });

  describe('searchFiles', () => {
    it('should find files by name', () => {
      const results = searchFiles(mockFiles, 'image');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('image.jpg');
    });

    it('should be case-insensitive', () => {
      const results = searchFiles(mockFiles, 'PHOTO');
      expect(results).toHaveLength(1);
    });

    it('should return empty for no matches', () => {
      const results = searchFiles(mockFiles, 'nonexistent');
      expect(results).toHaveLength(0);
    });
  });

  describe('getTotalSize', () => {
    it('should calculate total size', () => {
      const total = getTotalSize(mockFiles);
      expect(total).toBe(1024000 + 512000 + 2048000 + 3072000);
    });

    it('should return 0 for empty array', () => {
      expect(getTotalSize([])).toBe(0);
    });
  });
});

describe('File Permissions', () => {
  interface FilePermission {
    fileId: string;
    userId: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  }

  const checkPermission = (
    permission: FilePermission | undefined,
    action: 'view' | 'edit' | 'delete' | 'share'
  ): boolean => {
    if (!permission) return false;

    switch (action) {
      case 'view':
        return permission.canView;
      case 'edit':
        return permission.canEdit;
      case 'delete':
        return permission.canDelete;
      case 'share':
        return permission.canShare;
      default:
        return false;
    }
  };

  const mockPermissions: FilePermission[] = [
    { fileId: 'file1', userId: 'user1', canView: true, canEdit: true, canDelete: true, canShare: true },
    { fileId: 'file1', userId: 'user2', canView: true, canEdit: false, canDelete: false, canShare: false },
    { fileId: 'file2', userId: 'user1', canView: true, canEdit: true, canDelete: false, canShare: true },
  ];

  it('should allow owner full permissions', () => {
    const perm = mockPermissions.find((p) => p.fileId === 'file1' && p.userId === 'user1');

    expect(checkPermission(perm, 'view')).toBe(true);
    expect(checkPermission(perm, 'edit')).toBe(true);
    expect(checkPermission(perm, 'delete')).toBe(true);
    expect(checkPermission(perm, 'share')).toBe(true);
  });

  it('should restrict viewer permissions', () => {
    const perm = mockPermissions.find((p) => p.fileId === 'file1' && p.userId === 'user2');

    expect(checkPermission(perm, 'view')).toBe(true);
    expect(checkPermission(perm, 'edit')).toBe(false);
    expect(checkPermission(perm, 'delete')).toBe(false);
  });

  it('should deny permission for non-existent entry', () => {
    expect(checkPermission(undefined, 'view')).toBe(false);
  });
});
