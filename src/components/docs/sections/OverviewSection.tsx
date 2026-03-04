/**
 * DevSecOps Overview Section
 * Architecture overview, stats, and key concepts
 */

'use client';

import {
  Shield,
  GitBranch,
  Lock,
  Activity,
  Globe,
  Server,
  Database,
  Zap,
  CheckCircle,
  ArrowRight,
  Layers,
  Clock,
  Users,
  FileCode,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '../shared';

const STATS = [
  { label: 'Pipeline Stages', value: '14', icon: GitBranch, color: 'primary' },
  { label: 'Security Tools', value: '8+', icon: Shield, color: 'emerald' },
  { label: 'Compliance Standards', value: '5', icon: Lock, color: 'blue' },
  { label: 'Pipeline Uptime', value: '99.9%', icon: Activity, color: 'amber' },
];

const KEY_CONCEPTS = [
  {
    title: 'Shift-Left Security',
    description: 'Integrate security early in the development lifecycle, not just at the end. Catch vulnerabilities when they are cheapest to fix.',
    icon: Zap,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    title: 'Defense in Depth',
    description: 'Multiple layers of security controls throughout the pipeline. If one layer fails, others provide protection.',
    icon: Layers,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    title: 'Immutable Infrastructure',
    description: 'Infrastructure defined as code, versioned, and deployed consistently. No manual changes to production.',
    icon: Server,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    title: 'Zero Trust Architecture',
    description: 'Never trust, always verify. Every request is authenticated, authorized, and encrypted.',
    icon: Shield,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
];

const ARCHITECTURE_LAYERS = [
  {
    name: 'Frontend Layer',
    icon: Globe,
    color: 'blue',
    items: [
      'Next.js 16 with App Router',
      'Client-side input validation',
      'Content Security Policy (CSP)',
      'XSS & CSRF protection',
      'Secure cookie handling',
    ],
  },
  {
    name: 'API Layer',
    icon: Server,
    color: 'emerald',
    items: [
      'JWT RS256 authentication',
      'Rate limiting & throttling',
      'Input sanitization',
      'Request validation',
      'Audit logging',
    ],
  },
  {
    name: 'Data Layer',
    icon: Database,
    color: 'purple',
    items: [
      'AES-256-GCM encryption at rest',
      'Prisma ORM with migrations',
      'Connection pooling',
      'Backup & recovery',
      'Data anonymization',
    ],
  },
];

const SECURITY_BENEFITS = [
  'Reduce vulnerability exposure by 90%',
  'Automated security testing on every commit',
  'Compliance-ready audit trails',
  'Mean time to remediate under 24 hours',
  'Zero false positive tolerance in production',
  'Supply chain attack prevention',
];

export function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-20 space-y-8">
      <SectionHeader
        id="overview"
        title="Overview"
        description="Enterprise-grade DevSecOps platform with security-first architecture"
        icon={Shield}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className={`border-${stat.color}-500/20`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What is DevSecOps */}
      <Card>
        <CardHeader>
          <CardTitle>What is DevSecOps?</CardTitle>
          <CardDescription>
            Integrating security practices within the DevOps process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            DevSecOps is the philosophy of integrating security practices within the DevOps process. 
            It involves creating a 'security as code' culture with ongoing, flexible collaboration 
            between release engineers and security teams. The goal is to bridge traditional gaps 
            between IT and security while ensuring fast, safe delivery of code.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <span className="text-lg">❌</span>
                Without DevSecOps
              </h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Security as an afterthought</li>
                <li>• Vulnerabilities found late in SDLC</li>
                <li>• Manual security reviews</li>
                <li>• Slow release cycles</li>
                <li>• High remediation costs</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                <span className="text-lg">✓</span>
                With DevSecOps
              </h4>
              <ul className="text-sm text-emerald-600 space-y-1">
                <li>• Security integrated from start</li>
                <li>• Automated security scanning</li>
                <li>• Continuous compliance</li>
                <li>• Fast, secure releases</li>
                <li>• Reduced risk & cost</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Key Concepts</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {KEY_CONCEPTS.map((concept) => (
            <Card key={concept.title} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl border ${concept.color} shrink-0`}>
                    <concept.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{concept.title}</h4>
                    <p className="text-sm text-muted-foreground">{concept.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Architecture Overview
          </CardTitle>
          <CardDescription>
            Three-tier security-hardened architecture with defense in depth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {ARCHITECTURE_LAYERS.map((layer) => (
              <div 
                key={layer.name} 
                className={`p-4 rounded-xl bg-${layer.color}-50 border border-${layer.color}-200`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <layer.icon className={`h-5 w-5 text-${layer.color}-600`} />
                  <span className={`font-semibold text-${layer.color}-700`}>{layer.name}</span>
                </div>
                <ul className="text-sm space-y-1">
                  {layer.items.map((item) => (
                    <li key={item} className={`flex items-center gap-2 text-${layer.color}-600`}>
                      <CheckCircle className="h-3 w-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Security Benefits
          </CardTitle>
          <CardDescription>
            Quantifiable improvements from implementing DevSecOps practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SECURITY_BENEFITS.map((benefit, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Typical Pipeline Timeline
          </CardTitle>
          <CardDescription>
            End-to-end pipeline execution from commit to deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { phase: 'Pre-commit & Checkout', duration: '~30s', stages: 2, color: 'blue' },
              { phase: 'Security Scanning', duration: '~5 min', stages: 4, color: 'amber' },
              { phase: 'Build & Test', duration: '~15 min', stages: 3, color: 'purple' },
              { phase: 'Deployment', duration: '~5 min', stages: 2, color: 'emerald' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-32 text-sm font-medium text-${item.color}-600`}>
                  {item.phase}
                </div>
                <div className="flex-1 h-8 rounded-lg overflow-hidden bg-muted">
                  <div 
                    className={`h-full bg-${item.color}-500 flex items-center justify-end pr-2`}
                    style={{ width: `${(item.stages / 14) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.duration}</span>
                  </div>
                </div>
                <Badge variant="outline" className="w-16 justify-center">
                  {item.stages} stages
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * Total pipeline time: ~25-30 minutes (varies based on project size and complexity)
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
