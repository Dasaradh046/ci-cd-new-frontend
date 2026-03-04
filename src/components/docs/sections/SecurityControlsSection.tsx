/**
 * Security Controls Section
 * JWT Authentication, Encryption, RBAC, and Security Headers
 */

'use client';

import { useState } from 'react';
import {
  Shield,
  Key,
  Lock,
  Database,
  Users,
  CheckCircle,
  Copy,
  Check,
  Globe,
  Server,
  AlertTriangle,
  Eye,
  EyeOff,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '../shared';
import { SectionHeader } from '../shared';
import { cn } from '@/lib/utils';

const TOKEN_COMPARISON = [
  { feature: 'Key Size', accessToken: '3072-bit RSA', refreshToken: '256-bit random' },
  { feature: 'Expiration', accessToken: '15 minutes', refreshToken: '7 days' },
  { feature: 'Storage', accessToken: 'HTTP-only cookie', refreshToken: 'HTTP-only + DB' },
  { feature: 'Rotation', accessToken: 'Auto-refresh', refreshToken: 'Single-use' },
  { feature: 'Revocation', accessToken: 'Short-lived', refreshToken: 'Immediate' },
  { feature: 'Claims', accessToken: 'User, Roles, Perms', refreshToken: 'Session ID' },
];

const RBAC_ROLES = [
  { 
    name: 'SUPER_ADMIN', 
    displayName: 'Super Admin',
    level: 5, 
    color: 'rose',
    permissions: 'All permissions',
    description: 'Full system access including user management, roles, and system configuration',
    canCreate: ['Users', 'Roles', 'Permissions', 'Files', 'Settings'],
  },
  { 
    name: 'ADMIN', 
    displayName: 'Administrator',
    level: 4, 
    color: 'primary',
    permissions: 'Users, Roles, Files',
    description: 'Administrative access for user and content management',
    canCreate: ['Users', 'Files', 'Settings'],
  },
  { 
    name: 'MANAGER', 
    displayName: 'Manager',
    level: 3, 
    color: 'emerald',
    permissions: 'Team, Files',
    description: 'Team management with file upload capabilities',
    canCreate: ['Files'],
  },
  { 
    name: 'USER', 
    displayName: 'User',
    level: 2, 
    color: 'blue',
    permissions: 'Own data, Files',
    description: 'Standard user with personal data access',
    canCreate: ['Files (own)'],
  },
  { 
    name: 'GUEST', 
    displayName: 'Guest',
    level: 1, 
    color: 'slate',
    permissions: 'View only',
    description: 'Read-only access to public resources',
    canCreate: [],
  },
];

const SECURITY_HEADERS = [
  {
    name: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`,
    description: 'Prevents XSS by controlling resource loading',
    severity: 'critical',
  },
  {
    name: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
    description: 'Enforces HTTPS connections',
    severity: 'critical',
  },
  {
    name: 'X-Content-Type-Options',
    value: 'nosniff',
    description: 'Prevents MIME type sniffing',
    severity: 'high',
  },
  {
    name: 'X-Frame-Options',
    value: 'DENY',
    description: 'Prevents clickjacking',
    severity: 'high',
  },
  {
    name: 'X-XSS-Protection',
    value: '1; mode=block',
    description: 'Enables browser XSS filter',
    severity: 'medium',
  },
  {
    name: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
    description: 'Controls referrer information',
    severity: 'medium',
  },
  {
    name: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
    description: 'Restricts browser features',
    severity: 'medium',
  },
];

export function SecurityControlsSection() {
  const [showToken, setShowToken] = useState(false);

  const sampleToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOlsidXNlcnM6cmVhZCIsInVzZXJzOndyaXRlIl0sImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5OTIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

  return (
    <section id="security" className="scroll-mt-20 space-y-8">
      <SectionHeader
        id="security"
        title="Security Controls"
        description="Comprehensive security architecture documentation"
        icon={Shield}
        iconColor="text-amber-500"
      />

      <Tabs defaultValue="jwt" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="jwt">JWT Auth</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="rbac">RBAC</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="csrf">CSRF</TabsTrigger>
        </TabsList>

        {/* JWT Authentication */}
        <TabsContent value="jwt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                JWT RS256 Authentication
              </CardTitle>
              <CardDescription>
                Asymmetric encryption using RSA 3072-bit keys for secure token-based authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Token Comparison */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-semibold">Feature</th>
                      <th className="text-left py-3 px-4 font-semibold">Access Token</th>
                      <th className="text-left py-3 pl-4 font-semibold">Refresh Token</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOKEN_COMPARISON.map((row, i) => (
                      <tr key={row.feature} className={cn('border-b', i % 2 === 0 && 'bg-muted/30')}>
                        <td className="py-3 pr-4 font-medium">{row.feature}</td>
                        <td className="py-3 px-4">{row.accessToken}</td>
                        <td className="py-3 pl-4">{row.refreshToken}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sample Token */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Sample JWT Structure:</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {showToken ? 'Hide' : 'Show'} Token
                  </Button>
                </div>
                <CodeBlock 
                  code={showToken ? sampleToken : `${sampleToken.substring(0, 50)}...`}
                  language="jwt"
                />
              </div>

              {/* Token Flow */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h4 className="font-semibold mb-3">Token Flow Process</h4>
                <div className="space-y-2 text-sm">
                  {[
                    'Client sends credentials → Server validates against database',
                    'Server generates Access Token (RS256) + Refresh Token',
                    'Access Token: HTTP-only cookie, 15min TTL, contains claims',
                    'Refresh Token: HTTP-only cookie, 7 days TTL, stored in DB',
                    'On Access Token expiry → Client uses Refresh Token',
                    'Server validates, issues new Access Token, rotates Refresh Token',
                    'Old Refresh Token invalidated (prevents replay attacks)',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Example */}
              <div>
                <p className="text-sm font-medium mb-2">JWT Verification Code:</p>
                <CodeBlock 
                  code={`// Verify JWT token
import { verify } from 'jsonwebtoken';
import { readFileSync } from 'fs';

const publicKey = readFileSync('./public.pem');

function verifyToken(token: string) {
  try {
    const decoded = verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'devsecops-platform',
      audience: 'devsecops-users',
    });
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}`}
                  language="typescript"
                  filename="auth.ts"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Encryption */}
        <TabsContent value="encryption" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <Lock className="h-5 w-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base">AES-256-GCM</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Fernet symmetric encryption for data at rest with built-in authentication.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium">Protected Data:</p>
                  <div className="flex flex-wrap gap-1">
                    {['Emails', 'Phone Numbers', 'API Keys', 'PII'].map((item) => (
                      <Badge key={item} variant="outline" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">TLS 1.3</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  All data in transit encrypted using TLS 1.3 with strong cipher suites.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium">Cipher Suites:</p>
                  <div className="flex flex-wrap gap-1">
                    {['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256'].map((item) => (
                      <Badge key={item} variant="outline" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Key className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-base">Key Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  HashiCorp Vault with HSM backing for secure key storage and rotation.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {['90-day rotation', 'HSM-backed', 'Audit logging', 'Auto-unseal'].map((item) => (
                      <Badge key={item} variant="outline" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Encryption Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock 
                code={`// Fernet encryption for sensitive data
from cryptography.fernet import Fernet
import os

class SecureStorage:
    def __init__(self):
        self.key = os.environ.get('FERNET_KEY')
        self.cipher = Fernet(self.key)
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        return self.cipher.decrypt(encrypted_data.encode()).decode()
    
    def rotate_key(self, new_key: str):
        """Rotate encryption key"""
        # Decrypt all data with old key
        # Re-encrypt with new key
        pass`}
                language="python"
                filename="encryption.py"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* RBAC */}
        <TabsContent value="rbac" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Role-Based Access Control
              </CardTitle>
              <CardDescription>
                Granular permissions with hierarchical role structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 font-semibold">Level</th>
                      <th className="text-left py-3 px-4 font-semibold">Permissions</th>
                      <th className="text-left py-3 pl-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RBAC_ROLES.map((role, i) => (
                      <tr key={role.name} className={cn('border-b', i % 2 === 0 && 'bg-muted/30')}>
                        <td className="py-3 pr-4">
                          <div>
                            <span className="font-medium">{role.displayName}</span>
                            <span className="text-xs text-muted-foreground ml-2">({role.name})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={cn(
                            'text-xs',
                            role.color === 'rose' && 'bg-rose-500',
                            role.color === 'primary' && 'bg-primary',
                            role.color === 'emerald' && 'bg-emerald-500',
                            role.color === 'blue' && 'bg-blue-500',
                            role.color === 'slate' && 'bg-slate-500'
                          )}>
                            {role.level}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{role.permissions}</td>
                        <td className="py-3 pl-4 text-muted-foreground">{role.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permission Check Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock 
                code={`// Permission middleware
function hasPermission(user, resource, action) {
  // Check if user has role with required permission
  return user.role.permissions.some(
    p => p.resource === resource && p.action === action
  );
}

// Usage in API route
app.delete('/api/users/:id', authMiddleware, (req, res) => {
  if (!hasPermission(req.user, 'users', 'delete')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Proceed with deletion
});`}
                language="typescript"
                filename="permission.ts"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Headers */}
        <TabsContent value="headers" className="space-y-6">
          <div className="space-y-4">
            {SECURITY_HEADERS.map((header) => (
              <Card key={header.name}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-1.5 rounded-lg shrink-0',
                      header.severity === 'critical' && 'bg-rose-100',
                      header.severity === 'high' && 'bg-amber-100',
                      header.severity === 'medium' && 'bg-blue-100'
                    )}>
                      <Shield className={cn(
                        'h-4 w-4',
                        header.severity === 'critical' && 'text-rose-600',
                        header.severity === 'high' && 'text-amber-600',
                        header.severity === 'medium' && 'text-blue-600'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono font-medium">{header.name}</code>
                        <Badge variant="outline" className={cn(
                          'text-[10px]',
                          header.severity === 'critical' && 'border-rose-300 text-rose-600',
                          header.severity === 'high' && 'border-amber-300 text-amber-600',
                          header.severity === 'medium' && 'border-blue-300 text-blue-600'
                        )}>
                          {header.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{header.description}</p>
                      <CodeBlock 
                        code={`${header.name}: ${header.value}`}
                        language="http"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* CSRF */}
        <TabsContent value="csrf" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                CSRF Protection
              </CardTitle>
              <CardDescription>
                Multi-layer protection against Cross-Site Request Forgery attacks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <h4 className="font-semibold text-emerald-700 mb-3">Cookie Attributes</h4>
                  <ul className="text-sm text-emerald-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <code>SameSite=Strict</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <code>Secure=true</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <code>HttpOnly=true</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <code>Path=/</code>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-700 mb-3">Additional Protections</h4>
                  <ul className="text-sm text-blue-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      XSRF token validation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Origin header verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Double-submit cookie
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Referer validation
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">CSRF Middleware Implementation:</p>
                <CodeBlock 
                  code={`// CSRF protection middleware
import { randomBytes } from 'crypto';

export function csrfMiddleware(req, res, next) {
  // Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Verify origin
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  
  // Verify CSRF token
  const csrfToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['XSRF-TOKEN'];
  
  if (!csrfToken || csrfToken !== cookieToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  next();
}`}
                  language="typescript"
                  filename="csrf.ts"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
