/**
 * Protected Route Group Layout
 * Layout with sidebar navigation for authenticated users
 */

'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

// Dynamic breadcrumb based on route
function DynamicBreadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean);
  const currentPath = segments[segments.length - 1] || 'dashboard';
  
  const breadcrumbMap: Record<string, string> = {
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    files: 'Files',
    docs: 'Documentation',
    users: 'User Management',
    rbac: 'RBAC Management',
    permissions: 'Permission Matrix',
    admin: 'Admin',
  };
  
  const pageName = breadcrumbMap[currentPath] || currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{pageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Auth initializer component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Use Zustand's persist - it handles hydration automatically
  const hydrated = useAuthStore((state) => state.isInitialized);
  
  if (!hydrated) {
    return <LoadingFallback />;
  }
  
  return <>{children}</>;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthInitializer>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Suspense fallback={<BreadcrumbPage>Dashboard</BreadcrumbPage>}>
              <DynamicBreadcrumb pathname={pathname} />
            </Suspense>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-6">
            <Suspense fallback={<LoadingFallback />}>
              {children}
            </Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthInitializer>
  );
}
