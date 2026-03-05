Developer Push
      │
      ▼
CI Pipeline
  ├─ lint
  ├─ format
  ├─ typecheck
  ├─ unit tests
  └─ coverage

      │
      ▼
Security Pipeline
  ├─ secrets scan
  ├─ SAST
  ├─ dependency audit
  ├─ license scan
  └─ CodeQL

      │
      ▼
Build Pipeline
  ├─ build app
  ├─ generate artifact
  └─ cache

      │
      ▼
Container Pipeline
  ├─ docker lint
  ├─ build image
  ├─ vulnerability scan
  ├─ SBOM
  ├─ provenance
  └─ sign container

      │
      ▼
Deploy Pipeline
  ├─ staging
  ├─ e2e tests
  ├─ approval gate
  └─ production deploy


5️⃣ Enterprise DevSecOps Security Layers

Below is a real Tier-4 pipeline architecture used in high-security orgs.

25+ Security Layers
Code Security

1️⃣ ESLint security rules
2️⃣ TypeScript strict mode
3️⃣ Semgrep SAST
4️⃣ CodeQL deep analysis
5️⃣ Secrets scanning (Gitleaks)
6️⃣ GitHub dependency review
7️⃣ License compliance scan

Dependency Security

8️⃣ npm audit / pnpm audit
9️⃣ Snyk or Trivy dependency scan
🔟 Renovate / Dependabot updates

Supply Chain Security

11️⃣ SBOM generation (CycloneDX / SPDX)
12️⃣ SLSA provenance attestation
13️⃣ Artifact integrity verification

Container Security

14️⃣ Dockerfile lint (Hadolint)
15️⃣ Container vulnerability scan (Trivy)
16️⃣ Container misconfiguration scan
17️⃣ Container secret scan

Artifact Protection

18️⃣ Artifact signing (Cosign)
19️⃣ Image signing (Sigstore)
20️⃣ Attestation verification

Infrastructure Security

21️⃣ Terraform / IaC scanning (Checkov)
22️⃣ Kubernetes manifest scan (KubeSec)
23️⃣ Helm chart scan

Runtime Security

24️⃣ Admission controller verification
25️⃣ Policy enforcement (OPA / Kyverno)

6️⃣ What FAANG Pipelines Actually Look Like
Developer Push
        │
        ▼
┌─────────────────────────────┐
│ CI Pipeline                  │
│ lint + typecheck + tests    │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│ Security Pipeline            │
│ SAST + Secrets + License     │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│ Supply Chain Pipeline        │
│ SBOM + SLSA + Attestation    │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│ Container Pipeline           │
│ build + scan + sign          │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│ Deploy Pipeline              │
│ staging → tests → prod       │
└─────────────────────────────┘


Push / PR
   │
   ▼
CI Pipeline
(lint + typecheck + tests)

   │
   ▼
Security Pipeline
(SAST + secrets + dependencies)

   │
   ▼
Build Pipeline
(Next.js build artifact)

   │
   ▼
Container Pipeline
(docker build + scan + sign)

   │
   ▼
Deploy Pipeline
(staging / production)

   │
   ▼
Release Pipeline
(GitHub release + SBOM)

