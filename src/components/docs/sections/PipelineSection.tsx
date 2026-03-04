/**
 * Pipeline Stages Section
 * Comprehensive 14-stage CI/CD pipeline documentation
 */

'use client';

import { useState } from 'react';
import {
  GitBranch,
  Container,
  CheckCircle,
  Shield,
  Rocket,
  Zap,
  ArrowRight,
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Code,
  Lock,
  Search,
  Database,
  Server,
  FileCode,
  Bug,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CodeBlock } from '../shared';
import { SectionHeader } from '../shared';
import { cn } from '@/lib/utils';

// Pipeline phase definitions
const PIPELINE_PHASES = [
  { name: 'Source', color: 'blue', icon: GitBranch, stages: [1, 2] },
  { name: 'Security Scan', color: 'amber', icon: Shield, stages: [3, 4, 5, 6] },
  { name: 'Build & Test', color: 'purple', icon: Container, stages: [7, 8, 9, 10] },
  { name: 'Security Gate', color: 'rose', icon: Lock, stages: [11, 12, 13] },
  { name: 'Deploy', color: 'emerald', icon: Rocket, stages: [14] },
];

// Pipeline stages data
const PIPELINE_STAGES = [
  {
    id: '1',
    name: 'Pre-commit Hooks',
    phase: 'Source',
    order: 1,
    description: 'Local validation before code enters repository. Runs linting, formatting checks, and basic secret detection to catch issues early.',
    detailedDescription: `Pre-commit hooks run on the developer's machine before each commit, providing the fastest feedback loop in the pipeline. This stage catches common issues like formatting errors, linting violations, and potential secret exposures before they even enter the repository.`,
    tools: ['pre-commit', 'husky', 'lint-staged', 'gitleaks', 'detect-secrets'],
    failureAction: 'warn',
    estimatedDuration: '10-30s',
    securityGate: 'Secrets Detection',
    benefits: [
      'Catch 80% of issues before commit',
      'Prevent secrets from entering repository',
      'Enforce code style consistency',
      'Zero CI cost for local checks',
    ],
    codeExample: `# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: check-yaml
      - id: check-json
      - id: detect-private-key
      - id: check-merge-conflict

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  - repo: https://github.com/eslint/eslint
    rev: v8.55.0
    hooks:
      - id: eslint
        files: \\.[jt]sx?$
        types: [file]`,
  },
  {
    id: '2',
    name: 'Source Code Checkout',
    phase: 'Source',
    order: 2,
    description: 'Secure repository clone with verified commit signatures and branch protection validation.',
    detailedDescription: `This stage ensures code integrity by verifying commit signatures and enforcing branch protection rules. It validates that the code comes from trusted sources and hasn't been tampered with during transmission.`,
    tools: ['git', 'commit-signing', 'branch-protection', 'GPG'],
    failureAction: 'fail',
    estimatedDuration: '5-15s',
    securityGate: 'Code Integrity',
    benefits: [
      'Verify code authenticity',
      'Prevent unauthorized code changes',
      'Ensure branch protection compliance',
      'Maintain audit trail',
    ],
    codeExample: `# GitHub Actions - Secure checkout
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          ref: \${{ github.sha }}
          fetch-depth: 0

      - name: Verify commit signature
        run: |
          git verify-commit HEAD
          
      - name: Check branch protection
        run: |
          if [[ "\${{ github.event_name }}" == "pull_request" ]]; then
            gh pr view "\${{ github.event.pull_request.number }}" \\
              --json reviewDecision \\
              --jq '.reviewDecision == "APPROVED"'
          fi`,
  },
  {
    id: '3',
    name: 'SAST - Static Application Security Testing',
    phase: 'Security Scan',
    order: 3,
    description: 'Comprehensive static analysis to identify security vulnerabilities in source code without execution.',
    detailedDescription: `SAST tools analyze source code, bytecode, and binaries without executing the program. They identify security vulnerabilities such as SQL injection, XSS, insecure configurations, and other OWASP Top 10 issues.`,
    tools: ['Semgrep', 'CodeQL', 'SonarQube', 'Bandit', 'ESLint Security'],
    failureAction: 'fail',
    estimatedDuration: '2-5 min',
    securityGate: 'Code Vulnerability Scan',
    benefits: [
      'Find vulnerabilities early in SDLC',
      'Zero runtime overhead',
      'Covers 100% of code paths',
      'Integrates with IDE',
    ],
    codeExample: `# Semgrep CI configuration
semgrep --config=auto --json --output=results.json

# Custom rules for specific vulnerabilities
semgrep --config=p/security-audit \\
        --config=p/secrets \\
        --config=p/owasp-top-ten \\
        --config=p/xss \\
        --config=p/sql-injection

# CodeQL analysis
codeql database create --language=javascript --output=db .
codeql database analyze db --format=sarif-latest --output=results.sarif`,
  },
  {
    id: '4',
    name: 'SCA - Software Composition Analysis',
    phase: 'Security Scan',
    order: 4,
    description: 'Detect known vulnerabilities in third-party dependencies and transitive dependencies.',
    detailedDescription: `SCA tools scan your project's dependencies against known vulnerability databases (NVD, GitHub Advisory, etc.) to identify security issues in third-party packages, including transitive dependencies.`,
    tools: ['Snyk', 'OWASP Dependency-Check', 'npm audit', 'Trivy', 'Renovate'],
    failureAction: 'fail',
    estimatedDuration: '1-3 min',
    securityGate: 'Dependency Vulnerability Scan',
    benefits: [
      'Identify vulnerable dependencies',
      'Track license compliance',
      'Automate dependency updates',
      'Monitor new CVEs',
    ],
    codeExample: `# Trivy filesystem scan
trivy fs . --severity HIGH,CRITICAL \\
  --ignore-unfixed \\
  --format json \\
  --output trivy-results.json

# npm audit with severity filter
npm audit --audit-level=high

# Snyk test
snyk test --severity-threshold=high

# Generate SBOM with Trivy
trivy fs . --format cyclonedx --output sbom.json`,
  },
  {
    id: '5',
    name: 'Secret Scanning',
    phase: 'Security Scan',
    order: 5,
    description: 'Detect hardcoded secrets, API keys, tokens, and credentials in codebase.',
    detailedDescription: `Secret scanning tools detect sensitive information that has been accidentally committed to the repository. They scan both current files and git history to find exposed credentials.`,
    tools: ['Gitleaks', 'TruffleHog', 'Git-secrets', 'detect-secrets', 'Secretlint'],
    failureAction: 'fail',
    estimatedDuration: '30s-1min',
    securityGate: 'Credential Exposure Check',
    benefits: [
      'Prevent credential leaks',
      'Scan entire git history',
      'Detect various secret types',
      'Integrate with secret managers',
    ],
    codeExample: `# Gitleaks comprehensive scan
gitleaks detect --source . \\
  --report-path gitleaks-report.json \\
  --report-format json \\
  --exit-code 1

# TruffleHog with verification
trufflehog git file://. \\
  --only-verified \\
  --json

# detect-secrets baseline
detect-secrets scan > .secrets.baseline
detect-secrets audit .secrets.baseline`,
  },
  {
    id: '6',
    name: 'SBOM Generation',
    phase: 'Security Scan',
    order: 6,
    description: 'Generate Software Bill of Materials documenting all components and their relationships.',
    detailedDescription: `SBOM generation creates a comprehensive inventory of all software components, their versions, and dependencies. This is crucial for supply chain security and compliance with regulations like the US Executive Order on Cybersecurity.`,
    tools: ['Syft', 'CycloneDX', 'SPDX', 'Trivy'],
    failureAction: 'warn',
    estimatedDuration: '30s-1min',
    securityGate: 'Supply Chain Transparency',
    benefits: [
      'Track all dependencies',
      'Meet regulatory requirements',
      'Enable vulnerability tracking',
      'Supply chain visibility',
    ],
    codeExample: `# Syft SBOM generation
syft . -o cyclonedx-json > sbom-cyclonedx.json
syft . -o spdx-json > sbom-spdx.json

# Trivy SBOM
trivy fs . --format cyclonedx --output sbom.json

# Attach SBOM to container image
syft myimage:latest -o cyclonedx-json | \\
  cosign attach sbom --sbom - myimage:latest`,
  },
  {
    id: '7',
    name: 'Build & Compile',
    phase: 'Build & Test',
    order: 7,
    description: 'Secure build process with integrity verification and reproducible builds.',
    detailedDescription: `The build stage compiles the application using secure, reproducible processes. It ensures build integrity through hermetic builds, content-addressable storage, and build attestation.`,
    tools: ['Docker BuildKit', 'Kaniko', 'Buildah', 'Bazel'],
    failureAction: 'fail',
    estimatedDuration: '3-10 min',
    securityGate: 'Build Integrity',
    benefits: [
      'Reproducible builds',
      'Build isolation',
      'Cache optimization',
      'Provenance tracking',
    ],
    codeExample: `# Docker BuildKit build with cache
DOCKER_BUILDKIT=1 docker build \\
  --build-arg BUILDKIT_INLINE_CACHE=1 \\
  --cache-from myimage:cache \\
  --tag myimage:\${{ github.sha }} \\
  --file Dockerfile .

# Kaniko for rootless builds
/kaniko/executor \\
  --dockerfile=Dockerfile \\
  --context=. \\
  --destination=myimage:\${{ github.sha }}

# Build with SBOM and attestation
docker buildx build \\
  --provenance=true \\
  --sbom=true \\
  --tag myimage:\${{ github.sha }} .`,
  },
  {
    id: '8',
    name: 'Container Image Scanning',
    phase: 'Build & Test',
    order: 8,
    description: 'Scan container images for OS vulnerabilities, misconfigurations, and malware.',
    detailedDescription: `Container image scanning examines the built image for vulnerabilities in OS packages, application dependencies, and configuration issues. It's a critical gate before deployment.`,
    tools: ['Trivy', 'Clair', 'Grype', 'Docker Scout', 'Snyk Container'],
    failureAction: 'fail',
    estimatedDuration: '1-3 min',
    securityGate: 'Container Security',
    benefits: [
      'Find OS vulnerabilities',
      'Detect misconfigurations',
      'Scan for secrets in images',
      'License compliance',
    ],
    codeExample: `# Trivy image scan
trivy image myimage:\${{ github.sha }} \\
  --severity HIGH,CRITICAL \\
  --ignore-unfixed \\
  --format json \\
  --output trivy-image-results.json

# Grype scan
grype myimage:\${{ github.sha }} --output json

# Docker Scout
docker scout cves myimage:\${{ github.sha }}`,
  },
  {
    id: '9',
    name: 'IaC Security Scanning',
    phase: 'Build & Test',
    order: 9,
    description: 'Analyze Infrastructure as Code for security misconfigurations and compliance violations.',
    detailedDescription: `IaC scanning tools analyze Terraform, CloudFormation, Kubernetes manifests, and other infrastructure definitions for security issues before deployment.`,
    tools: ['Checkov', 'Terrascan', 'KICS', 'tfsec', 'Trivy IaC'],
    failureAction: 'fail',
    estimatedDuration: '1-2 min',
    securityGate: 'Infrastructure Security',
    benefits: [
      'Prevent misconfigurations',
      'Compliance validation',
      'Cloud security best practices',
      'Cost estimation',
    ],
    codeExample: `# Checkov comprehensive scan
checkov -d ./terraform \\
  --framework terraform \\
  --output json \\
  --output-file checkov-results.json \\
  --check CKV_AWS_*,CKV_GCP_*,CKV_AZURE_*

# Trivy IaC scan
trivy config ./kubernetes \\
  --severity HIGH,CRITICAL

# tfsec
tfsec ./terraform --format json`,
  },
  {
    id: '10',
    name: 'Unit & Integration Tests',
    phase: 'Build & Test',
    order: 10,
    description: 'Execute test suites with security-focused test cases and coverage validation.',
    detailedDescription: `Testing includes not just functional tests, but security-focused tests that validate authentication, authorization, input validation, and other security controls.`,
    tools: ['Jest', 'Vitest', 'Pytest', 'Cypress', 'Playwright'],
    failureAction: 'fail',
    estimatedDuration: '3-10 min',
    securityGate: 'Test Coverage Gate',
    benefits: [
      'Validate security controls',
      'Regression prevention',
      'Coverage enforcement',
      'Fast feedback',
    ],
    codeExample: `# Run tests with coverage
npm run test -- --coverage \\
  --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'

# Security-focused tests
npm run test:security

# E2E tests with Playwright
npx playwright test --project=security-tests`,
  },
  {
    id: '11',
    name: 'DAST - Dynamic Application Security Testing',
    phase: 'Security Gate',
    order: 11,
    description: 'Runtime security testing against running application to find vulnerabilities.',
    detailedDescription: `DAST tools test the running application by sending various inputs and analyzing responses. They can find vulnerabilities that only appear at runtime, such as authentication issues and server configuration problems.`,
    tools: ['OWASP ZAP', 'Burp Suite', 'Nuclei', 'Arachni'],
    failureAction: 'warn',
    estimatedDuration: '5-15 min',
    securityGate: 'Runtime Vulnerability Scan',
    benefits: [
      'Find runtime vulnerabilities',
      'Test authentication flows',
      'API security testing',
      'Real-world attack simulation',
    ],
    codeExample: `# OWASP ZAP baseline scan
docker run -t owasp/zap2docker-stable \\
  zap-baseline.py -t https://myapp.example.com \\
  -r zap-report.html \\
  -w zap-report.md

# Nuclei scan
nuclei -u https://myapp.example.com \\
  -t cves/ -t vulnerabilities/ \\
  -o nuclei-results.txt

# Full ZAP scan
zap-full-scan.py -t https://myapp.example.com`,
  },
  {
    id: '12',
    name: 'Security Policy Evaluation',
    phase: 'Security Gate',
    order: 12,
    description: 'Validate against security policies, compliance frameworks, and organizational standards.',
    detailedDescription: `Policy evaluation ensures that all deployments meet organizational security standards. It uses policy-as-code tools to enforce rules about image sources, configurations, and compliance requirements.`,
    tools: ['OPA Gatekeeper', 'Kyverno', 'Conftest', 'Checkov'],
    failureAction: 'fail',
    estimatedDuration: '30s-1min',
    securityGate: 'Policy Compliance',
    benefits: [
      'Enforce security policies',
      'Compliance automation',
      'Prevent misconfigurations',
      'Audit trail',
    ],
    codeExample: `# Conftest policy check
conftest test ./kubernetes/deployment.yaml \\
  --policy ./policies \\
  --output json

# OPA evaluation
opa eval -d policies/ -i input.json "data.kubernetes.admission"

# Kyverno policy validation
kyverno apply ./policies/ --resource ./deploy.yaml`,
  },
  {
    id: '13',
    name: 'Artifact Signing & Attestation',
    phase: 'Security Gate',
    order: 13,
    description: 'Cryptographically sign artifacts and generate provenance attestations for supply chain security.',
    detailedDescription: `Artifact signing provides cryptographic proof of authenticity and integrity. Attestations provide verifiable claims about the build process, dependencies, and security scans.`,
    tools: ['Cosign', 'Sigstore', 'Tekton Chains', 'in-toto'],
    failureAction: 'fail',
    estimatedDuration: '30s-1min',
    securityGate: 'Artifact Integrity',
    benefits: [
      'Verify artifact authenticity',
      'Supply chain security',
      'Non-repudiation',
      'Build provenance',
    ],
    codeExample: `# Cosign keyless signing
cosign sign --yes myimage:\${{ github.sha }}

# Verify signature
cosign verify myimage:\${{ github.sha }}

# Sign with attestation
cosign attest --predicate sbom.json \\
  --type cyclonedx \\
  myimage:\${{ github.sha }}

# Verify attestations
cosign verify-attestation \\
  --type cyclonedx \\
  myimage:\${{ github.sha }}`,
  },
  {
    id: '14',
    name: 'Secure Deployment',
    phase: 'Deploy',
    order: 14,
    description: 'Deploy to production with zero-downtime, rollback capability, and runtime security hooks.',
    detailedDescription: `The deployment stage uses GitOps principles to deploy verified artifacts to production. It includes canary deployments, automatic rollbacks, and runtime security monitoring.`,
    tools: ['ArgoCD', 'Flux', 'Kubernetes', 'Helm', 'Vault'],
    failureAction: 'fail',
    estimatedDuration: '2-5 min',
    securityGate: 'Deployment Security',
    benefits: [
      'Zero-downtime deployment',
      'Automatic rollback',
      'GitOps workflow',
      'Runtime protection',
    ],
    codeExample: `# ArgoCD sync
argocd app sync myapp \\
  --revision \${{ github.sha }} \\
  --strategy hook

# Helm deployment with secrets
helm upgrade --install myapp ./chart \\
  --set image.tag=\${{ github.sha }} \\
  --set secrets.provider=vault

# Flux GitOps
flux reconcile kustomization myapp \\
  --with-source`,
  },
];

