/**
 * Page Breadcrumb Navigation Component
 * Reusable breadcrumb navigation for all pages
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Route to breadcrumb mapping
const routeConfig: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Dashboard' },
  ],
  '/profile': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Profile' },
  ],
  '/settings': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Settings' },
  ],
  '/notifications': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Notifications' },
  ],
  '/files': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Files' },
  ],
  '/docs': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Documentation' },
  ],
  '/admin/users': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Admin', href: '/admin/users' },
    { label: 'User Management' },
  ],
  '/admin/rbac': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Admin', href: '/admin/users' },
    { label: 'RBAC Management' },
  ],
  '/admin/permissions': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Admin', href: '/admin/users' },
    { label: 'Permission Matrix' },
  ],
  '/login': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Sign In' },
  ],
  '/register': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Create Account' },
  ],
  '/forgot-password': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Forgot Password' },
  ],
  '/reset-password': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Reset Password' },
  ],
  '/verify-email': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Verify Email' },
  ],
  '/update-password': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Update Password' },
  ],
};

interface PageBreadcrumbProps {
  /** Custom breadcrumb items to override default mapping */
  items?: BreadcrumbItem[];
  /** Show home icon in first item */
  showHome?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Compact mode - smaller text */
  compact?: boolean;
}

export function PageBreadcrumb({
  items,
  showHome = true,
  className,
  compact = false,
}: PageBreadcrumbProps) {
  const pathname = usePathname();

  // Use custom items if provided, otherwise use route mapping
  const breadcrumbItems = items || routeConfig[pathname] || [
    { label: 'Home', href: '/', icon: Home },
    { label: pathname.split('/').pop() || 'Page' },
  ];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className={cn(compact && 'text-xs')}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <BreadcrumbSeparator className={cn(compact && 'h-3 w-3')} />
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage
                    className={cn(
                      'flex items-center gap-1.5',
                      compact && 'text-xs'
                    )}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href || '#'}
                    className={cn(
                      'flex items-center gap-1.5',
                      compact && 'text-xs'
                    )}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/**
 * Back navigation breadcrumb - simpler alternative
 */
interface BackBreadcrumbProps {
  label: string;
  href: string;
  className?: string;
}

export function BackBreadcrumb({ label, href, className }: BackBreadcrumbProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
