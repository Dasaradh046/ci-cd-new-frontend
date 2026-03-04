/**
 * Footer Component
 * Sticky footer with links and copyright
 */

'use client';

import Link from 'next/link';
import { Shield, Github, BookOpen, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Shield className="h-4 w-4 text-indigo-500" />
            <span>
              © {new Date().getFullYear()} DevSecOps Platform. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/#docs"
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>

          {/* Built with */}
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>using Next.js & FastAPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