export function PipelineSection() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const filteredStages = selectedPhase 
    ? PIPELINE_STAGES.filter(s => s.phase === selectedPhase)
    : PIPELINE_STAGES;

  return (
    <section id="pipeline" className="scroll-mt-20 space-y-8">
      <SectionHeader
        id="pipeline"
        title="Pipeline Stages"
        description="14-stage security-hardened CI/CD pipeline"
        icon={GitBranch}
        iconColor="text-blue-500"
      />

      {/* Pipeline Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Pipeline Flow
          </CardTitle>
          <CardDescription>
            Visual representation of the complete CI/CD pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2">
            {PIPELINE_PHASES.map((phase, idx) => (
              <div key={phase.name} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => setSelectedPhase(selectedPhase === phase.name ? null : phase.name)}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-xl transition-all cursor-pointer',
                    selectedPhase === phase.name 
                      ? `bg-${phase.color}-100 ring-2 ring-${phase.color}-500` 
                      : 'hover:bg-muted/50'
                  )}
                >
                  <div className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center',
                    `bg-${phase.color}-100 text-${phase.color}-600`
                  )}>
                    <phase.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs mt-2 font-medium">{phase.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {phase.stages.length} stages
                  </span>
                </button>
                {idx < PIPELINE_PHASES.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-3 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          {selectedPhase && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedPhase(null)}>
                Show all stages
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Details</CardTitle>
          <CardDescription>
            Click each stage to view details, tools, benefits, and code examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {filteredStages.map((stage) => {
              const phase = PIPELINE_PHASES.find(p => p.name === stage.phase);
              return (
                <AccordionItem 
                  key={stage.id} 
                  value={stage.id}
                  className="border rounded-xl px-4 data-[state=open]:bg-muted/30"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold',
                        `bg-${phase?.color}-500 text-white`
                      )}>
                        {stage.order}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{stage.name}</span>
                          <Badge variant="outline" className={cn(
                            'text-[10px]',
                            `border-${phase?.color}-300 text-${phase?.color}-600`
                          )}>
                            {stage.phase}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px]',
                              stage.failureAction === 'fail'
                                ? 'border-rose-300 text-rose-600'
                                : 'border-amber-300 text-amber-600'
                            )}
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
                    <div className="space-y-4 pl-13">
                      {/* Description */}
                      <p className="text-muted-foreground">{stage.detailedDescription}</p>

                      {/* Security Gate */}
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Security Gate:</span>
                        <Badge variant="secondary">{stage.securityGate}</Badge>
                      </div>

                      {/* Tools */}
                      <div>
                        <p className="text-sm font-medium mb-2">Tools:</p>
                        <div className="flex flex-wrap gap-2">
                          {stage.tools.map((tool) => (
                            <Badge key={tool} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <p className="text-sm font-medium mb-2">Benefits:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {stage.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Code Example */}
                      {stage.codeExample && (
                        <div>
                          <p className="text-sm font-medium mb-2">Example Configuration:</p>
                          <CodeBlock code={stage.codeExample} language="yaml" />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Pipeline Best Practices */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Pipeline Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-emerald-600">Do's ✓</h4>
              <ul className="text-sm space-y-2">
                {[
                  'Fail fast - run quick checks first',
                  'Cache dependencies between runs',
                  'Use parallel execution where possible',
                  'Set clear severity thresholds',
                  'Track metrics and trends',
                  'Integrate with issue trackers',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-rose-600">Don'ts ✗</h4>
              <ul className="text-sm space-y-2">
                {[
                  'Skip security scans for speed',
                  'Ignore warning-level findings',
                  'Run all scans sequentially',
                  'Hardcode credentials in pipelines',
                  'Disable failing tests',
                  'Skip signature verification',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
