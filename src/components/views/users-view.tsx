/**
 * Users Management View Component
 * Enterprise SaaS Design - With List/Card View Toggle
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Users,
  Crown,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Ban,
  Mail,
  UserCheck,
  Shield,
  LayoutList,
  LayoutGrid,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFetchWithFallback, useDebounce } from '@/lib/hooks';
import { getUsers } from '@/lib/api';
import { TableSkeleton, MockDataBadge } from '@/components/shared';
import type { User, UserStatus } from '@/lib/models';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock users data
const MOCK_USERS: User[] = [
  { id: '1', email: 'john.doe@example.com', name: 'John Doe', role: { id: '1', name: 'SUPER_ADMIN', displayName: 'Super Admin', permissions: [], createdAt: '' }, status: 'active', avatar: null, lastLoginAt: new Date().toISOString(), createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', email: 'jane.smith@example.com', name: 'Jane Smith', role: { id: '2', name: 'ADMIN', displayName: 'Admin', permissions: [], createdAt: '' }, status: 'active', avatar: null, lastLoginAt: new Date(Date.now() - 86400000).toISOString(), createdAt: '2024-01-15T00:00:00Z' },
  { id: '3', email: 'mike.wilson@example.com', name: 'Mike Wilson', role: { id: '3', name: 'MANAGER', displayName: 'Manager', permissions: [], createdAt: '' }, status: 'active', avatar: null, lastLoginAt: new Date(Date.now() - 172800000).toISOString(), createdAt: '2024-02-01T00:00:00Z' },
  { id: '4', email: 'sarah.jones@example.com', name: 'Sarah Jones', role: { id: '4', name: 'USER', displayName: 'User', permissions: [], createdAt: '' }, status: 'active', avatar: null, lastLoginAt: new Date(Date.now() - 259200000).toISOString(), createdAt: '2024-02-15T00:00:00Z' },
  { id: '5', email: 'alex.brown@example.com', name: 'Alex Brown', role: { id: '4', name: 'USER', displayName: 'User', permissions: [], createdAt: '' }, status: 'suspended', avatar: null, lastLoginAt: null, createdAt: '2024-03-01T00:00:00Z' },
  { id: '6', email: 'emily.davis@example.com', name: 'Emily Davis', role: { id: '3', name: 'MANAGER', displayName: 'Manager', permissions: [], createdAt: '' }, status: 'pending_verification', avatar: null, lastLoginAt: null, createdAt: '2024-03-10T00:00:00Z' },
  { id: '7', email: 'chris.taylor@example.com', name: 'Chris Taylor', role: { id: '4', name: 'USER', displayName: 'User', permissions: [], createdAt: '' }, status: 'active', avatar: null, lastLoginAt: new Date(Date.now() - 3600000).toISOString(), createdAt: '2024-03-15T00:00:00Z' },
  { id: '8', email: 'lisa.anderson@example.com', name: 'Lisa Anderson', role: { id: '5', name: 'GUEST', displayName: 'Guest', permissions: [], createdAt: '' }, status: 'active', avatar: null, lastLoginAt: new Date(Date.now() - 7200000).toISOString(), createdAt: '2024-03-20T00:00:00Z' },
];

const STATUS_CONFIG: Record<UserStatus, { label: string; icon: typeof CheckCircle; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', icon: CheckCircle, variant: 'default' },
  suspended: { label: 'Suspended', icon: Ban, variant: 'destructive' },
  pending_verification: { label: 'Pending', icon: Clock, variant: 'secondary' },
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-warning/10 text-warning border-warning/20',
  ADMIN: 'bg-primary/10 text-primary border-primary/20',
  MANAGER: 'bg-info/10 text-info border-info/20',
  USER: 'bg-muted text-muted-foreground border-border',
  GUEST: 'bg-muted/50 text-muted-foreground border-border',
};

type ViewMode = 'list' | 'card';

export function UsersView() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, isMock } = useFetchWithFallback(
    () => getUsers(1, 20, { search: debouncedSearch }),
    MOCK_USERS
  );

  const users = data?.data || [];

  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch = !debouncedSearch || 
        user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role.name === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, debouncedSearch, statusFilter, roleFilter]);

  const uniqueRoles = useMemo(() => {
    const roles = new Map<string, string>();
    users.forEach((u: User) => roles.set(u.role.name, u.role.displayName || u.role.name));
    return Array.from(roles.entries());
  }, [users]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u: User) => u.status === 'active').length,
    suspended: users.filter((u: User) => u.status === 'suspended').length,
    pending: users.filter((u: User) => u.status === 'pending_verification').length,
  }), [users]);

  const openEditSheet = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user);
    setSheetOpen(true);
  };

  const openCreateSheet = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setSheetOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    toast({ title: 'Status updated', description: `${user.name} has been ${newStatus === 'active' ? 'activated' : 'suspended'}` });
  };

  const handleDelete = () => {
    toast({ title: 'User deleted', description: `${userToDelete?.name} has been removed` });
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSaveUser = () => {
    toast({ title: isEditing ? 'User updated' : 'User created', description: 'Changes saved successfully' });
    setSheetOpen(false);
  };

  const timeAgo = (date: string | null) => {
    if (!date) return 'Never';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) return <TableSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          {isMock && <MockDataBadge isMock={isMock} />}
          <Button onClick={openCreateSheet}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Users" value={stats.total} icon={Users} />
        <StatsCard label="Active" value={stats.active} icon={CheckCircle} color="success" />
        <StatsCard label="Pending" value={stats.pending} icon={Clock} color="warning" />
        <StatsCard label="Suspended" value={stats.suspended} icon={Ban} color="destructive" />
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as UserStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending_verification">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map(([name, displayName]) => (
              <SelectItem key={name} value={name}>{displayName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)} className="border rounded-lg p-1">
          <ToggleGroupItem value="list" aria-label="List view" className="px-3">
            <LayoutList className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="card" aria-label="Card view" className="px-3">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Users Display */}
      {filteredUsers.length > 0 ? (
        viewMode === 'list' ? (
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[600px]">
                <div className="divide-y">
                  {filteredUsers.map((user: User) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                      onEdit={openEditSheet}
                      onToggleStatus={handleToggleStatus}
                      onDelete={(u) => { setUserToDelete(u); setDeleteDialogOpen(true); }}
                      timeAgo={timeAgo}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user: User) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={openEditSheet}
                onToggleStatus={handleToggleStatus}
                onDelete={(u) => { setUserToDelete(u); setDeleteDialogOpen(true); }}
                timeAgo={timeAgo}
              />
            ))}
          </div>
        )
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No users found</p>
            <Button onClick={openCreateSheet} className="mt-4"><Plus className="h-4 w-4 mr-2" />Add User</Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b shrink-0">
            <SheetTitle>{isEditing ? 'Edit User' : 'Create User'}</SheetTitle>
            <SheetDescription>{isEditing ? 'Update user information' : 'Add a new user to the system'}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Avatar Preview */}
            {isEditing && selectedUser && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className={cn('text-base font-medium', ROLE_COLORS[selectedUser.role.name])}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" defaultValue={selectedUser?.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email address" defaultValue={selectedUser?.email} disabled={isEditing} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={selectedUser?.role.name}>
                  <SelectTrigger id="role"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {uniqueRoles.map(([name, displayName]) => (
                      <SelectItem key={name} value={name}>{displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isEditing && (
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedUser?.status}>
                    <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending_verification">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <SheetFooter className="px-6 py-4 border-t shrink-0 flex-row gap-3">
            <Button variant="outline" onClick={() => setSheetOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSaveUser} className="flex-1">{isEditing ? 'Save Changes' : 'Create User'}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete &quot;{userToDelete?.name}&quot;? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// List Item Component
function UserListItem({ 
  user, 
  onEdit, 
  onToggleStatus, 
  onDelete,
  timeAgo 
}: { 
  user: User; 
  onEdit: (u: User) => void;
  onToggleStatus: (u: User) => void;
  onDelete: (u: User) => void;
  timeAgo: (d: string | null) => string;
}) {
  const statusConfig = STATUS_CONFIG[user.status];
  const roleColor = ROLE_COLORS[user.role.name] || 'bg-muted';
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className={cn('text-sm font-medium border', roleColor)}>
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{user.name}</span>
          {user.role.name === 'SUPER_ADMIN' && <Crown className="h-4 w-4 text-warning" />}
          <Badge variant={statusConfig.variant} className="text-xs">
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{user.role.displayName}</span>
        </div>
        <span className="text-muted-foreground w-16">{timeAgo(user.lastLoginAt)}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(user)}>
          <Edit3 className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onToggleStatus(user)}>
              {user.status === 'active' ? <><Ban className="h-4 w-4 mr-2" />Suspend</> : <><UserCheck className="h-4 w-4 mr-2" />Activate</>}
            </DropdownMenuItem>
            <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Send Email</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(user)}>
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Card Component
function UserCard({ 
  user, 
  onEdit, 
  onToggleStatus, 
  onDelete,
  timeAgo 
}: { 
  user: User; 
  onEdit: (u: User) => void;
  onToggleStatus: (u: User) => void;
  onDelete: (u: User) => void;
  timeAgo: (d: string | null) => string;
}) {
  const statusConfig = STATUS_CONFIG[user.status];
  const roleColor = ROLE_COLORS[user.role.name] || 'bg-muted';
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className={cn('h-2', user.role.name === 'SUPER_ADMIN' ? 'bg-gradient-to-r from-warning to-warning/60' : user.role.name === 'ADMIN' ? 'bg-gradient-to-r from-primary to-primary/60' : 'bg-gradient-to-r from-muted to-muted/60')} />
        
        <div className="p-4 space-y-4">
          {/* User Info */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className={cn('text-base font-medium border', roleColor)}>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{user.name}</span>
                {user.role.name === 'SUPER_ADMIN' && <Crown className="h-4 w-4 text-warning shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn('text-xs', roleColor)}>
              {user.role.displayName}
            </Badge>
            <Badge variant={statusConfig.variant} className="text-xs">
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">Last login: {timeAgo(user.lastLoginAt)}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(user)}>
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                    {user.status === 'active' ? <><Ban className="h-4 w-4 mr-2" />Suspend</> : <><UserCheck className="h-4 w-4 mr-2" />Activate</>}
                  </DropdownMenuItem>
                  <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Send Email</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(user)}>
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({ label, value, icon: Icon, color = 'primary' }: { label: string; value: number; icon: typeof Users; color?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2.5 rounded-lg', 
            color === 'success' ? 'bg-success/10' : 
            color === 'warning' ? 'bg-warning/10' : 
            color === 'destructive' ? 'bg-destructive/10' : 
            'bg-muted'
          )}>
            <Icon className={cn(
              'h-4 w-4', 
              color === 'success' ? 'text-success' : 
              color === 'warning' ? 'text-warning' : 
              color === 'destructive' ? 'text-destructive' : 
              'text-muted-foreground'
            )} />
          </div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
