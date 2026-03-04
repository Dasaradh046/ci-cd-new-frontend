**PRODUCT REQUIREMENT DOCUMENT**

DevSecOps-Ready Next.js TypeScript Application

Tier-3 CI/CD Pipeline Implementation

Version 1.0

March 3, 2026

*Classification: Internal Use Only*

Table of Contents

1\. Executive Summary 3

2\. Project Overview 3

3\. Architecture Requirements 5

4\. Functional Requirements 7

5\. Security Requirements 12

6\. API Integration Requirements 14

7\. User Interface Requirements 16

8\. DevSecOps Requirements 18

9\. Testing Requirements 20

10\. Documentation Requirements 21

11\. Acceptance Criteria 22

12\. Environment Configuration 24

13\. RSA Key Generation Guide 25

> 2.1 Project Goals 3
>
> 2.2 Target Audience 4
>
> 2.3 Technology Stack 4
>
> 3.1 Design Principles 5
>
> 3.2 Folder Structure 5
>
> 3.3 Routing Architecture 6
>
> 4.1 Authentication System 7
>
> 4.2 Role-Based Access Control (RBAC) 9
>
> 4.3 User Management Pages 10
>
> 4.4 File Management System 11
>
> 5.1 Encryption Standards 12
>
> 5.2 Compliance Requirements 13
>
> 5.3 Security Headers and CSP 13
>
> 6.1 FastAPI Integration 14
>
> 6.2 Dummy Data Fallback 15
>
> 7.1 Design System 16
>
> 7.2 Accessibility Requirements 17
>
> 7.3 Performance Targets 17
>
> 8.1 Tier-3 CI/CD Pipeline 18
>
> 8.2 Containerization 19
>
> 9.1 Unit Testing 20
>
> 9.2 End-to-End Testing 20
>
> 10.1 Required Documentation 21
>
> 10.2 DevSecOps Documentation Page 22
>
> 11.1 Functional Acceptance 22
>
> 11.2 Security Acceptance 23
>
> 11.3 Testing Acceptance 23
>
> 11.4 CI/CD Acceptance 23

*Note: Right-click the Table of Contents and select \'Update Field\' to
refresh page numbers.*

1\. Executive Summary

This Product Requirement Document (PRD) defines the comprehensive
specifications for building a production-grade Next.js TypeScript
frontend application integrated with a FastAPI backend, designed
specifically for practicing and implementing Tier-3 DevSecOps CI/CD
pipelines. The application serves as a prototype demonstrating
enterprise-level security architecture, scalable code organization, and
modern development practices that align with industry-leading security
standards and compliance requirements.

The primary objective is to create a secure, maintainable, and
performant web application that implements Role-Based Access Control
(RBAC), JWT RS256 cookie-based authentication, AES-256 Fernet encryption
for sensitive data, and comprehensive file management capabilities. This
application will serve as both a learning platform for DevSecOps
practices and a reference implementation for secure frontend
architecture.

The solution encompasses complete authentication flows, administrative
interfaces, user management systems, and extensive documentation of the
security posture and DevSecOps pipeline implementation. All components
are designed with security-first principles, following SOLID design
patterns and object-oriented programming best practices to ensure
long-term maintainability and extensibility.

2\. Project Overview

2.1 Project Goals

The project aims to deliver a complete frontend prototype that
demonstrates proficiency in modern web development practices while
maintaining the highest security standards required for enterprise
applications. The application must be fully functional, visually
polished, and ready for integration into a Tier-3 DevSecOps pipeline
with automated security gates at every stage of the software development
lifecycle.

-   Implement clean architecture following SOLID principles and OOP best
    practices throughout the codebase

-   Create a modern, responsive user interface with elegant design,
    smooth transitions, and accessibility compliance

-   Establish secure authentication and authorization mechanisms using
    industry-standard protocols

-   Integrate seamlessly with FastAPI backend services with graceful
    degradation to mock data when APIs are unavailable

-   Provide comprehensive documentation covering architecture, security
    controls, and DevSecOps implementation

-   Include automated test suites covering unit, integration, and
    end-to-end testing scenarios

2.2 Target Audience

The application is designed for multiple stakeholder groups with varying
levels of technical expertise. Development teams will use it as a
reference for secure coding practices and DevSecOps pipeline
integration. Security professionals can leverage it to understand
frontend security controls and compliance implementations. Product
managers and business stakeholders will appreciate the clean user
interface and comprehensive feature set that demonstrates enterprise
application capabilities.

