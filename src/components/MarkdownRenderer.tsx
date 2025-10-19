'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Updated with light/dark mode support */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Override the default <a> element with Next.js Link
          a: ({ href, children, ...props }) => {
            if (href?.startsWith('/')) {
              return (
                <Link href={href} {...props}>
                  {children}
                </Link>
              );
            }
            return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline transition-colors hover:opacity-80"
                        style={{ color: 'var(--accent)' }}
                        {...props}
                      >
                        {children}
                      </a>
            );
          },
          // Style headings
          h1: ({ children, ...props }) => (
            <h1 className="text-4xl font-bold mb-6" style={{ color: 'var(--color-foreground)' }} {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-3xl font-semibold mb-4 mt-8" style={{ color: 'var(--color-foreground)' }} {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-2xl font-semibold mb-3 mt-6" style={{ color: 'var(--color-foreground)' }} {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-xl font-semibold mb-2 mt-4" style={{ color: 'var(--muted)' }} {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-lg font-semibold mb-2 mt-3" style={{ color: 'var(--muted)' }} {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-base font-semibold mb-2 mt-3" style={{ color: 'var(--muted)' }} {...props}>
              {children}
            </h6>
          ),
          // Style paragraphs
          p: ({ children, ...props }) => (
            <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-foreground)' }} {...props}>
              {children}
            </p>
          ),
          // Style lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc ml-6 mb-4 space-y-2" style={{ color: 'var(--color-foreground)' }} {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal ml-6 mb-4 space-y-2" style={{ color: 'var(--color-foreground)' }} {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          // Style code blocks
          pre: ({ children, ...props }) => (
            <pre 
              className="border rounded-lg p-4 mb-4 overflow-x-auto text-sm" 
              style={{ 
                backgroundColor: 'var(--muted-bg)', 
                borderColor: 'var(--border)',
                color: 'var(--color-foreground)'
              }} 
              {...props}
            >
              {children}
            </pre>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className?.includes('language-');
            return (
              <code
                className={`${
                  isInline
                    ? 'px-2 py-1 rounded text-sm font-mono'
                    : 'block p-4 rounded-lg text-sm font-mono overflow-x-auto'
                }`}
                style={{ 
                  backgroundColor: 'var(--muted-bg)',
                  color: 'var(--color-foreground)'
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Style blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="border-l-4 pl-4 py-2 mb-4 italic rounded-r-lg" 
              style={{ 
                borderLeftColor: 'var(--muted)',
                color: 'var(--muted)',
                backgroundColor: 'var(--surface)'
              }} 
              {...props}
            >
              {children}
            </blockquote>
          ),
          // Style tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table 
                className="w-full border-collapse border rounded-lg" 
                style={{ borderColor: 'var(--border)' }}
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead style={{ backgroundColor: 'var(--surface)' }} {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th 
              className="border p-3 text-left font-semibold" 
              style={{ 
                borderColor: 'var(--border)',
                color: 'var(--color-foreground)'
              }} 
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td 
              className="border p-3" 
              style={{ 
                borderColor: 'var(--border)',
                color: 'var(--color-foreground)'
              }} 
              {...props}
            >
              {children}
            </td>
          ),
          // Style horizontal rules
          hr: ({ ...props }) => (
            <hr 
              className="my-8" 
              style={{ borderColor: 'var(--border)' }} 
              {...props} 
            />
          ),
          // Style images
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg mb-4 mx-auto"
              {...props}
            />
          ),
          // Style strong and emphasis
          strong: ({ children, ...props }) => (
            <strong 
              className="font-semibold" 
              style={{ color: 'var(--color-foreground)' }} 
              {...props}
            >
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em 
              className="italic" 
              style={{ color: 'var(--muted)' }} 
              {...props}
            >
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}