/**
 * DevSecOps Documentation View
 * Main view component that orchestrates all documentation sections
 * Updated: Split into multiple section components for better maintainability
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Menu,
  X,
  BookOpen,
  Rocket,
  GitBranch,
  Lock,
  Terminal,
  Code2,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFetchWithFallback } from '@/lib/hooks';
import { getDevSecOpsDoc } from '@/lib/api';
import { DashboardSkeleton, MockDataBadge } from '@/components/shared';
import { cn } from '@/lib/utils';

// Import section components
import { OverviewSection } from '@/components/docs/sections/OverviewSection';
import { QuickStartSection } from '@/components/docs/sections/QuickStartSection';
import { PipelineSection } from '@/components/docs/sections/PipelineSection';
import { SecurityControlsSection } from '@/components/docs/sections/SecurityControlsSection';
import { SecurityToolsSection } from '@/components/docs/sections/SecurityToolsSection';
import { APIReferenceSection } from '@/components/docs/sections/APIReferenceSection';
import { ComplianceSection } from '@/components/docs/sections/ComplianceSection';

// Navigation configuration
const DOC_SECTIONS = [
  { id: 'overview', title: 'Overview', icon: BookOpen },
  { id: 'quickstart', title: 'Quick Start', icon: Rocket },
  { id: 'pipeline', title: 'Pipeline Stages', icon: GitBranch },
  { id: 'security', title: 'Security Controls', icon: Lock },
  { id: 'tools', title: 'Security Tools', icon: Terminal },
  { id: 'api', title: 'API Reference', icon: Code2 },
  { id: 'compliance', title: 'Compliance', icon: CheckCircle },
];

export function DevSecOpsView() {
  const { isLoading, isMock } = useFetchWithFallback(
    () => getDevSecOpsDoc(),
    []
  );

  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      
      for (let i = DOC_SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(DOC_SECTIONS[i].id);
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(DOC_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSidebarOpen(false);
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block w-56 shrink-0">
        <nav className="sticky top-20 space-y-1">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 px-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm">DevSecOps</p>
              <p className="text-xs text-muted-foreground">Documentation</p>
            </div>
          </div>

          {/* Navigation Links */}
          {DOC_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left',
                activeSection === section.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <section.icon className="h-4 w-4" />
              {section.title}
            </button>
          ))}

          {/* Version Badge */}
          <div className="pt-6 mt-6 border-t">
            <div className="px-3 flex items-center justify-between">
              <Badge variant="outline" className="text-xs">v2.0.0</Badge>
              {isMock && <MockDataBadge isMock={isMock} />}
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r p-4 pt-20 overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold">DevSecOps</p>
                <p className="text-xs text-muted-foreground">Documentation</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {DOC_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left',
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </button>
              ))}
            </nav>

            {/* Version */}
            <div className="pt-6 mt-6 border-t">
              <Badge variant="outline" className="text-xs">v2.0.0</Badge>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-20">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold tracking-tight">DevSecOps Platform</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Tier-3
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Comprehensive documentation for enterprise-grade security platform with 
            14-stage CI/CD pipeline, JWT RS256 authentication, and compliance-ready architecture.
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-16">
          <OverviewSection />
          <QuickStartSection />
          <PipelineSection />
          <SecurityControlsSection />
          <SecurityToolsSection />
          <APIReferenceSection />
          <ComplianceSection />
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">DevSecOps Platform</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} DevSecOps Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground">Support</a>
              <a href="#" className="hover:text-foreground">Security</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
