/**
 * Dashboard View Component
 * Enterprise DevSecOps Dashboard - Modern, informative, actionable
 */

'use client';

import { useMemo } from 'react';
import {
  Users,
  FileText,
  Activity,
  HardDrive,
  TrendingUp,
  TrendingDown,
  Shield,
  ArrowRight,
  Upload,
  UserPlus,
  Settings,
  CheckCircle,
  AlertTriangle,
  Server,
  Clock,
  GitBranch,
  Scan,
  Rocket,
  Lock,
  Key,
  AlertCircle,
  Check,
  X,
  Zap,
  Database,
  Globe,
  Terminal,
  MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFetchWithFallback } from '@/lib/hooks';
import { getDashboardStats, formatStorageSize, calculateStoragePercentage } from '@/lib/api';
import { DashboardSkeleton, MockDataBadge } from '@/components/shared';
import type { ActivityItem } from '@/lib/models';
import { cn } from '@/lib/utils';

// Mock data
const MOCK_STATS = {
  totalUsers: 1247,
  activeUsers: 892,
  totalFiles: 3841,
  storageUsed: 45678923456,
  storageLimit: 107374182400,
  recentActivity: [
    { id: '1', type: 'user_login', description: 'User logged in successfully', userName: 'John Doe', timestamp: new Date(Date.now() - 300000).toISOString() },
    { id: '2', type: 'file_upload', description: 'Uploaded "report-q1.pdf"', userName: 'Jane Smith', timestamp: new Date(Date.now() - 600000).toISOString() },
    { id: '3', type: 'user_created', description: 'New user account created', userName: 'Admin', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { id: '4', type: 'role_changed', description: 'Role updated to Manager', userName: 'Mike Wilson', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '5', type: 'file_upload', description: 'Uploaded "presentation.pptx"', userName: 'Sarah Jones', timestamp: new Date(Date.now() - 5400000).toISOString() },
    { id: '6', type: 'security_scan', description: 'Security scan completed', userName: 'System', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: '7', type: 'user_login', description: 'User logged in successfully', userName: 'Alex Brown', timestamp: new Date(Date.now() - 10800000).toISOString() },
  ],
};

const SECURITY_METRICS = [
  { label: 'Vulnerabilities', value: 3, status: 'warning', trend: '-2 this week' },
  { label: 'Security Score', value: 94, status: 'good', trend: '+5 points' },
  { label: 'Failed Logins', value: 12, status: 'normal', trend: 'Last 24h' },
  { label: 'Active Sessions', value: 847, status: 'normal', trend: 'Current' },
];

const PIPELINE_RUNS = [
  { id: 'PR-1234', branch: 'main', status: 'success', duration: '4m 32s', time: '2 min ago', stages: 14 },
  { id: 'PR-1233', branch: 'feature/auth', status: 'running', duration: '2m 15s', time: 'Running', stages: 8 },
  { id: 'PR-1232', branch: 'hotfix/security', status: 'failed', duration: '1m 45s', time: '15 min ago', stages: 5 },
  { id: 'PR-1231', branch: 'develop', status: 'success', duration: '5m 12s', time: '1 hour ago', stages: 14 },
];

const SYSTEM_SERVICES = [
  { name: 'API Services', status: 'operational', uptime: '99.99%', icon: Server },
  { name: 'Authentication', status: 'operational', uptime: '99.98%', icon: Lock },
  { name: 'Database', status: 'operational', uptime: '99.95%', icon: Database },
  { name: 'File Storage', status: 'operational', uptime: '99.95%', icon: HardDrive },
];

const ACTIVITY_CONFIG: Record<string, { icon: typeof Users; color: string; bg: string }> = {
  user_login: { icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  file_upload: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  user_created: { icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10' },
  role_changed: { icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
  security_scan: { icon: Scan, color: 'text-purple-600', bg: 'bg-purple-50' },
};

export function DashboardView() {
  const { data, isLoading, isMock } = useFetchWithFallback(
    () => getDashboardStats(),
    MOCK_STATS
  );

  const stats = data?.data;
  const storagePercentage = stats ? calculateStoragePercentage(stats.storageUsed, stats.storageLimit) : 0;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your platform overview.</p>
        </div>
        <div className="flex items-center gap-2">
          {isMock && <MockDataBadge isMock={isMock} />}
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-1.5" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend={{ value: '+12%', up: true }}
          color="blue"
        />
        <StatsCard
          title="Active Now"
          value={stats?.activeUsers || 0}
          icon={Activity}
          trend={{ value: '+5%', up: true }}
          color="emerald"
        />
        <StatsCard
          title="Total Files"
          value={stats?.totalFiles || 0}
          icon={FileText}
          trend={{ value: '+23', up: true }}
          color="purple"
        />
        <StorageCard
          used={stats?.storageUsed || 0}
          limit={stats?.storageLimit || 0}
          percentage={storagePercentage}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Activity & Pipeline */}
        <div className="xl:col-span-2 space-y-6">
          {/* Security Metrics */}
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50">
                  <Shield className="h-4 w-4 text-amber-600" />
                </div>
                <CardTitle className="text-base font-medium">Security Overview</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
                View Details
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
                {SECURITY_METRICS.map((metric) => (
                  <div key={metric.label} className="p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      {metric.status === 'warning' && (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      )}
                      {metric.status === 'good' && (
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{metric.trend}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Runs */}
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <GitBranch className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-medium">Recent Pipelines</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
                View All
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {PIPELINE_RUNS.map((run) => (
                  <div key={run.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      run.status === 'success' && 'bg-emerald-50',
                      run.status === 'running' && 'bg-primary/10',
                      run.status === 'failed' && 'bg-red-50'
                    )}>
                      {run.status === 'success' && <Check className="h-4 w-4 text-emerald-600" />}
                      {run.status === 'running' && (
                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      )}
                      {run.status === 'failed' && <X className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{run.id}</span>
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                          {run.branch}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {run.stages}/14 stages • {run.duration}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{run.time}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Re-run Pipeline</DropdownMenuItem>
                        <DropdownMenuItem>View Logs</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50">
                  <Activity className="h-4 w-4 text-purple-600" />
                </div>
                <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
                View all
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[300px] overflow-y-auto">
                {stats?.recentActivity?.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <QuickAction icon={Upload} label="Upload Files" color="blue" />
              <QuickAction icon={UserPlus} label="Invite User" color="emerald" />
              <QuickAction icon={Key} label="API Keys" color="purple" />
              <QuickAction icon={Shield} label="Security" color="amber" />
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">System Status</CardTitle>
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                  Operational
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {SYSTEM_SERVICES.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-muted">
                      <service.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{service.uptime}</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <a 
                href="#" 
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-blue-50">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">API Documentation</p>
                  <p className="text-xs text-muted-foreground">REST & GraphQL APIs</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-purple-50">
                  <Terminal className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">CLI Guide</p>
                  <p className="text-xs text-muted-foreground">Command line tools</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-amber-50">
                  <Zap className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Best Practices</p>
                  <p className="text-xs text-muted-foreground">Security guidelines</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Stats Card
function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color,
}: { 
  title: string; 
  value: number; 
  icon: typeof Users; 
  trend: { value: string; up: boolean };
  color: 'blue' | 'emerald' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('p-2 rounded-xl', colorClasses[color])}>
            <Icon className="h-4 w-4" />
          </div>
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            trend.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
          )}>
            {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
      </CardContent>
    </Card>
  );
}

// Storage Card
function StorageCard({ used, limit, percentage }: { used: number; limit: number; percentage: number }) {
  const status = percentage > 80 ? 'critical' : percentage > 60 ? 'warning' : 'healthy';
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <HardDrive className="h-4 w-4" />
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs',
              status === 'critical' && 'text-red-600 border-red-200 bg-red-50',
              status === 'warning' && 'text-amber-600 border-amber-200 bg-amber-50',
              status === 'healthy' && 'text-emerald-600 border-emerald-200 bg-emerald-50'
            )}
          >
            {status === 'critical' ? 'Critical' : status === 'warning' ? 'Warning' : 'Healthy'}
          </Badge>
        </div>
        <div className="text-2xl font-bold tracking-tight">{formatStorageSize(used)}</div>
        <p className="text-xs text-muted-foreground mt-0.5">of {formatStorageSize(limit)} used</p>
        <Progress 
          value={percentage} 
          className={cn(
            'h-1.5 mt-3',
            status === 'critical' && '[&>div]:bg-red-500',
            status === 'warning' && '[&>div]:bg-amber-500'
          )}
        />
      </CardContent>
    </Card>
  );
}

// Activity Row
function ActivityRow({ activity }: { activity: ActivityItem }) {
  const config = ACTIVITY_CONFIG[activity.type] || { icon: Activity, color: 'text-muted-foreground', bg: 'bg-muted' };
  const Icon = config.icon;
  
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
      <div className={cn('p-2 rounded-lg', config.bg)}>
        <Icon className={cn('h-4 w-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{activity.description}</p>
        <p className="text-xs text-muted-foreground">
          {activity.userName} • {timeAgo(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

// Quick Action Button
function QuickAction({ icon: Icon, label, color }: { icon: typeof Upload; label: string; color: 'blue' | 'emerald' | 'purple' | 'amber' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
  };

  return (
    <button className={cn(
      'flex flex-col items-center gap-2 p-4 rounded-xl transition-colors',
      colorClasses[color]
    )}>
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
