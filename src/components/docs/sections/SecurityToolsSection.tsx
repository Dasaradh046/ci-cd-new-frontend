/**
 * Security Tools Section
 * Documentation for all security tools used in the pipeline
 */

'use client';

import {
  Search,
  ExternalLink,
  Terminal,
  Shield,
  Lock,
  Container,
  FileCode,
  Key,
  Database,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '../shared';
import { SectionHeader } from '../shared';
import { cn } from '@/lib/utils';

const SECURITY_TOOLS = [
  {
    name: 'Trivy',
    category: 'Container & SCA',
    icon: Container,
    color: 'blue',
    description: 'Comprehensive scanner for container images, filesystems, Git repositories, and Kubernetes clusters. Detects OS packages, language-specific dependencies, and IaC misconfigurations.',
    documentationUrl: 'https://aquasecurity.github.io/trivy/',
    features: ['CVE Database', 'License Detection', 'Secret Detection', 'SBOM Generation', 'Compliance Checks'],
    install: 'brew install trivy',
    usage: `# Scan container image
trivy image myimage:latest

# Scan filesystem
trivy fs .

# Scan Kubernetes cluster
trivy k8s --report summary

# Generate SBOM
trivy image --format cyclonedx myimage:latest`,
  },
  {
    name: 'Semgrep',
    category: 'SAST',
    icon: Search,
    color: 'purple',
    description: 'Fast, open-source static analysis tool for finding bugs, detecting vulnerabilities, and enforcing code standards. Uses pattern-based matching with minimal false positives.',
    documentationUrl: 'https://semgrep.dev/docs/',
    features: ['Custom Rules', 'Language Agnostic', 'CI/CD Integration', 'Auto-fix Suggestions', 'IDE Plugin'],
    install: 'brew install semgrep',
    usage: `# Scan with auto-detected rules
semgrep --config=auto .

# Scan with custom rules
semgrep --config=p/security-audit \\
        --config=p/owasp-top-ten

# Output as JSON
semgrep --json --output=results.json`,
  },
  {
    name: 'Gitleaks',
    category: 'Secret Scanning',
    icon: Key,
    color: 'amber',
    description: 'Tool for detecting secrets like passwords, API keys, and tokens in git repositories. Scans entire commit history for exposed credentials.',
    documentationUrl: 'https://gitleaks.io/',
    features: ['Regex Detection', 'Custom Rules', 'Pre-commit Hooks', 'Git History Scan', 'Multiple Formats'],
    install: 'brew install gitleaks',
    usage: `# Scan current directory
gitleaks detect --source .

# Scan git history
gitleaks detect --source . --log-opts="--all"

# Output as JSON
gitleaks detect --source . --report-format json --report-path report.json`,
  },
  {
    name: 'OWASP ZAP',
    category: 'DAST',
    icon: Shield,
    color: 'emerald',
    description: 'Free, open-source web application security scanner. Automated scanners and tools for finding security vulnerabilities in running applications.',
    documentationUrl: 'https://www.zaproxy.org/docs/',
    features: ['Active Scanning', 'Passive Scanning', 'API Testing', 'Authentication Support', 'CI/CD Integration'],
    install: 'brew install zap',
    usage: `# Baseline scan
zap-baseline.py -t https://example.com

# Full scan
zap-full-scan.py -t https://example.com

# API scan
zap-api-scan.py -t https://api.example.com -f openapi`,
  },
  {
    name: 'Cosign',
    category: 'Signing',
    icon: Lock,
    color: 'rose',
    description: 'Container signing and verification tool from Sigstore. Enables keyless signing with OIDC tokens for supply chain security.',
    documentationUrl: 'https://docs.sigstore.dev/cosign/signing/signing_with_containers/',
    features: ['Keyless Signing', 'Policy Enforcement', 'Attestation', 'Transparency Log', 'Multi-arch Support'],
    install: 'brew install cosign',
    usage: `# Keyless signing
cosign sign myimage:latest

# Verify signature
cosign verify myimage:latest

# Sign with attestation
cosign attest --predicate sbom.json \\
  --type cyclonedx myimage:latest`,
  },
  {
    name: 'Syft',
    category: 'SBOM',
    icon: Database,
    color: 'cyan',
    description: 'CLI tool for generating Software Bill of Materials (SBOM) from container images and filesystems. Supports multiple output formats.',
    documentationUrl: 'https://github.com/anchore/syft',
    features: ['CycloneDX', 'SPDX', 'JSON Output', 'Dependency Graph', 'Multiple Sources'],
    install: 'brew install syft',
    usage: `# Generate SBOM from image
syft myimage:latest

# Output as CycloneDX
syft myimage:latest -o cyclonedx-json > sbom.json

# Output as SPDX
syft myimage:latest -o spdx-json > sbom-spdx.json`,
  },
  {
    name: 'Checkov',
    category: 'IaC Security',
    icon: FileCode,
    color: 'orange',
    description: 'Scans IaC files (Terraform, CloudFormation, Kubernetes, Helm, Docker) for security and compliance misconfigurations.',
    documentationUrl: 'https://www.checkov.io/1.Welcome/Quick%20Start.html',
    features: ['Terraform Scanning', 'Kubernetes Policies', 'Custom Policies', 'Compliance Frameworks', 'Remediation'],
    install: 'pip install checkov',
    usage: `# Scan directory
checkov -d ./terraform

# Scan specific file
checkov -f main.tf

# Output as JSON
checkov -d ./terraform -o json`,
  },
  {
    name: 'Snyk',
    category: 'SCA',
    icon: Zap,
    color: 'violet',
    description: 'Developer-first security platform for finding and fixing vulnerabilities in code, dependencies, containers, and infrastructure.',
    documentationUrl: 'https://docs.snyk.io/',
    features: ['Real-time Monitoring', 'Auto-fix PRs', 'License Compliance', 'Priority Score', 'IDE Integration'],
    install: 'npm install -g snyk',
    usage: `# Test for vulnerabilities
snyk test

# Monitor project
snyk monitor

# Test container image
snyk container test myimage:latest`,
  },
];

const TOOL_CATEGORIES = [
  { name: 'SAST', description: 'Static Application Security Testing', color: 'purple' },
  { name: 'SCA', description: 'Software Composition Analysis', color: 'blue' },
  { name: 'DAST', description: 'Dynamic Application Security Testing', color: 'emerald' },
  { name: 'Secret Scanning', description: 'Credential and secret detection', color: 'amber' },
  { name: 'Container & SCA', description: 'Container and dependency scanning', color: 'blue' },
  { name: 'Signing', description: 'Artifact signing and verification', color: 'rose' },
  { name: 'SBOM', description: 'Software Bill of Materials', color: 'cyan' },
  { name: 'IaC Security', description: 'Infrastructure as Code scanning', color: 'orange' },
];

export function SecurityToolsSection() {
  return (
    <section id="tools" className="scroll-mt-20 space-y-8">
      <SectionHeader
        id="tools"
        title="Security Tools"
        description="Comprehensive toolkit for DevSecOps security scanning"
        icon={Terminal}
        iconColor="text-purple-500"
      />

      {/* Tool Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Tool Categories</CardTitle>
          <CardDescription>
            Security tools organized by their primary function
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TOOL_CATEGORIES.map((cat) => (
              <div 
                key={cat.name}
                className={cn(
                  'p-3 rounded-xl border',
                  `bg-${cat.color}-50 border-${cat.color}-200`
                )}
              >
                <p className={`font-medium text-${cat.color}-700`}>{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {SECURITY_TOOLS.map((tool) => (
          <Card key={tool.name} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2.5 rounded-xl',
                    `bg-${tool.color}-100`
                  )}>
                    <tool.icon className={cn('h-5 w-5', `text-${tool.color}-600`)} />
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">{tool.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{tool.description}</p>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Key Features</p>
                <div className="flex flex-wrap gap-1">
                  {tool.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Install</p>
                <CodeBlock code={tool.install} />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Common Usage</p>
                <CodeBlock code={tool.usage} />
              </div>

              <a
                href={tool.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Official Documentation
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tool Selection Guide */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Tool Selection Guide</CardTitle>
          <CardDescription>
            Recommended tools based on your security requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium mb-2">🚀 Quick Setup</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Trivy (containers)</li>
                <li>• Semgrep (SAST)</li>
                <li>• Gitleaks (secrets)</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium mb-2">🏢 Enterprise</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Snyk (full platform)</li>
                <li>• SonarQube (SAST)</li>
                <li>• Checkov (IaC)</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium mb-2">🔒 Supply Chain</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cosign (signing)</li>
                <li>• Syft (SBOM)</li>
                <li>• in-toto (attestation)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
