import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
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
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    // Style headings
    h1: ({ children, ...props }) => (
      <h1 className="text-4xl font-bold mb-6 text-accent-green" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-3xl font-semibold mb-4 mt-8 text-accent" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-2xl font-semibold mb-3 mt-6 text-accent-brown" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-xl font-semibold mb-2 mt-4" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 className="text-lg font-semibold mb-2 mt-3" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 className="text-base font-semibold mb-2 mt-3" {...props}>
        {children}
      </h6>
    ),
    // Style paragraphs
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    // Style lists
    ul: ({ children, ...props }) => (
      <ul className="list-disc ml-6 mb-4 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-2" {...props}>
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
      <pre className="bg-muted-bg border border-theme rounded-lg p-4 mb-4 overflow-x-auto text-sm" {...props}>
        {children}
      </pre>
    ),
    code: ({ children, ...props }) => (
      <code className="bg-muted-bg px-2 py-1 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ),
    // Style blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-accent-green pl-4 py-2 mb-4 italic text-muted-foreground bg-surface/30 rounded-r-lg" {...props}>
        {children}
      </blockquote>
    ),
    // Style tables
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-theme rounded-lg" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-surface/50" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }) => (
      <th className="border border-theme p-3 text-left font-semibold" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-theme p-3" {...props}>
        {children}
      </td>
    ),
    // Style horizontal rules
    hr: ({ ...props }) => (
      <hr className="border-theme my-8" {...props} />
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
      <strong className="font-semibold text-accent-green" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic text-accent" {...props}>
        {children}
      </em>
    ),
    // Style links
    ...components,
  };
}