2.3 Technology Stack

The following technology stack has been carefully selected to meet the
project\'s security, performance, and maintainability requirements:

  -----------------------------------------------------------------------
  **Category**               **Technology / Tool**
  -------------------------- --------------------------------------------
  Framework                  Next.js 15 (App Router) with TypeScript

  Styling                    Tailwind CSS v4 with CSS-first theming

  Backend API                FastAPI (Python) with async endpoints

  Authentication             JWT RS256 (RSA asymmetric) with HttpOnly
                             cookies

  Encryption                 AES-256-GCM / Fernet for PII, bcrypt for
                             passwords

  Testing                    Jest, React Testing Library, Playwright E2E

  CI/CD                      GitHub Actions with Tier-3 DevSecOps
                             pipeline

  Security Tools             Semgrep, Trivy, Gitleaks, Snyk, CycloneDX
                             SBOM

  Containerization           Docker multi-stage builds with minimal base
                             images
  -----------------------------------------------------------------------

*Table 1: Technology Stack Overview*

3\. Architecture Requirements

3.1 Design Principles

The application architecture must strictly adhere to SOLID principles
and object-oriented programming best practices. Each component, service,
and module should have a single responsibility, be open for extension
but closed for modification, and demonstrate proper separation of
concerns. The architecture should facilitate easy testing, maintenance,
and future enhancements without requiring significant refactoring.

**The following SOLID principles must be implemented throughout the
codebase:**

1.  Single Responsibility Principle (SRP): Each module, class, and
    component must have one reason to change, focusing on a single
    functional requirement

2.  Open-Closed Principle (OCP): Components must be open for extension
    through interfaces and composition, but closed for modification of
    existing code

3.  Liskov Substitution Principle (LSP): Derived types must be
    substitutable for their base types without altering program
    correctness

4.  Interface Segregation Principle (ISP): Clients must not be forced to
    depend on interfaces they do not use; prefer small, specific
    interfaces

5.  Dependency Inversion Principle (DIP): High-level modules must not
    depend on low-level modules; both should depend on abstractions

3.2 Folder Structure

The project must implement a well-organized folder structure that
separates concerns clearly and follows Next.js App Router conventions.
The structure must support scalability, maintainability, and ease of
navigation for development teams. Route groups using parentheses
notation must be utilized to organize routes without affecting the URL
structure.

The following folder structure is mandatory for the project
implementation:

  -----------------------------------------------------------------------
  **Directory Path**                    **Purpose**
  ------------------------------------- ---------------------------------
  app/                                  Next.js App Router root directory

  app/(public)/                         Public routes (auth pages,
                                        homepage)

  app/(protected)/                      Protected routes (dashboard,
                                        admin)

  app/(protected)/admin/                Admin-only pages (users, RBAC)

  app/(protected)/@modal/               Parallel modal routing slots

  components/ui/                        Reusable UI components (Button,
                                        Input)

  components/auth/                      Authentication-related components

  components/layout/                    Layout components (Header,
                                        Sidebar)

  lib/api/                              API client, auth, users, RBAC
                                        services

  lib/hooks/                            Custom React hooks (useAuth,
                                        useFetch)

  lib/models/                           TypeScript interfaces and domain
                                        models

  public/dummy-data/                    Mock JSON data for fallback
                                        scenarios

  tests/unit/                           Jest unit tests with React
                                        Testing Library

  e2e/playwright/                       Playwright end-to-end test
                                        specifications

  docs/                                 Documentation (DevSecOps,
                                        architecture)

  .github/workflows/                    GitHub Actions CI/CD workflow
                                        definitions
  -----------------------------------------------------------------------

*Table 2: Required Folder Structure*

3.3 Routing Architecture

The application must implement advanced Next.js routing patterns
including parallel routing, modal routing, and intercepted routing.
These patterns enable sophisticated user experiences such as displaying
modal overlays while maintaining independent URL navigation, allowing
users to share links to specific modal states and use browser navigation
controls effectively.

3.3.1 Parallel Routing

Parallel routing allows simultaneous rendering of multiple pages in the
same layout using named slots. The application must use the \@modal
convention for parallel slots to display modal overlays without
navigating away from the current page. This pattern is particularly
useful for admin workflows where users edit records while maintaining
context of the list view.

3.3.2 Intercepted Routing

Intercepted routes must be implemented using the (.) and (..)
conventions to intercept routes at the client-side navigation level
while maintaining full-page navigation on direct URL access. This
enables the creation of modals that appear when navigating within the
application but render as full pages when accessed via direct URL,
improving both user experience and SEO.

