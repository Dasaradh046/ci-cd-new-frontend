/**
 * Notifications View Component
 * Enterprise SaaS Design - Clean, Minimal, Professional
 */

'use client';

import { useState, useMemo } from 'react';
import { Bell, Check, CheckCheck, Info, AlertTriangle, AlertCircle, CheckCircle2, Trash2, Search, Filter, Clock, MoreHorizontal, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useFetchWithFallback, useDebounce } from '@/lib/hooks';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/lib/api';
import { TableSkeleton, MockDataBadge } from '@/components/shared';
import type { Notification } from '@/lib/models';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'unread' | 'read';
type NotificationType = 'all' | 'info' | 'success' | 'warning' | 'error';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Security Alert', message: 'New login detected from Chrome on Windows. If this wasn\'t you, please secure your account.', type: 'warning', read: false, createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: '2', title: 'Deployment Successful', message: 'Production deployment v2.4.1 completed successfully.', type: 'success', read: false, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: '3', title: 'New Comment', message: 'Sarah commented on your pull request.', type: 'info', read: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '4', title: 'Build Failed', message: 'CI/CD pipeline failed for branch feature/auth.', type: 'error', read: false, createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: '5', title: 'System Update', message: 'Scheduled maintenance completed. System updated to version 3.2.0.', type: 'info', read: true, createdAt: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: '6', title: 'Storage Warning', message: 'Your storage usage is at 85%.', type: 'warning', read: true, createdAt: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: '7', title: 'Team Invitation', message: 'You\'ve been invited to join the Engineering team.', type: 'info', read: true, createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: '8', title: 'Backup Completed', message: 'Weekly backup completed successfully.', type: 'success', read: true, createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
];

const TYPE_CONFIG: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  error: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
};

export function NotificationsView() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data, isLoading, isMock, refetch } = useFetchWithFallback(() => getNotifications(1, 50), [filter]);
  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const filtered = useMemo(() => {
    let result = notifications.length > 0 ? notifications : MOCK_NOTIFICATIONS;
    if (filter === 'unread') result = result.filter((n: Notification) => !n.read);
    else if (filter === 'read') result = result.filter((n: Notification) => n.read);
    if (typeFilter !== 'all') result = result.filter((n: Notification) => n.type === typeFilter);
    if (debouncedSearch) result = result.filter((n: Notification) => n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || n.message.toLowerCase().includes(debouncedSearch.toLowerCase()));
    return result;
  }, [notifications, filter, typeFilter, debouncedSearch]);

  const handleMarkAsRead = async (id: string) => { await markAsRead(id); refetch(); toast({ title: 'Marked as read' }); };
  const handleMarkAllRead = async () => { await markAllAsRead(); refetch(); toast({ title: 'All marked as read' }); };
  const handleDelete = async () => {
    if (!notificationToDelete) { return; }
    await deleteNotification(notificationToDelete);
    refetch();
    toast({ title: 'Deleted' });
    setDeleteDialogOpen(false);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) { s.delete(id); } else { s.add(id); }
      return s;
    });
  };
  const toggleSelectAll = () => {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((n: Notification) => n.id)));
  };

  const timeAgo = (date: string) => { const diff = Date.now() - new Date(date).getTime(); const mins = Math.floor(diff / 60000); const hours = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000); if (mins < 1) return 'Just now'; if (mins < 60) return `${mins}m ago`; if (hours < 24) return `${hours}h ago`; return `${days}d ago`; };

  if (isLoading) return <TableSkeleton rows={5} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-semibold tracking-tight">Notifications</h1><p className="text-muted-foreground mt-1">Stay updated with your activity</p></div>
        <div className="flex items-center gap-3">{unreadCount > 0 && <Button variant="outline" onClick={handleMarkAllRead}><CheckCheck className="h-4 w-4 mr-2" />Mark all read</Button>}{isMock && <MockDataBadge isMock={isMock} />}</div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" /></div>
        <Select value={typeFilter} onValueChange={v => setTypeFilter(v as NotificationType)}><SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="info">Info</SelectItem><SelectItem value="success">Success</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="error">Error</SelectItem></SelectContent></Select>
      </div>

      {/* Tabs */}
      <Tabs value={filter} onValueChange={v => setFilter(v as FilterType)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All{notifications.length > 0 && <Badge variant="secondary" className="ml-2 h-5 px-1.5">{notifications.length}</Badge>}</TabsTrigger>
          <TabsTrigger value="unread">Unread{unreadCount > 0 && <Badge className="ml-2 h-5 px-1.5">{unreadCount}</Badge>}</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2"><CheckCheck className="h-4 w-4 text-primary" /><span className="font-medium text-sm">{selected.size} selected</span></div>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="outline" size="sm" onClick={() => { selected.forEach(id => handleMarkAsRead(id)); setSelected(new Set()); }}><Check className="h-4 w-4 mr-2" />Mark read</Button>
          <Button variant="destructive" size="sm" onClick={() => {}}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
          <div className="flex-1" /><Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
        </div>
      )}

      {/* List */}
      {filtered.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 p-3 bg-muted/30 border-b">
            <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded border-muted-foreground/25" />
            <span className="text-sm text-muted-foreground">{filtered.length} notification{filtered.length !== 1 && 's'}</span>
          </div>
          <ScrollArea className="max-h-[500px]">
            <div className="divide-y">
              {filtered.map((n: Notification) => {
                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
                const Icon = config.icon;
                const isSelected = selected.has(n.id);
                return (
                  <div key={n.id} className={cn('group flex items-start gap-3 p-4 transition-colors hover:bg-muted/50', !n.read && 'bg-muted/20', isSelected && 'bg-primary/5 ring-1 ring-primary/20')}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(n.id)} onClick={e => e.stopPropagation()} className="mt-1 h-4 w-4 rounded border-muted-foreground/25" />
                    <div className={cn('flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center', config.bg)}><Icon className={cn('h-4 w-4', config.color)} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2"><h3 className={cn('text-sm', !n.read && 'font-medium')}>{n.title}</h3>{!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}</div>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                          <div className="flex items-center gap-2 mt-1.5"><Clock className="h-3 w-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span><Badge variant="outline" className="text-xs capitalize">{n.type}</Badge></div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMarkAsRead(n.id)} title="Mark as read"><Check className="h-4 w-4" /></Button>}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">{!n.read && <DropdownMenuItem onClick={() => handleMarkAsRead(n.id)}><Check className="h-4 w-4 mr-2" />Mark as read</DropdownMenuItem>}<DropdownMenuItem className="text-destructive" onClick={() => { setNotificationToDelete(n.id); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem></DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      ) : (
        <Card><CardContent className="py-16 text-center"><Bell className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" /><p className="text-muted-foreground">{searchQuery ? 'No matching notifications' : filter === 'unread' ? 'All caught up!' : 'No notifications'}</p>{filter === 'unread' && !searchQuery && <Button variant="link" className="mt-2" onClick={() => setFilter('all')}>View all notifications</Button>}</CardContent></Card>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Notification</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
