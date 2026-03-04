/**
 * Homepage
 * Modern, engaging landing page with pipeline visualization
 */

import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Users,
  Lock,
  FileText,
  Bell,
  Zap,
  ArrowRight,
  Check,
  Code,
  Globe,
  Sparkles,
  BarChart3,
  GitBranch,
  Rocket,
  Scan,
  Database,
  Server,
  Settings,
  Terminal,
  Workflow,
  ChevronRight,
  Play,
} from "lucide-react";

export const metadata: Metadata = {
  title: "DevSecOps Platform",
  description: "Enterprise-grade DevSecOps platform with Tier-3 CI/CD pipeline",
};

const features = [
  {
    icon: Shield,
    title: "JWT RS256 Auth",
    description: "Secure asymmetric encryption for token-based authentication",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    icon: Users,
    title: "RBAC",
    description: "5-level role hierarchy from Guest to Super Admin",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    icon: Lock,
    title: "AES-256",
    description: "Fernet encryption for sensitive data at rest",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    icon: FileText,
    title: "File Management",
    description: "Secure uploads with presigned URLs",
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Real-time alerts and updates",
    color: "bg-rose-50 text-rose-600 border-rose-200",
  },
  {
    icon: Zap,
    title: "14-Stage Pipeline",
    description: "Comprehensive CI/CD with security gates",
    color: "bg-cyan-50 text-cyan-600 border-cyan-200",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime SLA", icon: Server },
  { value: "<50ms", label: "API Response", icon: Zap },
  { value: "14", label: "Security Stages", icon: Shield },
  { value: "5", label: "Role Levels", icon: Users },
];

const compliance = ["SOC 2", "ISO 27001", "GDPR", "PCI DSS", "HIPAA"];

const pipelineStages = [
  { id: 1, name: "Code Commit", icon: Code, status: "success" },
  { id: 2, name: "Build", icon: Terminal, status: "success" },
  { id: 3, name: "Unit Test", icon: Check, status: "success" },
  { id: 4, name: "SAST", icon: Scan, status: "success" },
  { id: 5, name: "Container Build", icon: Database, status: "running" },
  { id: 6, name: "DAST", icon: Shield, status: "pending" },
  { id: 7, name: "Deploy", icon: Rocket, status: "pending" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">DevSecOps</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl opacity-40" />
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>

          <div className="container mx-auto px-4 py-20 lg:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 mb-6 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium">Tier-3 DevSecOps Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Build Secure Apps with{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Enterprise-Grade
                </span>{" "}
                Security
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Production-ready Next.js platform with JWT RS256 authentication, 
                role-based access control, and a comprehensive 14-stage CI/CD pipeline.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
                <Button size="lg" className="h-11 px-8 shadow-lg shadow-primary/20" asChild>
                  <Link href="/register">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-11 px-6" asChild>
                  <Link href="/docs">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Free tier available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline Visualization */}
        <section className="border-y bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-3">Live Pipeline</Badge>
              <h2 className="text-2xl font-bold mb-2">14-Stage CI/CD Pipeline</h2>
              <p className="text-muted-foreground">Comprehensive security gates at every stage</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3 max-w-5xl mx-auto">
              {pipelineStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <div className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                    ${stage.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}
                    ${stage.status === 'running' ? 'bg-primary/10 border-primary/30 text-primary animate-pulse' : ''}
                    ${stage.status === 'pending' ? 'bg-muted/50 border-border text-muted-foreground' : ''}
                  `}>
                    <stage.icon className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:inline">{stage.name}</span>
                    <span className="text-sm font-medium sm:hidden">{stage.id}</span>
                    {stage.status === 'success' && <Check className="h-3 w-3" />}
                    {stage.status === 'running' && (
                      <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  {index < pipelineStages.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm bg-gradient-to-b from-background to-muted/30">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-2.5 rounded-xl bg-primary/10 mb-3">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-3">Features</Badge>
              <h2 className="text-3xl font-bold mb-4">Security-First Architecture</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built with enterprise requirements in mind, following industry best practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => (
                <Card 
                  key={feature.title} 
                  className="group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border-transparent hover:border-primary/20"
                >
                  <CardContent className="p-6">
                    <div className={`
                      h-12 w-12 rounded-xl border flex items-center justify-center mb-4
                      group-hover:scale-110 transition-transform duration-300
                      ${feature.color}
                    `}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">Getting Started</Badge>
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get started in minutes with our streamlined onboarding process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Create Account", description: "Sign up with email or SSO integration", icon: Users },
              { step: "02", title: "Configure Roles", description: "Set up RBAC for your team structure", icon: Shield },
              { step: "03", title: "Start Building", description: "Deploy with confidence using our CI/CD pipeline", icon: Rocket },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-xl mb-4 shadow-lg shadow-primary/20">
                  <item.icon className="h-7 w-7" />
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-3">Compliance</Badge>
              <h2 className="text-3xl font-bold mb-4">Compliance Ready</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Supporting regulatory and industry compliance requirements out of the box.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {compliance.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border bg-card hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border-primary/20 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <CardContent className="py-20 text-center relative">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-6">
                <Workflow className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
                Join the DevSecOps platform and experience enterprise-grade security 
                with modern development practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20" asChild>
                  <Link href="/register">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">DevSecOps</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DevSecOps Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
