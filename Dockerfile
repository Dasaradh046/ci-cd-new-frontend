# ==========================================================
# DevSecOps Platform - Optimized Multi-Stage Dockerfile
# Next.js + PNPM
# Tier-3 CI/CD Pipeline Ready
#
# Goals:
# - Small Docker Image
# - Fast builds with caching
# - Secure non-root runtime
# - Production optimized
# - Works for local dev and production
# ==========================================================


# ==========================================================
# Stage 1 — Base Image
# Common base used across stages
# ==========================================================
FROM node:24-alpine AS base

WORKDIR /app

# Patch OS vulnerabilities
RUN apk add --no-cache libc6-compat

# Install pnpm globally
RUN npm install -g pnpm@10

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# ==========================================================
# Stage 2 — Dependencies
# Install node modules with caching
# ==========================================================
FROM base AS deps

WORKDIR /app

# Copy only dependency files first (better caching)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
# --frozen-lockfile ensures deterministic installs
RUN pnpm install --frozen-lockfile



# ==========================================================
# Stage 3 — Builder
# Build the Next.js application
# ==========================================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy project files
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Set production environment
ENV NODE_ENV=production

# Build Next.js application
# Requires next.config.js with:
# output: "standalone"
RUN pnpm build

# Remove devDependencies to reduce image size
RUN pnpm prune --prod



# ==========================================================
# Stage 4 — Production Runtime
# Minimal and secure production image
# ==========================================================
FROM node:24-alpine AS runner

WORKDIR /app

# Environment configuration
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Install minimal runtime packages
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup -S nodejs -g 1001 \
    && adduser -S nextjs -u 1001 -G nodejs

# Copy standalone Next.js server
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static

# Copy public files
COPY --from=builder /app/public ./public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose Next.js port
EXPOSE 3000

# Container health check
# Useful for Kubernetes / Docker / CI/CD health monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000/api/health || exit 1

# Start Next.js standalone server
CMD ["node", "server.js"]