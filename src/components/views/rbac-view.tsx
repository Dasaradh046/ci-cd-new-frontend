/**
 * RBAC Management View Component
 * Simple, clean list-based design
 */

'use client';

import { useState, useMemo } from 'react';
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  Users,
  Crown,
  UserCog,
  Search,
  Copy,
  MoreHorizontal,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useFetchWithFallback } from '@/lib/hooks';
import { getRoles } from '@/lib/api';
import { TableSkeleton, MockDataBadge } from '@/components/shared';
import type { Role, Permission } from '@/lib/models';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const PERMISSION_RESOURCES = [
  { id: 'users', name: 'Users', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
  { id: 'roles', name: 'Roles', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
  { id: 'permissions', name: 'Permissions', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
  { id: 'files', name: 'Files', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
  { id: 'notifications', name: 'Notifications', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'settings', name: 'Settings', actions: ['view', 'edit', 'manage'] },
  { id: 'dashboard', name: 'Dashboard', actions: ['view'] },
  { id: 'docs', name: 'Documentation', actions: ['view'] },
];

const TOTAL_PERMISSIONS = PERMISSION_RESOURCES.reduce((sum, r) => sum + r.actions.length, 0);

const MOCK_ROLES: Role[] = [
  { id: '1', name: 'SUPER_ADMIN', displayName: 'Super Admin', description: 'Full system access', permissions: PERMISSION_RESOURCES.flatMap(r => r.actions.map(a => ({ id: `${r.id}-${a}`, resource: r.id, action: a }))), userCount: 2, isSystem: true },
  { id: '2', name: 'ADMIN', displayName: 'Admin', description: 'Administrative access', permissions: [{ id: 'p1', resource: 'users', action: 'view' }, { id: 'p2', resource: 'users', action: 'create' }, { id: 'p3', resource: 'users', action: 'edit' }, { id: 'p4', resource: 'roles', action: 'view' }, { id: 'p5', resource: 'files', action: 'view' }, { id: 'p6', resource: 'files', action: 'create' }], userCount: 5, isSystem: true },
  { id: '3', name: 'MANAGER', displayName: 'Manager', description: 'Team management', permissions: [{ id: 'p10', resource: 'users', action: 'view' }, { id: 'p11', resource: 'files', action: 'view' }, { id: 'p12', resource: 'files', action: 'create' }], userCount: 12, isSystem: false },
  { id: '4', name: 'USER', displayName: 'User', description: 'Basic access', permissions: [{ id: 'p16', resource: 'files', action: 'view' }, { id: 'p17', resource: 'dashboard', action: 'view' }], userCount: 156, isSystem: true },
  { id: '5', name: 'GUEST', displayName: 'Guest', description: 'Read-only access', permissions: [{ id: 'p19', resource: 'files', action: 'view' }, { id: 'p20', resource: 'docs', action: 'view' }], userCount: 45, isSystem: false },
];

type PermissionState = Record<string, Record<string, boolean>>;

function initPermissionState(permissions?: Permission[]): PermissionState {
  const state: PermissionState = {};
  PERMISSION_RESOURCES.forEach(r => { state[r.id] = {}; r.actions.forEach(a => { state[r.id][a] = false; }); });
  permissions?.forEach(p => { if (state[p.resource]) state[p.resource][p.action] = true; });
  return state;
}

function countPermissions(state: PermissionState): number {
  return Object.values(state).reduce((sum, actions) => sum + Object.values(actions).filter(Boolean).length, 0);
}

// Role styling
function getRoleStyle(roleName: string) {
  switch (roleName) {
    case 'SUPER_ADMIN':
      return { icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'ADMIN':
      return { icon: UserCog, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'MANAGER':
      return { icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    default:
      return { icon: Shield, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
  }
}

export function RbacView() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', displayName: '', description: '' });
  const [permissionState, setPermissionState] = useState<PermissionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const { data, isLoading, isMock } = useFetchWithFallback(() => getRoles());
  const roles = useMemo(() => {
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    return MOCK_ROLES;
  }, [data]);

  const filteredRoles = roles.filter((role: Role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = { 
    total: roles.length, 
    users: roles.reduce((s: number, r: Role) => s + (r.userCount || 0), 0) 
  };

  const openCreateSheet = () => {
    setIsEditing(false);
    setEditingRole(null);
    setFormData({ name: '', displayName: '', description: '' });
    setPermissionState(initPermissionState());
    setSheetOpen(true);
  };

  const openEditSheet = (role: Role) => {
    setIsEditing(true);
    setEditingRole(role);
    setFormData({ name: role.name, displayName: role.displayName || '', description: role.description || '' });
    setPermissionState(initPermissionState(role.permissions));
    setSheetOpen(true);
  };

  const togglePerm = (resource: string, action: string) => {
    setPermissionState(prev => ({ ...prev, [resource]: { ...prev[resource], [action]: !prev[resource]?.[action] } }));
  };

  const toggleAll = (resourceId: string, value: boolean) => {
    const resource = PERMISSION_RESOURCES.find(r => r.id === resourceId);
    if (!resource) return;
    setPermissionState(prev => ({ ...prev, [resourceId]: Object.fromEntries(resource.actions.map(a => [a, value])) }));
  };

  const handleSave = () => {
    toast({ title: isEditing ? 'Role updated' : 'Role created' });
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (roleToDelete?.isSystem) { toast({ title: 'Cannot delete system roles', variant: 'destructive' }); return; }
    toast({ title: 'Role deleted' });
    setDeleteDialogOpen(false);
  };

  const handleDuplicate = (role: Role) => {
    setIsEditing(false);
    setFormData({ name: `${role.name}_COPY`, displayName: `${role.displayName} (Copy)`, description: role.description || '' });
    setPermissionState(initPermissionState(role.permissions));
    setSheetOpen(true);
  };

  if (isLoading) return <TableSkeleton rows={5} />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Roles</h1>
          <p className="text-sm text-muted-foreground">{stats.total} roles · {stats.users} users</p>
        </div>
        <div className="flex items-center gap-2">
          {isMock && <MockDataBadge isMock={isMock} />}
          <Button size="sm" onClick={openCreateSheet}>
            <Plus className="h-4 w-4 mr-1.5" />New Role
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search roles..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="pl-9 h-9" 
        />
      </div>

      {/* Roles List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role: Role) => {
                const style = getRoleStyle(role.name);
                const IconComponent = style.icon;
                const permCount = role.permissions?.length || 0;
                
                return (
                  <div 
                    key={role.id} 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    {/* Role Icon */}
                    <div className={cn('p-2 rounded-md shrink-0', style.bg)}>
                      <IconComponent className={cn('h-4 w-4', style.color)} />
                    </div>
                    
                    {/* Role Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{role.displayName || role.name}</span>
                        {role.isSystem && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5">System</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{permCount} permissions</p>
                    </div>
                    
                    {/* Users Count */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{role.userCount || 0}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => openEditSheet(role)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditSheet(role)}>
                            <Edit3 className="h-4 w-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(role)}>
                            <Copy className="h-4 w-4 mr-2" />Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => { setRoleToDelete(role); setDeleteDialogOpen(true); }}
                            disabled={role.isSystem}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <Shield className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No roles found</p>
                <Button size="sm" onClick={openCreateSheet} className="mt-3">
                  <Plus className="h-4 w-4 mr-1.5" />Create Role
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          <SheetHeader className="px-5 py-4 border-b shrink-0">
            <SheetTitle>{isEditing ? 'Edit Role' : 'Create Role'}</SheetTitle>
            <SheetDescription>
              {isEditing ? 'Modify role details and permissions' : 'Define a new role with specific permissions'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Basic Info */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Info</Label>
              <div className="space-y-2.5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Role Name</Label>
                  <Input 
                    id="name"
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase().replace(/\s+/g, '_') })} 
                    placeholder="ROLE_NAME" 
                    disabled={editingRole?.isSystem}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName"
                    value={formData.displayName} 
                    onChange={e => setFormData({ ...formData, displayName: e.target.value })} 
                    placeholder="e.g., Content Editor" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Brief description..." 
                    rows={2} 
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t" />
            
            {/* Permissions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Permissions</Label>
                <Badge variant="secondary" className="text-xs">{countPermissions(permissionState)} selected</Badge>
              </div>
              
              <div className="space-y-1.5">
                {PERMISSION_RESOURCES.map(resource => {
                  const selectedCount = Object.values(permissionState[resource.id] || {}).filter(Boolean).length;
                  const isComplete = selectedCount === resource.actions.length;
                  
                  return (
                    <div key={resource.id} className="border rounded-md">
                      <div className="flex items-center justify-between px-3 py-2 bg-muted/30">
                        <span className="text-sm font-medium">{resource.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] h-4 px-1">
                            {selectedCount}/{resource.actions.length}
                          </Badge>
                          <button
                            className="text-[10px] text-primary hover:underline"
                            onClick={() => toggleAll(resource.id, !isComplete)}
                          >
                            {isComplete ? 'Clear' : 'All'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-2 flex flex-wrap gap-1">
                        {resource.actions.map(action => {
                          const isActive = permissionState[resource.id]?.[action];
                          return (
                            <button
                              key={action}
                              onClick={() => togglePerm(resource.id, action)}
                              className={cn(
                                'px-2 py-0.5 text-xs rounded border transition-colors',
                                isActive 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'bg-background hover:bg-muted border-border'
                              )}
                            >
                              {action}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <SheetFooter className="px-5 py-4 border-t shrink-0 flex-row gap-3">
            <Button variant="outline" onClick={() => setSheetOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1">
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Delete &quot;{roleToDelete?.displayName}&quot;? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
