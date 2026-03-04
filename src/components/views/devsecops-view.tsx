/**
 * DevSecOps Documentation View
 * Comprehensive real DevSecOps Tier-3 Pipeline Documentation
 */

'use client';

import { useState } from 'react';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  GitBranch,
  Lock,
  Key,
  Database,
  Users,
  Activity,
  Container,
  FileSearch,
  Bug,
  Scan,
  FileText,
  Settings,
  ArrowRight,
  ExternalLink,
  Clock,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useFetchWithFallback } from '@/lib/hooks';
import { getDevSecOpsDoc } from '@/lib/api';
import { DashboardSkeleton, MockDataBadge, PageHeader } from '@/components/shared';

// Pipeline Stage Data
const PIPELINE_STAGES = [
  {
    id: '1',
    name: 'Pre-commit Hooks',
    order: 1,
    description: 'Local validation before code enters repository. Runs linting, formatting checks, and basic secret detection.',
    tools: ['pre-commit', 'husky', 'lint-staged', 'gitleaks', 'detect-secrets'],
    failureAction: 'warn',
    estimatedDuration: '10-30s',
    securityGate: 'Secrets Detection',
  },
  {
    id: '2',
    name: 'Source Code Checkout',
    order: 2,
    description: 'Secure repository clone with verified commit signatures and branch protection validation.',
    tools: ['git', 'commit-signing', 'branch-protection'],
    failureAction: 'fail',
    estimatedDuration: '5-15s',
    securityGate: 'Code Integrity',
  },
  {
    id: '3',
    name: 'SAST - Static Application Security Testing',
    order: 3,
    description: 'Comprehensive static analysis to identify security vulnerabilities in source code without execution.',
    tools: ['Semgrep', 'CodeQL', 'SonarQube', 'Bandit (Python)', 'ESLint Security'],
    failureAction: 'fail',
    estimatedDuration: '2-5 min',
    securityGate: 'Code Vulnerability Scan',
  },
  {
    id: '4',
    name: 'SCA - Software Composition Analysis',
    order: 4,
    description: 'Detect known vulnerabilities in third-party dependencies and transitive dependencies.',
    tools: ['Snyk', 'OWASP Dependency-Check', 'npm audit', 'Safety (Python)', 'Trivy'],
    failureAction: 'fail',
    estimatedDuration: '1-3 min',
    securityGate: 'Dependency Vulnerability Scan',
  },
  {
    id: '5',
    name: 'Secret Scanning',
    order: 5,
    description: 'Detect hardcoded secrets, API keys, tokens, and credentials in codebase.',
    tools: ['Gitleaks', 'TruffleHog', 'Git-secrets', 'detect-secrets', 'Secretlint'],
    failureAction: 'fail',
    estimatedDuration: '30s-1min',
    securityGate: 'Credential Exposure Check',
  },
  {
    id: '6',
    name: 'SBOM Generation',
    order: 6,
    description: 'Generate Software Bill of Materials documenting all components and their relationships.',
    tools: ['Syft', 'CycloneDX', 'SPDX', 'Trivy'],
    failureAction: 'warn',
    estimatedDuration: '30s-1min',
    securityGate: 'Supply Chain Transparency',
  },
  {
    id: '7',
    name: 'Build & Compile',
    order: 7,
    description: 'Secure build process with integrity verification and reproducible builds.',
    tools: ['Docker BuildKit', 'Kaniko', 'Buildah', 'multi-stage builds'],
    failureAction: 'fail',
    estimatedDuration: '3-10 min',
    securityGate: 'Build Integrity',
  },
  {
    id: '8',
    name: 'Container Image Scanning',
    order: 8,
    description: 'Scan container images for OS vulnerabilities, misconfigurations, and malware.',
    tools: ['Trivy', 'Clair', 'Grype', 'Docker Scout', 'Snyk Container'],
    failureAction: 'fail',
    estimatedDuration: '1-3 min',
    securityGate: 'Container Security',
  },
  {
    id: '9',
    name: 'IaC Security Scanning',
    order: 9,
    description: 'Analyze Infrastructure as Code for security misconfigurations and compliance violations.',
    tools: ['Checkov', 'Terrascan', 'KICS', 'tfsec', 'Trivy IaC'],
    failureAction: 'fail',
    estimatedDuration: '1-2 min',
    securityGate: 'Infrastructure Security',
  },
  {
    id: '10',
    name: 'Unit & Integration Tests',
    order: 10,
    description: 'Execute test suites with security-focused test cases and coverage validation.',
    tools: ['Jest', 'Vitest', 'Pytest', 'Junit', 'Cypress'],
    failureAction: 'fail',
    estimatedDuration: '3-10 min',
    securityGate: 'Test Coverage Gate',
  },
  {
    id: '11',
    name: 'DAST - Dynamic Application Security Testing',
    order: 11,
    description: 'Runtime security testing against running application to find vulnerabilities.',
    tools: ['OWASP ZAP', 'Burp Suite', 'Nuclei', 'Arachni', 'w3af'],
    failureAction: 'warn',
    estimatedDuration: '5-15 min',
    securityGate: 'Runtime Vulnerability Scan',
  },
  {
    id: '12',
    name: 'Security Policy Evaluation',
    order: 12,
    description: 'Validate against security policies, compliance frameworks, and organizational standards.',
    tools: ['OPA Gatekeeper', 'Kyverno', 'Conftest', 'Checkov'],
    failureAction: 'fail',
    estimatedDuration: '30s-1min',
    securityGate: 'Policy Compliance',
  },
  {
    id: '13',
    name: 'Artifact Signing & Attestation',
    order: 13,
    description: 'Cryptographically sign artifacts and generate provenance attestations for supply chain security.',
    tools: ['Cosign', 'Sigstore', 'Tekton Chains', 'in-toto'],
    failureAction: 'fail',
    estimatedDuration: '30s-1min',
    securityGate: 'Artifact Integrity',
  },
  {
    id: '14',
    name: 'Secure Deployment',
    order: 14,
    description: 'Deploy to production with zero-downtime, rollback capability, and runtime security hooks.',
    tools: ['ArgoCD', 'Flux', 'Kubernetes', 'Helm', 'Vault'],
    failureAction: 'fail',
    estimatedDuration: '2-5 min',
    securityGate: 'Deployment Security',
  },
];

