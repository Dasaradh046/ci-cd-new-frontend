# System Architecture

## Overview

The DevSecOps Platform follows a modern, scalable architecture designed with security-first principles. The system is built on Next.js 16 with App Router, providing server-side rendering, API routes, and optimal performance.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Browser   │  │   Mobile    │  │    API      │              │
│  │             │  │   Browser   │  │  Clients    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APPLICATION                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    APP ROUTER                             │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────────┐ │   │
│  │  │  Public   │  │ Protected │  │        API            │ │   │
│  │  │  Routes   │  │  Routes   │  │       Routes          │ │   │
│  │  └───────────┘  └───────────┘  └───────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 COMPONENTS LAYER                          │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │   │
│  │  │   UI    │  │  Auth   │  │ Layout  │  │   Views     │  │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  STATE MANAGEMENT                         │   │
│  │  ┌─────────────────┐  ┌───────────────────────────────┐  │   │
│  │  │ Zustand Stores  │  │   React Query (Server State)  │  │   │
│  │  └─────────────────┘  └───────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND SERVICES                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   FastAPI   │  │  PostgreSQL │  │    Redis    │              │
│  │   Backend   │  │  Database   │  │    Cache    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── forgot-password/      # Password reset request
│   │   ├── reset-password/       # Password reset form
│   │   ├── verify-email/         # Email verification
│   │   └── resend-email/         # Resend verification
│   ├── (protected)/              # Protected route group
│   │   ├── dashboard/            # Dashboard page
│   │   ├── profile/              # User profile
│   │   ├── settings/             # User settings
│   │   ├── notifications/        # Notifications
│   │   ├── files/                # File management
│   │   ├── docs/                 # Documentation
│   │   └── admin/                # Admin routes
│   │       ├── users/            # User management
│   │       ├── rbac/             # RBAC management
│   │       └── permissions/      # Permission matrix
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── auth/                     # Authentication components
│   ├── layout/                   # Layout components
│   ├── shared/                   # Shared components
│   ├── ui/                       # shadcn/ui components
│   └── views/                    # Page view components
├── lib/
│   ├── api/                      # API services
│   ├── auth/                     # Auth utilities
│   ├── hooks/                    # Custom hooks
│   ├── models/                   # TypeScript interfaces
│   └── stores/                   # Zustand stores
└── hooks/                        # Global hooks
```

## Route Groups

### Public Routes (`(public)`)
- No authentication required
- Minimal layout (no sidebar)
- Used for authentication flows

### Protected Routes (`(protected)`)
- Authentication required
- Full layout with sidebar
- Role-based access for admin routes

## Data Flow

### Authentication Flow
```
1. User submits credentials
2. Frontend calls /api/auth/login
3. Backend validates credentials
4. Backend generates JWT tokens (RS256)
5. Tokens set in HttpOnly cookies
6. User redirected to dashboard
```

### API Request Flow
```
1. Component calls API service
2. Service attempts backend call
3. On failure, falls back to mock data
4. Mock data badge shown if fallback used
5. Component renders response data
```

## Security Architecture

### Authentication Layers
1. **Client-Side Guards**: Quick UX checks
2. **Server-Side Validation**: Secure token verification
3. **API Middleware**: Request authentication

### Authorization Flow
```
Request → Auth Middleware → RBAC Check → Resource Access
              ↓                    ↓
         401 Response        403 Response
```

## Performance Optimizations

### Code Splitting
- Route-based splitting (automatic with App Router)
- Component-level lazy loading
- Dynamic imports for heavy components

### Caching Strategy
- Static assets: CDN cache
- API responses: React Query cache
- User data: Zustand persist

### Bundle Optimization
- Tree shaking enabled
- Image optimization with next/image
- Font optimization with next/font

## Deployment Architecture

### Container Structure
```dockerfile
FROM node:20-alpine AS runner
# Minimal production image
# Non-root user
# Health checks enabled
```

### Scaling Considerations
- Stateless application
- Session data in Redis
- Database connection pooling
- Horizontal scaling ready

---

For implementation details, see the source code documentation.
