/**
 * Quick Start Section
 * Step-by-step guide to get started with the platform
 */

'use client';

import { useState } from 'react';
import {
  Rocket,
  Terminal,
  Settings,
  Database,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  FileCode,
  Key,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '../shared';
import { SectionHeader } from '../shared';

interface StepConfig {
  title: string;
  description: string;
  icon: typeof Terminal;
  code?: string;
  codeLanguage?: string;
  filename?: string;
  tips?: string[];
  commands?: { label: string; command: string }[];
}

const STEPS: StepConfig[] = [
  {
    title: 'Clone & Install',
    description: 'Get the code and install dependencies',
    icon: Terminal,
    code: `# Clone the repository
git clone https://github.com/example/devsecops-platform.git
cd devsecops-platform

# Install dependencies using Bun
bun install

# Or using npm
npm install`,
    filename: 'terminal',
    tips: [
      'Ensure you have Git 2.30+ installed',
      'Bun is recommended for faster installs',
      'Node.js 18+ is required if using npm',
    ],
  },
  {
    title: 'Generate JWT Keys',
    description: 'Create RSA key pair for JWT authentication',
    icon: Key,
    code: `# Generate private key (3072 bits for RS256)
openssl genrsa -out private.pem 3072

# Extract public key
openssl rsa -in private.pem -pubout -out public.pem

# Convert to base64 for environment variables
base64 -i private.pem -o private.txt
base64 -i public.pem -o public.txt`,
    filename: 'terminal',
    tips: [
      'Never commit private keys to version control',
      'Use 3072+ bits for production environments',
      'Rotate keys every 90 days',
    ],
  },
  {
    title: 'Configure Environment',
    description: 'Set up your environment variables',
    icon: Settings,
    code: `# .env.local
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT Keys (base64 encoded)
JWT_PRIVATE_KEY="\${PRIVATE_KEY_BASE64}"
JWT_PUBLIC_KEY="\${PUBLIC_KEY_BASE64}"

# Encryption
FERNET_KEY="your-fernet-encryption-key"

# Optional: OAuth providers
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""`,
    filename: '.env.local',
    codeLanguage: 'env',
    tips: [
      'Generate NEXTAUTH_SECRET with: openssl rand -base64 32',
      'Use environment-specific .env files',
      'Never commit .env files to version control',
    ],
  },
  {
    title: 'Initialize Database',
    description: 'Set up the database schema and seed data',
    icon: Database,
    commands: [
      { label: 'Push schema', command: 'bun run db:push' },
      { label: 'Generate client', command: 'bun run db:generate' },
      { label: 'Seed data', command: 'bun run db:seed' },
      { label: 'View data', command: 'bun run db:studio' },
    ],
    code: `# Run all database setup commands
bun run db:push && bun run db:generate && bun run db:seed

# Optional: Open Prisma Studio
bun run db:studio`,
    filename: 'terminal',
    tips: [
      'Prisma Studio provides a GUI for your database',
      'Seed creates default admin user',
      'Use migrations for production',
    ],
  },
  {
    title: 'Start Development Server',
    description: 'Run the application locally',
    icon: Play,
    code: `# Start development server
bun run dev

# Server will be running at:
# http://localhost:3000

# Default credentials (if seeded):
# Email: admin@devsecops.com
# Password: admin123`,
    filename: 'terminal',
    tips: [
      'Hot reload is enabled by default',
      'Check console for any errors',
      'Use Chrome DevTools for debugging',
    ],
  },
  {
    title: 'Run Security Scans',
    description: 'Verify security setup with built-in tools',
    icon: Shield,
    code: `# Run npm audit
bun run audit

# Run SAST with Semgrep (if installed)
semgrep --config=auto .

# Run secret detection with Gitleaks
gitleaks detect --source . --no-git

# Run Trivy container scan (after build)
trivy fs . --severity HIGH,CRITICAL`,
    filename: 'terminal',
    tips: [
      'Run security scans before every commit',
      'Set up pre-commit hooks for automation',
      'Address HIGH and CRITICAL issues first',
    ],
  },
];

export function QuickStartSection() {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([0]);

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="quickstart" className="scroll-mt-20 space-y-8">
      <SectionHeader
        id="quickstart"
        title="Quick Start"
        description="Get up and running in minutes"
        icon={Rocket}
        iconColor="text-emerald-500"
      />

      {/* Prerequisites */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-blue-700">Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: 'Node.js', version: '18+' },
              { name: 'Bun', version: '1.0+' },
              { name: 'Git', version: '2.30+' },
              { name: 'OpenSSL', version: '1.1+' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  <strong>{item.name}</strong> {item.version}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {STEPS.map((step, index) => (
          <Card key={step.title} className="overflow-hidden">
            <button
              onClick={() => toggleStep(index)}
              className="w-full text-left"
            >
              <CardHeader className="flex flex-row items-start gap-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{step.title}</CardTitle>
                      <step.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
                <div className="shrink-0">
                  {expandedSteps.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </button>

            {expandedSteps.includes(index) && (
              <CardContent className="pt-0 border-t">
                <div className="pt-4 space-y-4">
                  {/* Commands Grid */}
                  {step.commands && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                      {step.commands.map((cmd) => (
                        <div 
                          key={cmd.label}
                          className="p-3 rounded-lg bg-muted text-center"
                        >
                          <p className="text-xs text-muted-foreground mb-1">{cmd.label}</p>
                          <code className="text-xs font-mono">{cmd.command}</code>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Code Block */}
                  {step.code && (
                    <CodeBlock 
                      code={step.code} 
                      language={step.codeLanguage || 'bash'}
                      filename={step.filename}
                    />
                  )}

                  {/* Tips */}
                  {step.tips && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                        💡 Tips
                      </h4>
                      <ul className="text-sm text-amber-600 space-y-1">
                        {step.tips.map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">🎉 Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <FileCode className="h-5 w-5 text-primary mb-2" />
              <h4 className="font-medium mb-1">Explore the Pipeline</h4>
              <p className="text-sm text-muted-foreground">
                Learn about the 14-stage CI/CD pipeline and security gates.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <Shield className="h-5 w-5 text-primary mb-2" />
              <h4 className="font-medium mb-1">Security Controls</h4>
              <p className="text-sm text-muted-foreground">
                Understand JWT authentication, encryption, and RBAC.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <Settings className="h-5 w-5 text-primary mb-2" />
              <h4 className="font-medium mb-1">Configure Tools</h4>
              <p className="text-sm text-muted-foreground">
                Set up security tools like Trivy, Semgrep, and Gitleaks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
