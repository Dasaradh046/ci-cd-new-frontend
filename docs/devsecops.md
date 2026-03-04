# DevSecOps Pipeline Documentation

## Overview

This document describes the Tier-3 DevSecOps CI/CD pipeline implemented for the DevSecOps Platform. The pipeline enforces security gates at every stage, ensuring that only secure, tested, and compliant code reaches production.

## Pipeline Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Format    │───▶│  Type Check │───▶│ Unit Tests  │───▶│    SAST     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│    Deploy   │◀───│  Health     │◀───│   E2E       │◀─────────┘
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│    SBOM     │◀───│Image Scan   │◀───│  Container  │◀─────────┘
└─────────────┘    └─────────────┘    └─────────────┘
```

## Pipeline Stages

### Stage 1: Format Check
**Tool**: ESLint + Prettier
**Duration**: ~30 seconds
**Failure Action**: Block

Validates code formatting and style consistency.

```yaml
- name: Check formatting
  run: bun run lint
```

### Stage 2: Type Check
**Tool**: TypeScript Compiler
**Duration**: ~1 minute
**Failure Action**: Block

Ensures TypeScript type safety.

```yaml
- name: Type check
  run: bun run type-check
```

### Stage 3: Unit Tests
**Tool**: Jest + React Testing Library
**Duration**: ~2 minutes
**Coverage Threshold**: 80%
**Failure Action**: Block

Runs unit tests with coverage enforcement.

```yaml
- name: Run unit tests
  run: bun run test
```

### Stage 4: SAST (Static Application Security Testing)
**Tool**: Semgrep
**Duration**: ~2 minutes
**Failure Action**: Block on Critical/High

Static code analysis for security vulnerabilities.

**Rulesets**:
- `p/security-audit` - General security patterns
- `p/secrets` - Secret detection
- `p/owasp-top-ten` - OWASP vulnerabilities

```yaml
- name: Run Semgrep
  uses: returntocorp/semgrep-action@v1
  with:
    config: p/security-audit p/secrets p/owasp-top-ten
```

### Stage 5: Secret Scanning
**Tool**: Gitleaks
**Duration**: ~30 seconds
**Failure Action**: Block

Scans git history for exposed secrets and credentials.

```yaml
- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@v2
```

### Stage 6: SCA (Software Composition Analysis)
**Tool**: Trivy
**Duration**: ~1 minute
**Failure Action**: Block on Critical/High

Scans dependencies for known vulnerabilities.

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'fs'
    severity: 'CRITICAL,HIGH'
```

### Stage 7: Build
**Tool**: Next.js
**Duration**: ~3 minutes
**Failure Action**: Block

Production build generation.

```yaml
- name: Build application
  run: bun run build
```

### Stage 8: Container Build
**Tool**: Docker BuildKit
**Duration**: ~5 minutes
**Failure Action**: Block

Multi-stage Docker image build.

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
```

### Stage 9: Container Image Scan
**Tool**: Trivy
**Duration**: ~2 minutes
**Failure Action**: Block on Critical/High

Scans container image for OS and package vulnerabilities.

```yaml
- name: Run Trivy container scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'ghcr.io/${{ github.repository }}:${{ github.sha }}'
```

### Stage 10: SBOM Generation
**Tool**: CycloneDX
**Duration**: ~1 minute
**Failure Action**: Warn

Generates Software Bill of Materials.

```yaml
- name: Generate SBOM
  uses: anchore/sbom-action@v0
  with:
    format: spdx-json
```

### Stage 11: E2E Tests
**Tool**: Playwright
**Duration**: ~5 minutes
**Failure Action**: Block

End-to-end testing against containerized application.

```yaml
- name: Run E2E tests
  run: bun run test:e2e
```

### Stage 12: Deploy
**Tool**: Kubernetes / ArgoCD
**Duration**: ~2 minutes
**Failure Action**: Block

Deploys to target environment.

### Stage 13: Health Check
**Tool**: Custom health check
**Duration**: ~30 seconds
**Failure Action**: Rollback

Post-deployment verification.

## Security Tools Configuration

### Semgrep Rules

Custom rules are defined in `.semgrep/rules.yaml`:

```yaml
rules:
  - id: jwt-hardcoded-secret
    patterns:
      - pattern: jwt.sign($PAYLOAD, "...")
    message: "Hardcoded JWT secret detected"
    severity: ERROR
```

### Trivy Configuration

Configured in `trivy.yaml`:

```yaml
severity: CRITICAL,HIGH
ignore-unfixed: true
vuln-type: os,library
```

### Gitleaks Configuration

Configured in `.gitleaks.toml`:

```toml
[extend]
useDefault = true

[[rules]]
id = "api-key"
description = "API Key"
regex = '''(?i)(api[_-]?key|apikey)['\"]?\s*[:=]\s*['\"]?[a-zA-Z0-9]{32,}'''
tags = ["api", "key"]
```

## Compliance Mapping

### SOC 2 Type II
| Control | Pipeline Stage |
|---------|----------------|
| CC6.1 - Access Control | RBAC enforcement |
| CC6.6 - Security Monitoring | SAST, SCA, Secret Scan |
| CC6.7 - Vulnerability Management | Trivy scans |
| CC7.1 - Change Management | PR reviews, CI gates |

### ISO 27001
| Control | Pipeline Stage |
|---------|----------------|
| A.12.6.1 - Vulnerability Management | All scan stages |
| A.14.2.9 - System Acceptance Testing | E2E Tests |
| A.15.1.1 - Supplier Relationships | SBOM |

## Best Practices

### 1. Fail Fast
Order stages by cost/complexity (cheapest first):
1. Lint → Type Check → Unit Tests
2. Security Scans (SAST, SCA, Secrets)
3. Build → Container Build
4. E2E Tests

### 2. Security Gates
- Block on Critical/High vulnerabilities
- Alert on Medium findings
- Log Low findings for review

### 3. Artifact Management
- Store SBOMs for audit trails
- Retain security scan results
- Version control infrastructure as code

### 4. Secrets Management
- Use GitHub Secrets for credentials
- Rotate secrets regularly
- Never log secrets

## Troubleshooting

### Common Issues

#### Semgrep False Positives
```yaml
# Add to .semgrep/.semgrepignore
path/to/generated/code/
```

#### Trivy CVE Exceptions
```yaml
# Add to .trivyignore
CVE-2023-12345  # False positive for dev dependency
```

#### Gitleaks Allow List
```toml
# Add to .gitleaks.toml
[allowlist]
paths = ['tests/fixtures/']
```

## Monitoring & Alerting

### Key Metrics
- Pipeline success rate
- Mean time to remediation
- Vulnerability count trends
- Coverage percentage

### Alert Channels
- Slack: #security-alerts
- Email: security@example.com
- GitHub: Security tab

---

For questions or improvements, contact the DevSecOps team.
