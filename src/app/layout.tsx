import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "DevSecOps Platform - Tier-3 CI/CD Pipeline",
    template: "%s | DevSecOps Platform",
  },
  description: "Production-grade Next.js TypeScript application with Tier-3 DevSecOps CI/CD pipeline implementation. Features RBAC, JWT RS256 authentication, and comprehensive security controls.",
  keywords: ["DevSecOps", "Next.js", "TypeScript", "CI/CD", "Security", "RBAC", "JWT"],
  authors: [{ name: "DevSecOps Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