// Security Tools Detail
const SECURITY_TOOLS = [
  {
    name: 'Trivy',
    category: 'Container & SCA',
    description: 'Comprehensive scanner for container images, filesystems, Git repositories, and Kubernetes clusters. Detects OS packages, language-specific dependencies, and IaC misconfigurations.',
    documentationUrl: 'https://aquasecurity.github.io/trivy/',
    features: ['CVE Database', 'License Detection', 'Secret Detection', 'SBOM Generation', 'Compliance Checks'],
  },
  {
    name: 'Semgrep',
    category: 'SAST',
    description: 'Fast, open-source static analysis tool for finding bugs, detecting vulnerabilities, and enforcing code standards. Uses pattern-based matching with minimal false positives.',
    documentationUrl: 'https://semgrep.dev/docs/',
    features: ['Custom Rules', 'Language Agnostic', 'CI/CD Integration', 'Auto-fix Suggestions'],
  },
  {
    name: 'Gitleaks',
    category: 'Secret Scanning',
    description: 'Tool for detecting secrets like passwords, API keys, and tokens in git repositories. Scans entire commit history for exposed credentials.',
    documentationUrl: 'https://gitleaks.io/',
    features: ['Regex Detection', 'Custom Rules', 'Pre-commit Hooks', 'Git History Scan'],
  },
  {
    name: 'OWASP ZAP',
    category: 'DAST',
    description: 'Free, open-source web application security scanner. Automated scanners and tools for finding security vulnerabilities.',
    documentationUrl: 'https://www.zaproxy.org/docs/',
    features: ['Active Scanning', 'Passive Scanning', 'API Testing', 'Authentication Support'],
  },
  {
    name: 'Cosign',
    category: 'Signing',
    description: 'Container signing and verification tool from Sigstore. Enables keyless signing with OIDC tokens for supply chain security.',
    documentationUrl: 'https://docs.sigstore.dev/cosign/signing/signing_with_containers/',
    features: ['Keyless Signing', 'Policy Enforcement', 'Attestation', 'Transparency Log'],
  },
  {
    name: 'Syft',
    category: 'SBOM',
    description: 'CLI tool for generating Software Bill of Materials (SBOM) from container images and filesystems. Supports multiple formats.',
    documentationUrl: 'https://github.com/anchore/syft',
    features: ['CycloneDX', 'SPDX', 'JSON Output', 'Dependency Graph'],
  },
  {
    name: 'Checkov',
    category: 'IaC Security',
    description: 'Scans IaC files (Terraform, CloudFormation, Kubernetes, Helm, Docker) for security and compliance misconfigurations.',
    documentationUrl: 'https://www.checkov.io/1.Welcome/Quick%20Start.html',
    features: ['Terraform Scanning', 'Kubernetes Policies', 'Custom Policies', 'Compliance Frameworks'],
  },
  {
    name: 'Snyk',
    category: 'SCA',
    description: 'Developer-first security platform for finding and fixing vulnerabilities in code, dependencies, containers, and infrastructure.',
    documentationUrl: 'https://docs.snyk.io/',
    features: ['Real-time Monitoring', 'Auto-fix PRs', 'License Compliance', 'Priority Score'],
  },
];