3.3.3 Component-Based Routing

Dynamic component rendering based on user roles must be implemented to
provide role-appropriate interfaces. Components should dynamically
adjust their behavior and visibility based on the current user\'s
permissions, ensuring that users only see and interact with
functionality they are authorized to access. This approach combines
routing security with component-level access control.

4\. Functional Requirements

4.1 Authentication System

The authentication system must implement comprehensive user
authentication flows using JWT RS256 asymmetric encryption with HttpOnly
cookie storage. All authentication mechanisms must follow security best
practices and provide protection against common attack vectors including
CSRF, XSS, and session hijacking attempts.

4.1.1 Authentication Pages

The following authentication pages must be implemented with full
functionality:

  -----------------------------------------------------------------------
  **Page**              **Description & Functionality**
  --------------------- -------------------------------------------------
  /login                User login with email/password, sets HttpOnly
                        cookies on success

  /register             New user registration with email verification
                        requirement

  /logout               Session termination with secure cookie clearing

  /forgot-password      Password reset request form, sends reset link via
                        email

  /reset-password       Password reset form accessed via secure token
                        link

  /update-password      Authenticated password change for logged-in users

  /verify-email         Email verification confirmation page with token
                        validation

  /resend-email         Resend verification email functionality with rate
                        limiting
  -----------------------------------------------------------------------

*Table 3: Authentication Pages Specification*

4.1.2 JWT RS256 Cookie Implementation

The authentication system must use JWT tokens signed with RS256 (RSA
Signature with SHA-256) asymmetric encryption. Access tokens must have a
short expiration time of 15 minutes, while refresh tokens must be valid
for 7 days. Both tokens must be stored in HttpOnly, Secure,
SameSite=Strict cookies to prevent client-side JavaScript access and
cross-site request forgery attacks.

**Required cookie attributes for all authentication cookies:**

-   HttpOnly: Prevents JavaScript access to cookie values, mitigating
    XSS-based token theft

-   Secure: Ensures cookies are only transmitted over HTTPS connections

-   SameSite=Strict: Prevents cross-site request forgery by restricting
    cookie to same-site requests

-   Path=/: Makes cookies available across all application routes

-   Domain: Configured appropriately for the deployment environment

4.2 Role-Based Access Control (RBAC)

The RBAC system must provide granular access control through a flexible
role-permission model. The system must support dynamic role and
permission management through administrative interfaces while enforcing
access controls at both the routing and component levels. All RBAC
decisions must be made server-side with client-side enforcement serving
only as a user experience enhancement.

4.2.1 Role Definitions

The following default roles must be implemented in the system:

  ------------------------------------------------------------------------
  **Role**          **Description & Access Level**
  ----------------- ------------------------------------------------------
  **SUPER_ADMIN**   Full system access including RBAC management, user
                    administration, and system configuration

  **ADMIN**         Administrative access to user management and content
                    moderation without system configuration

  **MANAGER**       Team management capabilities with limited
                    administrative functions for assigned resources

  **USER**          Standard authenticated user with access to personal
                    resources and public content

  **GUEST**         Limited read-only access to public resources with
                    optional authenticated features
  ------------------------------------------------------------------------

*Table 4: Role Definitions*

4.2.2 Permission Structure

Permissions must follow a resource.action naming convention for clarity
and consistency:

-   users.create, users.read, users.update, users.delete - User
    management permissions

-   roles.create, roles.read, roles.update, roles.delete - Role
    management permissions

-   permissions.read, permissions.assign - Permission viewing and
    assignment

-   files.upload, files.read, files.delete - File management permissions

-   settings.read, settings.update - System settings permissions

4.3 User Management Pages

The application must include comprehensive user management interfaces
for both administrators and end users. Administrative pages must provide
full CRUD operations for user accounts, while end-user pages must allow
profile management and personal settings configuration. All user data
must be handled in compliance with GDPR and other applicable data
protection regulations.

4.3.1 Admin User Management

The admin users page must provide the following functionality:

1.  User listing with pagination, sorting, and filtering capabilities

2.  User creation form with email verification workflow

3.  User editing interface with role assignment capabilities

4.  User deletion with soft-delete option and audit trail

5.  User status management (active, suspended, pending verification)

4.3.2 End User Pages

End users must have access to the following personal management pages:

-   Profile page: Display and edit personal information, avatar upload,
    bio

-   Settings page: Account preferences, notification settings, privacy
    controls

