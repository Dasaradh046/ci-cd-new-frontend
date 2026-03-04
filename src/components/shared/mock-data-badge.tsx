/**
 * Mock Data Badge Component
 * Displays a visual indicator when data is from mock/fallback source
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MockDataBadgeProps {
  isMock: boolean;
  className?: string;
}

export function MockDataBadge({ isMock, className }: MockDataBadgeProps) {
  if (!isMock) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 cursor-help ${className}`}
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Mock Data
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">
            This data is from a mock source. The API is unavailable or returned no data.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
