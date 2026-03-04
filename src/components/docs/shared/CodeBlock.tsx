/**
 * Code Block Component
 * Syntax highlighted code block with copy functionality
 */

'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'bash', filename, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-700">
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {filename && (
              <span className="text-xs text-slate-400 ml-2">{filename}</span>
            )}
          </div>
          <span className="text-xs text-slate-500 uppercase">{language}</span>
        </div>
      )}

      {/* Code */}
      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="absolute right-2 top-2 h-7 px-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check className="h-3 w-3 mr-1 text-emerald-400" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>

        <pre className="bg-slate-900 text-slate-100 p-4 overflow-x-auto text-sm">
          <code>
            {showLineNumbers ? (
              <table className="w-full">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i} className="hover:bg-slate-800/50">
                      <td className="pr-4 text-right text-slate-600 select-none w-8">{i + 1}</td>
                      <td className="whitespace-pre">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Inline Code Component
 */
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  );
}
