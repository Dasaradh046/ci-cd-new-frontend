/**
 * Permissions Matrix View Component
 * Clear visual separation with resource grouping and role-based toggle
 */

'use client';

import { useState, useMemo } from 'react';
import { 
  Shield, 
  Check, 
  X, 
  Edit3, 
  Save, 
  XCircle, 
  Lock, 
  Plus,
  Info,
  Users,
  Crown,
  UserCog,
  LayoutGrid,
  List,
  Folder,
  Key,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
import { useFetchWithFallback } from '@/lib/hooks';
import { getRoles } from '@/lib/api/rbac.service';
import { MockDataBadge } from '@/components/shared';
import type { Role, Permission } from '@/lib/models';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const RESOURCES = [
  { id: 'users', name: 'Users', icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-200', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
  { id: 'roles', name: 'Roles', icon: Crown, color: 'bg-purple-50 text-purple-600 border-purple-200', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
  { id: 'files', name: 'Files', icon: Folder, color: 'bg-amber-50 text-amber-600 border-amber-200', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
  { id: 'settings', name: 'Settings', icon: Key, color: 'bg-slate-50 text-slate-600 border-slate-200', actions: ['view', 'edit', 'manage'] },
  { id: 'dashboard', name: 'Dashboard', icon: LayoutGrid, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', actions: ['view'] },
];

const ACTION_LABELS: Record<string, string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  manage: 'Manage',
};

// Fallback roles if API fails completely
const FALLBACK_ROLES: Role[] = [
  { id: '1', name: 'SUPER_ADMIN', displayName: 'Super Admin', permissions: RESOURCES.flatMap(r => r.actions.map(a => ({ id: `${r.id}-${a}`, resource: r.id, action: a }))), userCount: 2 },
  { id: '2', name: 'ADMIN', displayName: 'Admin', permissions: [{ id: 'p1', resource: 'users', action: 'view' }, { id: 'p2', resource: 'users', action: 'create' }, { id: 'p3', resource: 'roles', action: 'view' }, { id: 'p4', resource: 'files', action: 'view' }, { id: 'p5', resource: 'files', action: 'create' }, { id: 'p6', resource: 'settings', action: 'view' }], userCount: 5 },
  { id: '3', name: 'MANAGER', displayName: 'Manager', permissions: [{ id: 'p10', resource: 'users', action: 'view' }, { id: 'p11', resource: 'files', action: 'view' }, { id: 'p12', resource: 'files', action: 'create' }], userCount: 12 },
  { id: '4', name: 'USER', displayName: 'User', permissions: [{ id: 'p16', resource: 'files', action: 'view' }, { id: 'p17', resource: 'dashboard', action: 'view' }], userCount: 156 },
];

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

function buildPermMap(roles: Role[]): Map<string, boolean> {
  const map = new Map<string, boolean>();
  roles.forEach(r => r.permissions?.forEach(p => map.set(`${r.id}:${p.resource}:${p.action}`, true)));
  return map;
}

export function PermissionsView() {
  const { toast } = useToast();
  const { data, isLoading, isMock } = useFetchWithFallback(() => getRoles());
  
  // Extract roles from paginated response or use fallback
  const roles = useMemo(() => {
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    return FALLBACK_ROLES;
  }, [data]);

  const [editMode, setEditMode] = useState(false);
  const [changes, setChanges] = useState<Map<string, boolean>>(new Map());
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({ resource: '', action: '', roleId: '' });
  const [viewMode, setViewMode] = useState<'resource' | 'role'>('resource');

  const original = useMemo(() => buildPermMap(roles), [roles]);

  const getPerm = (rid: string, res: string, act: string) => 
    changes.has(`${rid}:${res}:${act}`) ? changes.get(`${rid}:${res}:${act}`)! : original.get(`${rid}:${res}:${act}`) || false;
  
  const isChanged = (rid: string, res: string, act: string) => 
    changes.has(`${rid}:${res}:${act}`) && changes.get(`${rid}:${res}:${act}`) !== original.get(`${rid}:${res}:${act}`);

  const toggle = (rid: string, res: string, act: string) => {
    if (!editMode) return;
    const key = `${rid}:${res}:${act}`;
    const curr = changes.has(key) ? changes.get(key)! : original.get(key) || false;
    setChanges(new Map(changes).set(key, !curr));
  };

  const changedCount = useMemo(() => 
    Array.from(changes.entries()).filter(([k, v]) => v !== original.get(k)).length, 
    [changes, original]
  );
  
  const totalPerms = roles.length * RESOURCES.reduce((s, r) => s + r.actions.length, 0);
  const granted = original.size;

  const save = () => { 
    toast({ title: 'Permissions saved', description: `${changedCount} changes applied` }); 
    setEditMode(false); 
    setChanges(new Map()); 
  };
  
  const cancel = () => { 
    setEditMode(false); 
    setChanges(new Map()); 
  };

  const handleCreatePermission = () => {
    if (!newPermission.resource || !newPermission.action || !newPermission.roleId) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }
    const selectedRole = roles.find(r => r.id === newPermission.roleId);
    toast({ title: 'Permission created', description: `Added ${newPermission.action} permission for ${newPermission.resource} to ${selectedRole?.displayName}` });
    setCreateSheetOpen(false);
    setNewPermission({ resource: '', action: '', roleId: '' });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Permission Matrix</h1>
          <p className="text-sm text-muted-foreground">Configure role permissions across resources</p>
        </div>
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <Button variant="outline" size="sm" onClick={cancel}>
                <XCircle className="h-3.5 w-3.5 mr-1.5" />Cancel
              </Button>
              <Button size="sm" onClick={save} disabled={changedCount === 0}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save{changedCount > 0 && ` (${changedCount})`}
              </Button>
            </>
          ) : (
            <>
              {isMock && <MockDataBadge isMock={isMock} />}
              <Button variant="outline" size="sm" onClick={() => setCreateSheetOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />Add Permission
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                <Edit3 className="h-3.5 w-3.5 mr-1.5" />Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 text-sm border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-muted">
            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="font-medium">{roles.length}</span>
          <span className="text-muted-foreground">roles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-emerald-50">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <span className="font-medium">{granted}</span>
          <span className="text-muted-foreground">granted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-muted">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="font-medium">{totalPerms > 0 ? Math.round((granted / totalPerms) * 100) : 0}%</span>
          <span className="text-muted-foreground">coverage</span>
        </div>
        
        {/* View Toggle */}
        <div className="ml-auto">
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'resource' | 'role')} size="sm">
            <ToggleGroupItem value="resource" className="text-xs px-3">
              <List className="h-3.5 w-3.5 mr-1.5" />
              By Resource
            </ToggleGroupItem>
            <ToggleGroupItem value="role" className="text-xs px-3">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              By Role
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Edit Mode Notice */}
      {editMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 flex items-center gap-2 text-sm text-blue-700">
          <Info className="h-4 w-4 shrink-0" />
          <span>Click cells to toggle permissions. Changed cells will be highlighted.</span>
        </div>
      )}

      {/* View by Resource */}
      {viewMode === 'resource' && (
        <div className="space-y-4">
          {RESOURCES.map((resource) => {
            const IconComponent = resource.icon;
            const resourcePerms = roles.flatMap(r => 
              r.permissions?.filter(p => p.resource === resource.id) || []
            );
            
            return (
              <Card key={resource.id} className="overflow-hidden">
                {/* Resource Header */}
                <CardHeader className={cn('py-3 px-4 border-b', resource.color.split(' ')[0])}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={cn('h-4 w-4', resource.color.split(' ')[1])} />
                      <CardTitle className="text-sm font-medium">{resource.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className={cn('text-xs', resource.color.split(' ')[2])}>
                      {resourcePerms.length} permissions granted
                    </Badge>
                  </div>
                </CardHeader>
                
                {/* Permissions Table */}
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground w-24">Action</th>
                        {roles.map((r: Role) => {
                          const style = getRoleStyle(r.name);
                          return (
                            <th key={r.id} className="text-center px-3 py-2 font-medium min-w-[100px]">
                              <div className="flex items-center justify-center gap-1.5">
                                <div className={cn('p-1 rounded', style.bg)}>
                                  <style.icon className={cn('h-3 w-3', style.color)} />
                                </div>
                                <span className="text-xs">{r.displayName || r.name}</span>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {resource.actions.map((act, actIndex) => (
                        <tr 
                          key={act}
                          className={cn(
                            'hover:bg-muted/20 transition-colors',
                            editMode && 'cursor-pointer'
                          )}
                        >
                          <td className="px-4 py-2 border-t">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {act}
                            </code>
                          </td>
                          {roles.map((r: Role) => {
                            const has = getPerm(r.id, resource.id, act);
                            const changed = isChanged(r.id, resource.id, act);
                            
                            return (
                              <td 
                                key={r.id}
                                className={cn(
                                  'text-center px-2 py-2 border-t',
                                  changed && 'bg-amber-50',
                                  editMode && 'cursor-pointer hover:bg-blue-50'
                                )}
                                onClick={() => toggle(r.id, resource.id, act)}
                              >
                                <div 
                                  className={cn(
                                    'w-7 h-7 rounded mx-auto flex items-center justify-center transition-colors',
                                    has 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-muted/50 text-muted-foreground',
                                    changed && 'ring-2 ring-amber-400',
                                    editMode && 'hover:ring-1 hover:ring-primary/30'
                                  )}
                                >
                                  {has ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <X className="h-3.5 w-3.5" />
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View by Role */}
      {viewMode === 'role' && (
        <div className="space-y-4">
          {roles.map((role: Role) => {
            const style = getRoleStyle(role.name);
            const IconComponent = style.icon;
            const permCount = role.permissions?.length || 0;
            
            // Group permissions by resource
            const permsByResource: Record<string, string[]> = {};
            role.permissions?.forEach(p => {
              if (!permsByResource[p.resource]) permsByResource[p.resource] = [];
              permsByResource[p.resource].push(p.action);
            });
            
            return (
              <Card key={role.id} className="overflow-hidden">
                {/* Role Header */}
                <CardHeader className={cn('py-3 px-4 border-b', style.bg)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('p-1.5 rounded bg-white/50')}>
                        <IconComponent className={cn('h-4 w-4', style.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">{role.displayName || role.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{role.userCount || 0} users</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn('text-xs', style.border)}>
                      {permCount} permissions
                    </Badge>
                  </div>
                </CardHeader>
                
                {/* Permissions Grid */}
                <CardContent className="py-3 px-4">
                  {Object.keys(permsByResource).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {RESOURCES.map((resource) => {
                        const actions = permsByResource[resource.id] || [];
                        if (actions.length === 0) return null;
                        
                        const ResourceIcon = resource.icon;
                        return (
                          <div 
                            key={resource.id}
                            className={cn(
                              'p-2.5 rounded-lg border',
                              resource.color.split(' ')[0],
                              resource.color.split(' ')[2]
                            )}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <ResourceIcon className={cn('h-3.5 w-3.5', resource.color.split(' ')[1])} />
                              <span className="text-xs font-medium">{resource.name}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {actions.map(act => (
                                <Badge key={act} variant="secondary" className="text-[10px] h-4 px-1">
                                  {act}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No permissions assigned</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
          <span>Granted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-muted flex items-center justify-center">
            <X className="h-2.5 w-2.5" />
          </div>
          <span>Denied</span>
        </div>
        {editMode && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-amber-50 ring-2 ring-amber-400 flex items-center justify-center">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <span>Changed</span>
          </div>
        )}
      </div>

      {/* Create Permission Sheet */}
      <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-5 py-4 border-b shrink-0">
            <SheetTitle>Add Permission</SheetTitle>
            <SheetDescription>Grant a new permission to a role</SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select 
                  value={newPermission.roleId} 
                  onValueChange={(v) => setNewPermission({ ...newPermission, roleId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.length > 0 ? (
                      roles.map((r: Role) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.displayName || r.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_none" disabled>No roles available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label>Resource</Label>
                <Select 
                  value={newPermission.resource} 
                  onValueChange={(v) => setNewPermission({ ...newPermission, resource: v, action: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCES.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label>Action</Label>
                <Select 
                  value={newPermission.action} 
                  onValueChange={(v) => setNewPermission({ ...newPermission, action: v })}
                  disabled={!newPermission.resource}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {newPermission.resource && RESOURCES
                      .find(r => r.id === newPermission.resource)
                      ?.actions.map((a) => (
                        <SelectItem key={a} value={a}>
                          {ACTION_LABELS[a] || a}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Preview */}
            {newPermission.roleId && newPermission.resource && newPermission.action && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">
                    {roles.find(r => r.id === newPermission.roleId)?.displayName || roles.find(r => r.id === newPermission.roleId)?.name}
                  </Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="secondary">
                    {RESOURCES.find(r => r.id === newPermission.resource)?.name}
                  </Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge>
                    {ACTION_LABELS[newPermission.action]}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          
          <SheetFooter className="px-5 py-4 border-t shrink-0 flex-row gap-3">
            <Button variant="outline" onClick={() => setCreateSheetOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreatePermission} className="flex-1">
              Add Permission
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
