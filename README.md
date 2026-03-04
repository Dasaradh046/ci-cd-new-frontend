# DevSecOps Platform - Next.js TypeScript Application

A production-grade Next.js TypeScript frontend application with Tier-3 DevSecOps CI/CD pipeline implementation. Features RBAC, JWT RS256 authentication, and comprehensive security controls.

## 🚀 Features

- **Authentication**: JWT RS256 with HttpOnly cookies, refresh token rotation
- **Authorization**: Role-Based Access Control (RBAC) with granular permissions
- **Security**: AES-256 encryption for PII, bcrypt for passwords
- **UI/UX**: Modern responsive design with dark/light theme support
- **DevSecOps**: Complete CI/CD pipeline with security gates

## 📋 Prerequisites

- Node.js 20+ or Bun
- PostgreSQL (optional, SQLite available for development)
- Docker & Docker Compose (optional)

## 🛠️ Quick Start

### Using Bun (Recommended)

```bash
# Install dependencies
bun install

# Set up environment
cp env.example .env

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

## 📁 Project Structure

```
├── .github/workflows/     # CI/CD pipeline definitions
├── app/                   # Next.js App Router
│   ├── (public)/          # Public routes (auth pages)
│   ├── (protected)/       # Protected routes (dashboard, admin)
│   └── api/               # API routes
├── components/
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── shared/            # Shared/reusable components
│   ├── ui/                # shadcn/ui components
│   └── views/             # Page view components
├── lib/
│   ├── api/               # API services
│   ├── auth/              # Authentication utilities
│   ├── hooks/             # Custom React hooks
│   ├── models/            # TypeScript interfaces
│   └── stores/            # Zustand stores
├── public/dummy-data/     # Mock data for fallback
├── tests/
│   ├── unit/              # Jest unit tests
│   └── e2e/               # Playwright E2E tests
└── docs/                  # Documentation
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
bun run test

# Run with watch mode
bun run test:watch
```

### E2E Tests

```bash
# Install Playwright browsers
bunx playwright install

# Run E2E tests
bun run test:e2e

# Run with UI
bun run test:e2e:ui
```

## 🔐 Security Features

### Authentication
- JWT RS256 asymmetric encryption
- HttpOnly, Secure, SameSite=Strict cookies
- 15-minute access token expiry
- 7-day refresh token with rotation

### Authorization (RBAC)
| Role | Level | Description |
|------|-------|-------------|
| SUPER_ADMIN | 5 | Full system access |
| ADMIN | 4 | Admin operations |
| MANAGER | 3 | Team management |
| USER | 2 | Standard access |
| GUEST | 1 | Limited access |

### Encryption
- **Passwords**: bcrypt (cost factor 12)
- **PII**: AES-256-GCM / Fernet
- **Transit**: TLS 1.3

## 🚢 Deployment

### Build for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t devsecops-platform .

# Run container
docker run -p 3000:3000 devsecops-platform
```

## 📊 CI/CD Pipeline

The project includes a comprehensive Tier-3 DevSecOps CI/CD pipeline:

1. **Format Check** - Code formatting validation
2. **Type Check** - TypeScript compilation
3. **Unit Tests** - Jest with coverage (80% threshold)
4. **SAST** - Semgrep static analysis
5. **Secret Scan** - Gitleaks secret detection
6. **SCA** - Trivy dependency scanning
7. **Build** - Next.js production build
8. **Container Build** - Docker multi-stage build
9. **Image Scan** - Trivy container scanning
10. **SBOM** - Software Bill of Materials
11. **E2E Tests** - Playwright end-to-end testing
12. **Deploy** - Environment deployment
13. **Health Check** - Post-deploy verification

## 📝 API Integration

The frontend is designed to integrate with a FastAPI backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User authentication |
| `/auth/refresh` | POST | Token refresh |
| `/auth/logout` | POST | Session termination |
| `/auth/me` | GET | Current user info |
| `/users` | GET | List users (admin) |
| `/rbac/roles` | GET | List roles |
| `/files/presign` | GET | Presigned URL |
| `/notifications` | GET | User notifications |

When APIs are unavailable, the app gracefully falls back to mock data.

## 🎨 Design System

### Color Palette
- **Primary**: Red 400 (#F87171)
- **Accent**: Green 400 (#4ADE80)
- **Background**: Light (#FAFAFA) / Dark (#0A0A0A)

### Typography
- **Font**: Plus Jakarta Sans
- **Weights**: 300-800

## 📖 Documentation

- [Security Policy](./SECURITY.md)
- [DevSecOps Pipeline](./docs/devsecops.md)
- [Architecture](./docs/architecture.md)
- [RBAC Design](./docs/rbac-design.md)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ for DevSecOps excellence.