-   Notifications page: User notifications with read/unread status,
    filtering

-   Files page: Personal file management with upload, download, and
    delete capabilities

4.4 File Management System

The file management system must provide secure file upload, storage, and
download capabilities for user files. The system must implement
presigned URL patterns for secure file transfers, ensuring that file
access is properly authenticated and authorized before allowing any file
operations. File ownership and access controls must be enforced at all
times.

**Required file management features:**

1.  File upload with drag-and-drop support and progress indicators

2.  File type validation and size restrictions with user feedback

3.  File listing with thumbnails for supported file types

4.  Secure download through presigned URLs with expiration

5.  File deletion with confirmation and audit logging

6.  Role-based access control for file operations

5\. Security Requirements

5.1 Encryption Standards

The application must implement encryption at multiple layers to protect
sensitive data in transit and at rest. All encryption implementations
must follow industry best practices and use proven cryptographic
libraries. Key management must be handled through secure mechanisms such
as HashiCorp Vault, AWS KMS, or equivalent key management services.

5.1.1 Password Security

All user passwords must be hashed using bcrypt with a minimum cost
factor of 12. The bcrypt algorithm provides built-in salt generation and
is resistant to rainbow table attacks. Password hashing must be
performed server-side, and passwords must never be logged, cached, or
transmitted in plaintext. Password requirements must enforce minimum
length and complexity standards.

5.1.2 PII Encryption

Personally Identifiable Information (PII) must be encrypted at rest
using either Fernet (authenticated encryption) or AES-256-GCM. The
choice between these algorithms should be documented with rationale.
Encryption keys must be stored separately from encrypted data and
rotated according to a defined schedule. All encryption operations must
be performed server-side to prevent key exposure to client-side
environments.

5.1.3 RSA Key Management

RSA key pairs for JWT RS256 signing must be generated and managed
securely:

-   Private keys must never be exposed to the frontend application or
    stored in version control

-   Key rotation procedures must be documented and tested

-   Minimum key size must be 3072 bits for RS256

-   Keys must be stored in a secrets manager or HSM

5.2 Compliance Requirements

The application must be designed with compliance considerations for
GDPR, PCI DSS, and other applicable regulations. While this is primarily
a frontend prototype, the architecture must support backend
implementations that meet these compliance requirements. User consent
management, data export functionality, and right-to-erasure workflows
must be accommodated in the UI design.

5.2.1 GDPR Compliance Features

-   Data minimization: Only collect and display necessary user
    information

-   User data export: Interface for users to request and download their
    data

-   Account deletion: User-initiated account deletion workflow

-   Consent management: Cookie consent banner and preference management

5.3 Security Headers and CSP

The application must implement appropriate security headers including
Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options,
and Strict-Transport-Security (HSTS). CSP should be implemented in
report-only mode during development and enforced in production.
Subresource Integrity (SRI) must be used for any third-party scripts
that cannot be avoided.

6\. API Integration Requirements

6.1 FastAPI Integration

All data operations must be performed through async calls to FastAPI
backend endpoints. The API client must be designed with proper error
handling, timeout configuration, and retry logic. All requests must
include credentials for cookie-based authentication. The frontend must
never make assumptions about data availability and must gracefully
handle all error scenarios.

6.1.1 Required API Endpoints

The frontend must be designed to consume the following backend
endpoints:

  ------------------------------------------------------------------------
  **Method**      **Endpoint**     **Description**
  --------------- ---------------- ---------------------------------------
  POST            /auth/login      Authenticate user, set HttpOnly cookies

  POST            /auth/refresh    Refresh access token using refresh
                                   token

  POST            /auth/logout     Clear session cookies

  GET             /auth/me         Get current user with roles and
                                   permissions

  GET             /users           List all users (admin only)

  GET             /rbac/roles      List all roles with permissions

  GET             /files/presign   Get presigned URL for file upload

  GET             /notifications   Get user notifications
  ------------------------------------------------------------------------

*Table 5: Core API Endpoints*

6.2 Dummy Data Fallback

When backend API calls fail or return empty results, the application
must gracefully fall back to local dummy JSON data. This fallback
mechanism ensures the application remains functional for demonstration
and testing purposes even when the backend is unavailable. The fallback
must be transparent to users while providing visual indication that mock
data is being displayed.

**Implementation requirements for dummy data fallback:**

1.  Create a useFetchWithFallback hook that attempts API call first

2.  On failure or empty response, load data from
    /public/dummy-data/\*.json

