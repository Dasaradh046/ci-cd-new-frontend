/**
 * API Reference Section
 * Documentation for all API endpoints
 */

'use client';

import {
  Code2,
  Lock,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  FileJson,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '../shared';
import { SectionHeader } from '../shared';
import { cn } from '@/lib/utils';

const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticate user and receive access tokens',
    auth: false,
    rateLimit: '5 requests/minute',
    request: {
      email: 'user@example.com',
      password: 'string',
    },
    response: {
      success: true,
      data: {
        user: {
          id: 'usr_123',
          email: 'user@example.com',
          name: 'John Doe',
          role: { id: 'role_1', name: 'USER', displayName: 'User' },
        },
        accessToken: 'eyJhbGciOiJSUzI1NiIs...',
      },
    },
    errors: [
      { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' },
      { code: 'ACCOUNT_LOCKED', message: 'Account is temporarily locked' },
    ],
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    description: 'Create a new user account',
    auth: false,
    rateLimit: '3 requests/minute',
    request: {
      email: 'user@example.com',
      password: 'SecureP@ss123',
      name: 'John Doe',
    },
    response: {
      success: true,
      data: {
        user: { id: 'usr_124', email: 'user@example.com', name: 'John Doe' },
      },
    },
    errors: [
      { code: 'EMAIL_EXISTS', message: 'Email is already registered' },
      { code: 'WEAK_PASSWORD', message: 'Password does not meet requirements' },
    ],
  },
  {
    method: 'GET',
    path: '/api/users',
    description: 'List all users with pagination',
    auth: true,
    permissions: ['users:view'],
    rateLimit: '100 requests/minute',
    queryParams: [
      { name: 'page', type: 'number', default: '1', description: 'Page number' },
      { name: 'pageSize', type: 'number', default: '20', description: 'Items per page' },
      { name: 'search', type: 'string', description: 'Search by name or email' },
      { name: 'status', type: 'string', description: 'Filter by status' },
    ],
    response: {
      data: [
        { id: 'usr_1', email: 'user1@example.com', name: 'User One', status: 'ACTIVE' },
      ],
      pagination: { page: 1, pageSize: 20, total: 100, totalPages: 5 },
    },
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    description: 'Get user by ID',
    auth: true,
    permissions: ['users:view'],
    rateLimit: '100 requests/minute',
    response: {
      success: true,
      data: {
        id: 'usr_1',
        email: 'user@example.com',
        name: 'John Doe',
        status: 'ACTIVE',
        role: { id: 'role_1', name: 'USER' },
        createdAt: '2024-01-15T10:30:00Z',
      },
    },
  },
  {
    method: 'PATCH',
    path: '/api/users/:id',
    description: 'Update user information',
    auth: true,
    permissions: ['users:edit'],
    rateLimit: '50 requests/minute',
    request: {
      name: 'Updated Name',
      status: 'ACTIVE',
      roleId: 'role_2',
    },
    response: {
      success: true,
      data: { id: 'usr_1', name: 'Updated Name', status: 'ACTIVE' },
    },
  },
  {
    method: 'DELETE',
    path: '/api/users/:id',
    description: 'Delete user account',
    auth: true,
    permissions: ['users:delete'],
    rateLimit: '20 requests/minute',
    response: {
      success: true,
      data: null,
    },
  },
  {
    method: 'GET',
    path: '/api/files',
    description: 'List files with pagination',
    auth: true,
    rateLimit: '100 requests/minute',
    queryParams: [
      { name: 'page', type: 'number', default: '1' },
      { name: 'pageSize', type: 'number', default: '50' },
      { name: 'type', type: 'string', description: 'Filter by file type' },
    ],
    response: {
      data: [
        { id: 'file_1', name: 'document.pdf', size: 1024, mimeType: 'application/pdf' },
      ],
      pagination: { page: 1, pageSize: 50, total: 200 },
    },
  },
  {
    method: 'POST',
    path: '/api/files/upload',
    description: 'Upload a file',
    auth: true,
    rateLimit: '10 requests/minute',
    contentType: 'multipart/form-data',
    request: {
      file: '(binary)',
      folder: 'documents',
      isPublic: false,
    },
    response: {
      success: true,
      data: {
        id: 'file_1',
        name: 'document.pdf',
        url: 'https://storage.example.com/files/file_1',
        size: 1024,
      },
    },
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-500',
  POST: 'bg-blue-500',
  PUT: 'bg-amber-500',
  PATCH: 'bg-amber-500',
  DELETE: 'bg-rose-500',
};

export function APIReferenceSection() {
  return (
    <section id="api" className="scroll-mt-20 space-y-8">
      <SectionHeader
        id="api"
        title="API Reference"
        description="RESTful API endpoints for platform integration"
        icon={Code2}
        iconColor="text-blue-500"
      />

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="errors">Error Codes</TabsTrigger>
          <TabsTrigger value="ratelimit">Rate Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          {API_ENDPOINTS.map((endpoint) => (
            <Card key={endpoint.path}>
              <CardContent className="py-4">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center flex-wrap gap-2">
                    <Badge className={cn('text-xs font-mono', METHOD_COLORS[endpoint.method])}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                    {endpoint.auth && (
                      <Badge variant="outline" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Auth Required
                      </Badge>
                    )}
                    {endpoint.permissions && (
                      <Badge variant="secondary" className="text-xs">
                        {endpoint.permissions.join(', ')}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>

                  {/* Query Parameters */}
                  {endpoint.queryParams && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Query Parameters</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 pr-4">Name</th>
                              <th className="text-left py-2 px-4">Type</th>
                              <th className="text-left py-2 px-4">Default</th>
                              <th className="text-left py-2 pl-4">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoint.queryParams.map((param) => (
                              <tr key={param.name} className="border-b last:border-0">
                                <td className="py-2 pr-4 font-mono">{param.name}</td>
                                <td className="py-2 px-4">{param.type}</td>
                                <td className="py-2 px-4 text-muted-foreground">{param.default || '-'}</td>
                                <td className="py-2 pl-4 text-muted-foreground">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Request/Response */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {endpoint.request && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Request Body</p>
                        <CodeBlock 
                          code={JSON.stringify(endpoint.request, null, 2)} 
                          language="json"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Response</p>
                      <CodeBlock 
                        code={JSON.stringify(endpoint.response, null, 2)} 
                        language="json"
                      />
                    </div>
                  </div>

                  {/* Errors */}
                  {endpoint.errors && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Possible Errors</p>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.errors.map((error) => (
                          <Badge key={error.code} variant="outline" className="text-xs">
                            {error.code}: {error.message}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                All API requests require authentication via JWT tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Authorization Header</p>
                <CodeBlock 
                  code={`Authorization: Bearer <your_jwt_token>`}
                  language="http"
                />
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-700">
                  <strong>Important:</strong> Access tokens expire after 15 minutes. 
                  Use refresh tokens to obtain new access tokens automatically.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Example Request</p>
                <CodeBlock 
                  code={`curl -X GET "https://api.example.com/api/users" \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \\
  -H "Content-Type: application/json"`}
                  language="bash"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Response Format</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock 
                code={`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}`}
                language="json"
              />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { code: '400', title: 'Bad Request', desc: 'Invalid request syntax or parameters' },
              { code: '401', title: 'Unauthorized', desc: 'Missing or invalid authentication' },
              { code: '403', title: 'Forbidden', desc: 'Insufficient permissions' },
              { code: '404', title: 'Not Found', desc: 'Resource does not exist' },
              { code: '429', title: 'Rate Limited', desc: 'Too many requests' },
              { code: '500', title: 'Server Error', desc: 'Internal server error' },
            ].map((error) => (
              <Card key={error.code}>
                <CardContent className="py-4 flex items-start gap-3">
                  <Badge variant="outline" className="text-lg font-mono">{error.code}</Badge>
                  <div>
                    <p className="font-medium">{error.title}</p>
                    <p className="text-sm text-muted-foreground">{error.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ratelimit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>
                API endpoints are rate-limited to prevent abuse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 pr-4 font-semibold">Endpoint Type</th>
                        <th className="text-left py-3 px-4 font-semibold">Rate Limit</th>
                        <th className="text-left py-3 pl-4 font-semibold">Headers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { type: 'Authentication', limit: '5-10/min', headers: 'X-RateLimit-*' },
                        { type: 'Read Operations', limit: '100/min', headers: 'X-RateLimit-*' },
                        { type: 'Write Operations', limit: '50/min', headers: 'X-RateLimit-*' },
                        { type: 'File Uploads', limit: '10/min', headers: 'X-RateLimit-*' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3 pr-4">{row.type}</td>
                          <td className="py-3 px-4"><code>{row.limit}</code></td>
                          <td className="py-3 pl-4 text-muted-foreground">{row.headers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Rate Limit Headers</p>
                  <CodeBlock 
                    code={`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000`}
                    language="http"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
