/**
 * Section Header Component
 * Consistent section headers for documentation
 */

'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  id?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function SectionHeader({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  iconColor = 'text-primary',
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn('scroll-mt-20 mb-6', className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn('p-2 rounded-xl bg-primary/10', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold tracking-tight" id={id}>{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