3.  Return metadata indicating whether data is mocked (isMock: boolean)

4.  Display visual indicator (pill badge) when showing mock data

7\. User Interface Requirements

7.1 Design System

The application must implement a cohesive design system with a modern,
elegant color palette and smooth user interactions. The design must be
professional yet approachable, using subtle animations and transitions
to enhance user experience without being distracting. All components
must follow accessibility guidelines (WCAG 2.1 AA) and be fully
responsive across desktop, tablet, and mobile devices.

7.1.1 Color Palette

The following color palette must be used throughout the application:

  ------------------------------------------------------------------------
  **Color Name**        **Hex Value**    **Usage**
  --------------------- ---------------- ---------------------------------
  Primary Indigo        #312E81          Primary buttons, headers,
                                         important elements

  Accent Cyan           #06B6D4          Links, highlights, interactive
                                         accents

  Background            #0F172A          Page background, dark surfaces

  Surface               #1E293B          Cards, modals, elevated surfaces

  Success               #10B981          Success messages, positive
                                         indicators

  Error                 #EF4444          Error messages, destructive
                                         actions
  ------------------------------------------------------------------------

*Table 6: Color Palette Specification*

7.1.2 Typography

The application must use the Inter font family (or equivalent modern
sans-serif) for body text and headings. Font loading must be optimized
using next/font to ensure fast rendering without layout shifts. A clear
typographic hierarchy must be established with consistent sizing,
weight, and line-height values across all components.

7.2 Accessibility Requirements

All components must meet WCAG 2.1 AA compliance standards:

-   All interactive elements must be keyboard navigable with visible
    focus indicators

-   Color contrast ratios must meet minimum requirements (4.5:1 for
    normal text)

-   All images must have appropriate alt text descriptions

-   Form inputs must have associated labels and error messages

-   ARIA attributes must be used appropriately for dynamic content

7.3 Performance Targets

The application must meet the following performance benchmarks:

-   Lighthouse Performance Score: 90 or higher

-   Lighthouse Accessibility Score: 90 or higher

-   First Contentful Paint (FCP): Under 1.8 seconds

-   Largest Contentful Paint (LCP): Under 2.5 seconds

-   Time to Interactive (TTI): Under 3.8 seconds

8\. DevSecOps Requirements

8.1 Tier-3 CI/CD Pipeline

The project must include a comprehensive GitHub Actions CI/CD pipeline
implementing Tier-3 DevSecOps practices. The pipeline must enforce
security gates at every stage, failing builds on critical security
findings. All stages must be ordered to fail fast, with lower-cost
checks running before expensive operations like container builds and
deployments.

8.1.1 Pipeline Stages

The CI/CD pipeline must implement the following stages in order:

1.  Format Check: Run Prettier to ensure code formatting consistency

2.  Lint: Run ESLint with TypeScript support for code quality

3.  Type Check: Run TypeScript compiler in strict mode

4.  Unit Tests: Run Jest with coverage threshold enforcement (80%)

5.  SAST: Run Semgrep for static application security testing

6.  Secret Scan: Run Gitleaks to detect committed secrets

7.  SCA: Run Trivy/Snyk for dependency vulnerability scanning

8.  Build: Run Next.js production build

9.  Container Build: Build Docker image with multi-stage Dockerfile

10. Image Scan: Run Trivy container image vulnerability scan

11. SBOM: Generate Software Bill of Materials using CycloneDX

12. E2E Tests: Run Playwright tests against built container

13. Deploy: Deploy to environment (with manual approval for production)

14. Post-Deploy: Run health checks and smoke tests

8.2 Containerization

The application must include a multi-stage Dockerfile optimized for
production deployment. The container must follow security best practices
including running as non-root user, minimal base image usage, and proper
health check implementation. Docker compose configuration must be
provided for local development with all required services.

**Container security requirements:**

-   Use minimal base images (Alpine or Distroless)

-   Run container as non-root user

-   Implement health check endpoints

-   Scan images for vulnerabilities before deployment

-   No secrets in image layers or environment

9\. Testing Requirements

9.1 Unit Testing

Unit tests must be written using Jest and React Testing Library. Tests
must cover all critical business logic, utility functions, custom hooks,
and component behavior. Mock implementations must be provided for
external dependencies. Test coverage must meet a minimum threshold of
80% for all metrics (statements, branches, functions, lines).

**Required unit test coverage:**

-   Authentication hooks (useAuth, useLogin, useRegister)

-   RBAC utilities (hasPermission, withRole HOC)

-   API client functions with error handling

