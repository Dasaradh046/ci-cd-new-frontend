# RBAC Design Document

## Overview

The Role-Based Access Control (RBAC) system provides granular access control through a flexible role-permission model. This document describes the design, implementation, and usage of the RBAC system.

## Role Hierarchy

```
┌─────────────────┐
│   SUPER_ADMIN   │ Level 5 - Full system access
└────────┬────────┘
         │
┌────────▼────────┐
│      ADMIN      │ Level 4 - Administrative access
└────────┬────────┘
         │
┌────────▼────────┐
│     MANAGER     │ Level 3 - Team management
└────────┬────────┘
         │
┌────────▼────────┐
│      USER       │ Level 2 - Standard access
└────────┬────────┘
         │
┌────────▼────────┐
│      GUEST      │ Level 1 - Limited access
└─────────────────┘
```

## Role Definitions

### SUPER_ADMIN
**Level**: 5
**Description**: Full system access including RBAC management

**Permissions**:
- All system permissions
- RBAC management (roles, permissions)
- System configuration
- Audit log access
- Security settings

### ADMIN
**Level**: 4
**Description**: Administrative access to user management

**Permissions**:
- `users.view`, `users.create`, `users.update`, `users.delete`
- `roles.view`, `roles.manage`
- `files.*`
- `settings.view`, `settings.update`

### MANAGER
**Level**: 3
**Description**: Team management capabilities

**Permissions**:
- `users.view`, `users.update` (team members only)
- `files.*`
- `reports.view`

### USER
**Level**: 2
**Description**: Standard authenticated user

**Permissions**:
- `profile.view`, `profile.update` (own)
- `files.upload`, `files.read`, `files.delete` (own)
- `notifications.read`

### GUEST
**Level**: 1
**Description**: Limited read-only access

**Permissions**:
- `content.view` (public only)
- `profile.view` (own)

## Permission Structure

### Naming Convention
```
resource.action
```

### Resources
| Resource | Description |
|----------|-------------|
| `users` | User management |
| `roles` | Role definitions |
| `permissions` | Permission assignments |
| `files` | File management |
| `settings` | System settings |
| `profile` | User profile |
| `notifications` | User notifications |
| `audit` | Audit logs |

### Actions
| Action | Description |
|--------|-------------|
| `view` | Read access |
| `create` | Create new records |
| `update` | Modify existing records |
| `delete` | Remove records |
| `manage` | Full control |

## Database Schema

```sql
-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(resource, action)
);

-- Role-Permission junction table
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- User-Role junction table
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id),
    role_id UUID REFERENCES roles(id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);
```

## TypeScript Interfaces

```typescript
interface Permission {
  id: string;
  resource: string;
  action: string;
}

interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST';
```

## Implementation

### Client-Side Checks

```typescript
// Permission check hook
export const useHasPermission = (resource: string, action: string): boolean => {
  const user = useAuthStore((state) => state.user);
  if (!user?.role?.permissions) return false;
  return user.role.permissions.some(
    (p) => p.resource === resource && p.action === action
  );
};

// Role check hook
export const useHasRole = (roles: UserRole | UserRole[]): boolean => {
  const user = useAuthStore((state) => state.user);
  if (!user?.role) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role.name);
};

// Admin check hook
export const useIsAdmin = (): boolean => {
  const user = useAuthStore((state) => state.user);
  if (!user?.role) return false;
  return ['SUPER_ADMIN', 'ADMIN'].includes(user.role.name);
};
```

### Component Usage

```tsx
// Conditional rendering based on permission
function FileActions({ file }) {
  const canDelete = useHasPermission('files', 'delete');
  
  return (
    <>
      {canDelete && <DeleteButton file={file} />}
    </>
  );
}

// Route protection with AdminGuard
function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}
```

### Server-Side Validation

```typescript
// API route protection
export async function protectedApiHandler(
  req: Request,
  requiredPermission: string
) {
  const user = await getCurrentUser(req);
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  if (!hasPermission(user, requiredPermission)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Proceed with handler
}
```

## Best Practices

### 1. Principle of Least Privilege
- Start with minimum permissions
- Add permissions as needed
- Regular permission audits

### 2. Defense in Depth
- Client-side checks for UX
- Server-side checks for security
- Database constraints for data integrity

### 3. Audit Trail
- Log all permission changes
- Track role assignments
- Monitor access patterns

### 4. Regular Reviews
- Quarterly permission audits
- Remove unused permissions
- Update role definitions

## Admin Interface

### User Management
- List users with role filters
- Edit user roles
- Bulk role assignment
- Access history

### Role Management
- Create custom roles
- Edit permissions per role
- Role templates
- Inheritance rules

### Permission Matrix
- Grid view of all permissions
- Toggle permissions per role
- Bulk operations
- Export/Import

---

For implementation details, see the source code in `lib/stores/auth.store.ts` and `components/auth/`.