// Compliance Frameworks
const COMPLIANCE_FRAMEWORKS = [
  {
    name: 'SOC 2 Type II',
    description: 'Service Organization Control 2 - Security, Availability, Processing Integrity, Confidentiality, and Privacy controls.',
    requirements: ['Access Controls', 'Encryption', 'Monitoring', 'Incident Response', 'Change Management'],
  },
  {
    name: 'ISO 27001',
    description: 'International standard for information security management systems (ISMS).',
    requirements: ['Risk Assessment', 'Security Policy', 'Asset Management', 'Access Control', 'Cryptography'],
  },
  {
    name: 'GDPR',
    description: 'General Data Protection Regulation - EU data protection and privacy law.',
    requirements: ['Data Minimization', 'Consent', 'Right to Access', 'Right to Erasure', 'Data Portability'],
  },
  {
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard for organizations handling credit cards.',
    requirements: ['Network Security', 'Access Control', 'Encryption', 'Vulnerability Management', 'Monitoring'],
  },
  {
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act for healthcare data protection.',
    requirements: ['PHI Protection', 'Access Controls', 'Audit Controls', 'Transmission Security', 'Breach Notification'],
  },
];

export function DevSecOpsView() {
  const { data, isLoading, isMock } = useFetchWithFallback(
    () => getDevSecOpsDoc(),
    []
  );

  const [activeSection, setActiveSection] = useState('pipeline');

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="DevSecOps Documentation"
        description="Tier-3 CI/CD Pipeline with Security-First Architecture"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Tier-3 Pipeline
            </Badge>
            {isMock && <MockDataBadge isMock={isMock} />}
          </div>
        }
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">14</p>
                <p className="text-sm text-muted-foreground">Pipeline Stages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Security Tools</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Compliance Standards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-sm text-muted-foreground">Pipeline Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="security">Security Controls</TabsTrigger>
          <TabsTrigger value="tools">Security Tools</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Pipeline Stages Tab */}
        <TabsContent value="pipeline" className="mt-6 space-y-6">
          {/* Pipeline Flow Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                CI/CD Pipeline Flow
              </CardTitle>
              <CardDescription>
                14-stage security-hardened pipeline with gates at every step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2">
                {['Code', 'Build', 'Test', 'Security', 'Deploy'].map((stage, idx) => (
                  <div key={stage} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        idx < 2 ? 'bg-primary/10 text-primary' :
                        idx < 3 ? 'bg-success/10 text-success' :
                        idx < 4 ? 'bg-warning/10 text-warning' :
                        'bg-accent/10 text-accent'
                      }`}>
                        {idx === 0 && <GitBranch className="h-5 w-5" />}
                        {idx === 1 && <Container className="h-5 w-5" />}
                        {idx === 2 && <CheckCircle className="h-5 w-5" />}
                        {idx === 3 && <Shield className="h-5 w-5" />}
                        {idx === 4 && <ArrowRight className="h-5 w-5" />}
                      </div>
                      <span className="text-xs mt-2 font-medium">{stage}</span>
                    </div>
                    {idx < 4 && (
                      <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Stages Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Stages Detail</CardTitle>
              <CardDescription>
                Click each stage to view details, tools, and security gates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {PIPELINE_STAGES.map((stage) => (
                  <AccordionItem 
                    key={stage.id} 
                    value={stage.id}
                    className="border rounded-xl px-4 data-[state=open]:bg-muted/30"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {stage.order}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{stage.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                stage.failureAction === 'fail'
                                  ? 'border-destructive/50 text-destructive'
                                  : 'border-warning/50 text-warning'
                              }
                            >
                              {stage.failureAction === 'fail' ? 'Must Pass' : 'Warning'}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {stage.estimatedDuration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4 pl-14">
                        <p className="text-muted-foreground">{stage.description}</p>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Security Gate:</span>
                          <Badge variant="secondary">{stage.securityGate}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {stage.tools.map((tool) => (
                            <Badge key={tool} variant="outline">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Controls Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          {/* JWT Authentication Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                JWT RS256 Authentication
              </CardTitle>
              <CardDescription>
                Asymmetric encryption for secure token-based authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Access Token
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      3072-bit RSA key pair
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      15-minute expiration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      HTTP-only cookie storage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Contains user claims & roles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Signed with RS256 algorithm
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Refresh Token
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Secure rotation mechanism
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      7-day expiration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Single-use tokens
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Database-tracked sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Automatic token renewal
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h4 className="font-semibold mb-2">Token Flow</h4>
                <code className="text-xs block bg-muted p-3 rounded-lg overflow-x-auto">
                  {`1. Client sends credentials → Server validates
2. Server generates Access Token (RS256) + Refresh Token
3. Access Token: HTTP-only cookie, 15min TTL
4. Refresh Token: HTTP-only cookie, 7 days TTL, stored in DB
5. On Access Token expiry → Client uses Refresh Token
6. Server validates, issues new Access Token, rotates Refresh Token
7. Old Refresh Token invalidated (prevents replay attacks)`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Encryption Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                Encryption Strategy
              </CardTitle>
              <CardDescription>
                Data protection at rest and in transit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">AES-256-GCM (Fernet)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Symmetric encryption for PII data at rest using the Fernet specification. 
                      Provides built-in authentication, preventing tampering attacks.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">User emails</Badge>
                      <Badge variant="outline">Phone numbers</Badge>
                      <Badge variant="outline">Personal identifiers</Badge>
                      <Badge variant="outline">API keys</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">TLS 1.3</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      All data in transit encrypted using TLS 1.3 with strong cipher suites.
                      HSTS enabled with 1-year max-age and includeSubDomains.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">TLS_AES_256_GCM_SHA384</Badge>
                      <Badge variant="outline">TLS_CHACHA20_POLY1305_SHA256</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <div className="flex items-start gap-3">
                  <Key className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Key Management</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Encryption keys stored in HashiCorp Vault with automatic rotation.
                      Master key never stored in application code or database.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">90-day rotation</Badge>
                      <Badge variant="outline">Vault transit engine</Badge>
                      <Badge variant="outline">HSM-backed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RBAC Model */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                RBAC Security Model
              </CardTitle>
              <CardDescription>
                Role-based access control with granular permissions
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
                    <tr className="border-b bg-muted/30">
                      <td className="py-3 pr-4 font-medium">SUPER_ADMIN</td>
                      <td className="py-3 px-4"><Badge className="bg-destructive">5</Badge></td>
                      <td className="py-3 px-4">All permissions</td>
                      <td className="py-3 pl-4 text-muted-foreground">Full system access</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4 font-medium">ADMIN</td>
                      <td className="py-3 px-4"><Badge className="bg-primary">4</Badge></td>
                      <td className="py-3 px-4">Users, Roles, Files</td>
                      <td className="py-3 pl-4 text-muted-foreground">Admin operations</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="py-3 pr-4 font-medium">MANAGER</td>
                      <td className="py-3 px-4"><Badge className="bg-success">3</Badge></td>
                      <td className="py-3 px-4">Team, Files</td>
                      <td className="py-3 pl-4 text-muted-foreground">Team management</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4 font-medium">USER</td>
                      <td className="py-3 px-4"><Badge className="bg-accent">2</Badge></td>
                      <td className="py-3 px-4">Own data, Files</td>
                      <td className="py-3 pl-4 text-muted-foreground">Standard access</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="py-3 pr-4 font-medium">GUEST</td>
                      <td className="py-3 px-4"><Badge variant="outline">1</Badge></td>
                      <td className="py-3 px-4">View only</td>
                      <td className="py-3 pl-4 text-muted-foreground">Limited access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CSRF & Security Headers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                Security Headers & CSRF Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2">Content Security Policy (CSP)</h4>
                  <code className="text-xs block bg-background p-3 rounded-lg overflow-x-auto">
{`Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';`}
                  </code>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2">CSRF Protection</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SameSite=Strict cookie attribute</li>
                    <li>• XSRF token validation on state-changing operations</li>
                    <li>• Origin header verification</li>
                    <li>• Double-submit cookie pattern for API routes</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2">Additional Security Headers</h4>
                  <code className="text-xs block bg-background p-3 rounded-lg overflow-x-auto">
{`X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tools Tab */}
        <TabsContent value="tools" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {SECURITY_TOOLS.map((tool) => (
              <Card key={tool.name} className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <Badge variant="outline">
                      {tool.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <a
                    href={tool.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    View Documentation
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="mt-6 space-y-6">
          {COMPLIANCE_FRAMEWORKS.map((framework) => (
            <Card key={framework.name}>
              <CardHeader>
                <CardTitle>{framework.name}</CardTitle>
                <CardDescription>{framework.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {framework.requirements.map((req) => (
                    <div key={req} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* GDPR Data Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                GDPR Data Subject Rights
              </CardTitle>
              <CardDescription>
                Implementation of data subject rights under GDPR Article 15-22
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="access">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Right to Access (Article 15)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Users can request a complete copy of their personal data. Our system provides 
                      an export feature that generates a JSON/ZIP file containing all user data, 
                      including profile information, activity logs, and associated records.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rectification">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Right to Rectification (Article 16)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Users can update their personal data through the profile settings. The system 
                      maintains an audit trail of all changes, allowing users to verify corrections 
                      have been applied.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="erasure">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Right to Erasure (Article 17)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Users can request complete account deletion. The system performs a soft delete 
                      initially, followed by permanent deletion after a 30-day grace period. All 
                      associated data is anonymized or deleted in compliance with retention policies.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="portability">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Right to Data Portability (Article 20)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Data exports are provided in machine-readable JSON format, allowing users to 
                      transfer their data to another service provider. The export includes all 
                      user-provided data in a structured, interoperable format.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="retention">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" />
                      Data Retention Policy
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• User data: Retained for account duration + 30 days</li>
                      <li>• Audit logs: Retained for 2 years (compliance requirement)</li>
                      <li>• Security events: Retained for 1 year</li>
                      <li>• Session data: Deleted on logout or after 7 days inactivity</li>
                      <li>• Backup data: 90-day retention with encryption at rest</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* PCI-DSS Considerations */}
          <Card className="border-warning/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                PCI-DSS Considerations
              </CardTitle>
              <CardDescription>
                Payment Card Industry Data Security Standard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                <p className="text-sm">
                  <strong>Important:</strong> This application does not directly handle payment card data. 
                  For PCI compliance, integrate with a PCI-DSS compliant payment processor such as Stripe, 
                  PayPal, or Braintree.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2 text-success">Implemented</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Secure network architecture</li>
                    <li>✓ Access control measures</li>
                    <li>✓ Security monitoring & logging</li>
                    <li>✓ Vulnerability management</li>
                    <li>✓ Encryption in transit</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2 text-muted-foreground">External (Payment Processor)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Payment processing</li>
                    <li>• Cardholder data storage</li>
                    <li>• PCI assessment</li>
                    <li>• Card data encryption</li>
                    <li>• Secure card handling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