-   Protected route components

-   Form validation logic

9.2 End-to-End Testing

End-to-end tests must be implemented using Playwright. Tests must cover
critical user journeys including authentication flows, protected route
access, admin functionality, and file operations. Tests must be designed
to run reliably in CI environments with proper test isolation and
cleanup.

**Required E2E test scenarios:**

1.  Happy path login flow with successful dashboard access

2.  Protected route access denial for unauthenticated users

3.  Admin access to user management and RBAC pages

4.  Non-admin restriction from admin routes (403 handling)

5.  File upload and download workflows

6.  RBAC permission toggle and role editing

10\. Documentation Requirements

10.1 Required Documentation

Comprehensive documentation must be provided to support development,
deployment, and security audit activities. All documentation must be
maintained in Markdown format within the docs/ directory and kept
up-to-date with code changes. Documentation must be clear, thorough, and
accessible to developers of varying experience levels.

  ------------------------------------------------------------------------
  **Document**           **Content Description**
  ---------------------- -------------------------------------------------
  README.md              Project overview, setup, run, test, and deploy
                         instructions

  SECURITY.md            Security policy, key management, incident
                         response

  docs/devsecops.md      DevSecOps pipeline details, tools, security
                         controls

  docs/architecture.md   System architecture, design decisions, trade-offs

  docs/rbac-design.md    RBAC model, roles, permissions, implementation
                         guide

  docs/encryption.md     Encryption standards, key rotation, compliance
                         notes
  ------------------------------------------------------------------------

*Table 7: Required Documentation*

10.2 DevSecOps Documentation Page

A dedicated documentation page must be accessible within the application
at /docs/devsecops. This page must provide comprehensive information
about the DevSecOps practices implemented in the project, including
pipeline stages, security tools used, vulnerability management
procedures, and compliance considerations. The page must be designed for
both technical and non-technical audiences.

11\. Acceptance Criteria

The following acceptance criteria must be met for the project to be
considered complete. All criteria are mandatory and must be verified
through automated testing or documented manual verification procedures.

11.1 Functional Acceptance

1.  Application starts successfully with npm run dev and loads the
    public homepage

2.  All authentication flows (login, register, logout, password reset)
    function correctly

3.  Protected routes redirect unauthenticated users to login page

4.  Admin RBAC UI allows role and permission management

5.  Dummy data fallback activates when API is unavailable with visual
    indication

6.  File upload and download workflows complete successfully

11.2 Security Acceptance

1.  JWT tokens stored only in HttpOnly Secure cookies

2.  No secrets or private keys in version control

3.  SAST scan passes with no critical findings

4.  Container image scan shows no critical CVEs

5.  Dependency scan shows no critical vulnerabilities

11.3 Testing Acceptance

1.  npm run test executes all unit tests successfully

2.  Code coverage meets 80% threshold across all metrics

3.  Playwright E2E tests run successfully in CI

4.  All test failures are documented with clear reproduction steps

11.4 CI/CD Acceptance

1.  GitHub Actions workflow executes all defined stages in correct order

2.  Pipeline fails on security gate violations

3.  SBOM is generated and stored as artifact

4.  Docker image builds successfully with minimal size

5.  README documents all setup and execution procedures

12\. Environment Configuration

The application must provide an env.example file documenting all
required environment variables. Sensitive values must never be committed
to version control. Environment-specific configurations must be managed
through appropriate secret management solutions in production
deployments.

  -----------------------------------------------------------------------
  **Variable Name**          **Description**
  -------------------------- --------------------------------------------
  NEXT_PUBLIC_API_BASE_URL   Base URL for FastAPI backend service

  RS256_PUBLIC_KEY_PATH      Path to RSA public key for JWT verification

  NODE_ENV                   Application environment
                             (development/production)

  REFRESH_ENDPOINT           Endpoint for silent token refresh

  NEXTAUTH_SECRET            Secret for NextAuth.js session encryption
  -----------------------------------------------------------------------

*Table 8: Environment Variables*

13\. RSA Key Generation Guide

RSA key pairs for JWT RS256 signing must be generated using the
following commands. The private key must be stored securely in a secrets
manager and never committed to version control. The public key can be
safely distributed to frontend applications for token verification.

**Generate RSA key pair:**

\# Generate 3072-bit RSA private key

openssl genpkey -algorithm RSA -out private.pem -pkeyopt
rsa_keygen_bits:3072

\# Extract public key from private key

openssl rsa -pubout -in private.pem -out public.pem
