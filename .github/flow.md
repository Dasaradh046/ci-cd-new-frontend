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

---

# =========================================================

# Stage 15: Deploy to Staging Environment

# Trigger: push to develop branch

# Purpose: Deploy the validated container image to staging

# =========================================================

deploy-staging:
name: Deploy to Staging
runs-on: ubuntu-latest
needs: container-scan
if: github.ref == 'refs/heads/develop'
environment:
name: staging

steps:
- name: Checkout repository
uses: actions/checkout@v4

```
- name: Deploy application to staging
  run: |
    echo "Deploying application to STAGING environment"
    echo "Container Image: ghcr.io/${{ github.repository }}:${{ github.sha }}"
    # Example deployment commands:
    # kubectl set image deployment/app app=ghcr.io/${{ github.repository }}:${{ github.sha }} -n staging
    # helm upgrade --install app ./helm/app --namespace staging
```

# =========================================================

# Stage 16: Deploy to Production Environment

# Trigger: GitHub Release

# Purpose: Deploy signed and scanned image to production

# =========================================================

deploy-production:
name: Deploy to Production
runs-on: ubuntu-latest
needs: container-scan
if: github.event_name == 'release'
environment:
name: production

steps:
- name: Checkout repository
uses: actions/checkout@v4

```
- name: Deploy application to production
  run: |
    echo "Deploying application to PRODUCTION environment"
    echo "Container Image: ghcr.io/${{ github.repository }}:${{ github.sha }}"
    # Example deployment commands:
    # kubectl set image deployment/app app=ghcr.io/${{ github.repository }}:${{ github.sha }} -n production
    # helm upgrade --install app ./helm/app --namespace production
```

# =========================================================

# Stage 17: Post Deployment Health Check

# Purpose: Verify application availability after deployment

# Runs only if deployment jobs were executed

# =========================================================

health-check:
name: Service Health Check
runs-on: ubuntu-latest
needs:
- deploy-staging
- deploy-production
if: always()

steps:
- name: Perform health check
run: |
echo "Running post-deployment health checks..."

```
    # Example health checks
    # curl -f https://staging.example.com/health
    # curl -f https://api.example.com/health

    echo "Health check completed"
```
---

# =========================================================

# Stage 15: Deploy to Staging (Google Cloud VM)

# Trigger: push to develop branch

# =========================================================

deploy-staging:
name: Deploy to Staging VM
runs-on: ubuntu-latest
needs: container-scan
if: github.ref == 'refs/heads/develop'
environment:
name: staging

steps:
- name: Checkout repository
uses: actions/checkout@v4

```
- name: Setup SSH key
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.GCP_VM_SSH_KEY }}" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan -H ${{ secrets.GCP_VM_IP }} >> ~/.ssh/known_hosts

- name: Deploy Docker container to GCP VM
  run: |
    ssh ${{ secrets.GCP_VM_USER }}@${{ secrets.GCP_VM_IP }} << 'EOF'

    echo "Pulling latest container image..."
    docker pull ghcr.io/${{ github.repository }}:${{ github.sha }}

    echo "Stopping existing container..."
    docker stop frontend-app || true
    docker rm frontend-app || true

    echo "Starting new container..."
    docker run -d \
      --name frontend-app \
      -p 80:3000 \
      --restart always \
      ghcr.io/${{ github.repository }}:${{ github.sha }}

    echo "Deployment completed."

    EOF
```

# =========================================================

# Stage 16: Deploy to Production VM

# Trigger: GitHub Release

# =========================================================

deploy-production:
name: Deploy to Production VM
runs-on: ubuntu-latest
needs: container-scan
if: github.event_name == 'release'
environment:
name: production

steps:
- name: Checkout repository
uses: actions/checkout@v4

```
- name: Setup SSH key
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.GCP_VM_SSH_KEY }}" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan -H ${{ secrets.GCP_VM_IP }} >> ~/.ssh/known_hosts

- name: Deploy Docker container to production VM
  run: |
    ssh ${{ secrets.GCP_VM_USER }}@${{ secrets.GCP_VM_IP }} << 'EOF'

    docker pull ghcr.io/${{ github.repository }}:${{ github.sha }}

    docker stop frontend-app || true
    docker rm frontend-app || true

    docker run -d \
      --name frontend-app \
      -p 80:3000 \
      --restart always \
      ghcr.io/${{ github.repository }}:${{ github.sha }}

    echo "Production deployment completed."

    EOF
```

# =========================================================

# Stage 17: Post Deployment Health Check

# =========================================================

health-check:
name: Service Health Check
runs-on: ubuntu-latest
needs: [deploy-staging, deploy-production]
if: always()

steps:
- name: Verify service health
run: |
echo "Checking service health..."

```
    curl -f http://${{ secrets.GCP_VM_IP }} || exit 1

    echo "Service is healthy."
```
---
