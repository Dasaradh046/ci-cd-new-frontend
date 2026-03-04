/**
 * Compliance Section
 * Regulatory and industry compliance documentation
 */

'use client';

import {
  CheckCircle,
  Shield,
  Lock,
  Database,
  Users,
  Activity,
  AlertTriangle,
  FileText,
  Globe,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionHeader } from '../shared';
import { cn } from '@/lib/utils';

const COMPLIANCE_FRAMEWORKS = [
  {
    name: 'SOC 2 Type II',
    icon: Shield,
    color: 'blue',
    description: 'Service Organization Control 2 - Security, Availability, Processing Integrity, Confidentiality, and Privacy controls.',
    requirements: [
      { name: 'Access Controls', implemented: true },
      { name: 'Encryption at Rest', implemented: true },
      { name: 'Encryption in Transit', implemented: true },
      { name: 'Audit Logging', implemented: true },
      { name: 'Incident Response', implemented: true },
      { name: 'Change Management', implemented: true },
      { name: 'Risk Assessment', implemented: true },
      { name: 'Vendor Management', implemented: true },
    ],
    auditFrequency: 'Annual',
    lastAudit: '2024-01-15',
    status: 'Compliant',
  },
  {
    name: 'ISO 27001',
    icon: Lock,
    color: 'emerald',
    description: 'International standard for information security management systems (ISMS).',
    requirements: [
      { name: 'Information Security Policy', implemented: true },
      { name: 'Risk Assessment', implemented: true },
      { name: 'Asset Management', implemented: true },
      { name: 'Access Control', implemented: true },
      { name: 'Cryptography', implemented: true },
      { name: 'Operations Security', implemented: true },
      { name: 'Communications Security', implemented: true },
      { name: 'Supplier Relationships', implemented: true },
    ],
    auditFrequency: 'Annual',
    lastAudit: '2023-11-20',
    status: 'Compliant',
  },
  {
    name: 'GDPR',
    icon: Users,
    color: 'purple',
    description: 'General Data Protection Regulation - EU data protection and privacy law.',
    requirements: [
      { name: 'Data Minimization', implemented: true },
      { name: 'Consent Management', implemented: true },
      { name: 'Right to Access', implemented: true },
      { name: 'Right to Erasure', implemented: true },
      { name: 'Data Portability', implemented: true },
      { name: 'Privacy by Design', implemented: true },
      { name: 'Breach Notification', implemented: true },
      { name: 'DPO Appointment', implemented: true },
    ],
    auditFrequency: 'Continuous',
    lastAudit: '2024-02-01',
    status: 'Compliant',
  },
  {
    name: 'PCI DSS',
    icon: Database,
    color: 'amber',
    description: 'Payment Card Industry Data Security Standard for organizations handling credit cards.',
    requirements: [
      { name: 'Network Security', implemented: true },
      { name: 'Access Control', implemented: true },
      { name: 'Encryption', implemented: true },
      { name: 'Vulnerability Management', implemented: true },
      { name: 'Monitoring & Logging', implemented: true },
      { name: 'Information Security Policy', implemented: true },
    ],
    auditFrequency: 'Quarterly',
    lastAudit: '2024-01-30',
    status: 'Compliant',
    note: 'Platform does not store card data directly. Payment processing handled by PCI-compliant providers.',
  },
  {
    name: 'HIPAA',
    icon: Activity,
    color: 'rose',
    description: 'Health Insurance Portability and Accountability Act for healthcare data protection.',
    requirements: [
      { name: 'PHI Protection', implemented: true },
      { name: 'Access Controls', implemented: true },
      { name: 'Audit Controls', implemented: true },
      { name: 'Transmission Security', implemented: true },
      { name: 'Breach Notification', implemented: true },
      { name: 'Business Associate Agreements', implemented: true },
    ],
    auditFrequency: 'Annual',
    lastAudit: '2023-12-10',
    status: 'Compliant',
    note: 'Healthcare features require additional BAA agreements.',
  },
];

const DATA_RIGHTS = [
  {
    article: 'Article 15',
    title: 'Right to Access',
    description: 'Users can request a complete copy of their personal data.',
    implementation: 'Export feature in profile settings generates JSON/ZIP file with all user data.',
  },
  {
    article: 'Article 16',
    title: 'Right to Rectification',
    description: 'Users can update their personal data.',
    implementation: 'Profile settings allow users to update all personal information with audit trail.',
  },
  {
    article: 'Article 17',
    title: 'Right to Erasure',
    description: 'Users can request complete account deletion.',
    implementation: 'Account deletion request triggers soft delete, permanent deletion after 30-day grace period.',
  },
  {
    article: 'Article 20',
    title: 'Right to Data Portability',
    description: 'Users can transfer their data to another provider.',
    implementation: 'Data exports in machine-readable JSON format, compatible with common platforms.',
  },
  {
    article: 'Article 21',
    title: 'Right to Object',
    description: 'Users can object to processing of their data.',
    implementation: 'Consent management system allows granular control over data processing.',
  },
];

const DATA_RETENTION = [
  { type: 'User Data', retention: 'Account duration + 30 days', legalBasis: 'Contract performance' },
  { type: 'Audit Logs', retention: '2 years', legalBasis: 'Legal obligation' },
  { type: 'Security Events', retention: '1 year', legalBasis: 'Legitimate interest' },
  { type: 'Session Data', retention: '7 days inactive', legalBasis: 'Security' },
  { type: 'Backup Data', retention: '90 days', legalBasis: 'Business continuity' },
  { type: 'Anonymized Analytics', retention: 'Indefinite', legalBasis: 'Legitimate interest' },
];

export function ComplianceSection() {
  return (
    <section id="compliance" className="scroll-mt-20 space-y-8">
      <SectionHeader
        id="compliance"
        title="Compliance"
        description="Regulatory and industry compliance standards"
        icon={CheckCircle}
        iconColor="text-emerald-500"
      />

      {/* Compliance Overview */}
      <div className="grid md:grid-cols-5 gap-4">
        {COMPLIANCE_FRAMEWORKS.map((framework) => (
          <Card 
            key={framework.name} 
            className={cn('text-center', `border-${framework.color}-200`)}
          >
            <CardContent className="pt-6">
              <div className={cn(
                'w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center',
                `bg-${framework.color}-100`
              )}>
                <framework.icon className={cn('h-6 w-6', `text-${framework.color}-600`)} />
              </div>
              <p className="font-medium text-sm">{framework.name}</p>
              <Badge variant="outline" className="mt-2 text-xs text-emerald-600 border-emerald-300">
                ✓ Compliant
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Framework Details */}
      <div className="space-y-4">
        {COMPLIANCE_FRAMEWORKS.map((framework) => (
          <Card key={framework.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2.5 rounded-xl',
                    `bg-${framework.color}-100`
                  )}>
                    <framework.icon className={cn('h-5 w-5', `text-${framework.color}-600`)} />
                  </div>
                  <div>
                    <CardTitle>{framework.name}</CardTitle>
                    <CardDescription>{framework.description}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-500">Compliant</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last audit: {framework.lastAudit}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-2 mb-4">
                {framework.requirements.map((req) => (
                  <div 
                    key={req.name}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-sm">{req.name}</span>
                  </div>
                ))}
              </div>
              {framework.note && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-700">
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    {framework.note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GDPR Data Subject Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            GDPR Data Subject Rights
          </CardTitle>
          <CardDescription>
            Implementation of data subject rights under GDPR Articles 15-22
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {DATA_RIGHTS.map((right) => (
              <AccordionItem 
                key={right.article} 
                value={right.article}
                className="border rounded-xl px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">{right.title}</span>
                    <Badge variant="outline" className="text-xs">{right.article}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-7">
                    <p className="text-muted-foreground">{right.description}</p>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm"><strong>Implementation:</strong> {right.implementation}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Data Retention Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Retention Policy
          </CardTitle>
          <CardDescription>
            How long different types of data are retained
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-semibold">Data Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Retention Period</th>
                  <th className="text-left py-3 pl-4 font-semibold">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                {DATA_RETENTION.map((item, i) => (
                  <tr key={item.type} className={cn('border-b last:border-0', i % 2 === 0 && 'bg-muted/30')}>
                    <td className="py-3 pr-4 font-medium">{item.type}</td>
                    <td className="py-3 px-4">{item.retention}</td>
                    <td className="py-3 pl-4 text-muted-foreground">{item.legalBasis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Information */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Audit & Certification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium mb-2">Audit Partners</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Big 4 Accounting Firm</li>
                <li>• Independent Security Auditors</li>
                <li>• Penetration Testing Team</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium mb-2">Audit Schedule</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SOC 2: Annual</li>
                <li>• PCI DSS: Quarterly</li>
                <li>• Penetration Test: Annual</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium mb-2">Available Reports</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SOC 2 Type II Report</li>
                <li>• Penetration Test Summary</li>
                <li>• Compliance Attestation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
