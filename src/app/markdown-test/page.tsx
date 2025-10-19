import MarkdownRenderer from "@/components/MarkdownRenderer";

const sampleMarkdown = `# Markdown Rendering Test

This is a test of the markdown rendering capabilities in the blog.

## Features Demonstrated

### Code Blocks
Here's some JavaScript code:

\`\`\`javascript
function greetUser(name) {
  return \`Hello, \${name}! Welcome to the blog.\`;
}

const user = "Aaron";
console.log(greetUser(user));
\`\`\`

### Lists
- **Bold text** in list items
- *Italic text* for emphasis
- \`inline code\` within text
- [Links to external sites](https://example.com)

### Tables
| Feature | Status | Description |
|---------|--------|-------------|
| Headings | ✅ | H1-H6 with custom styling |
| Code | ✅ | Syntax highlighting included |
| Tables | ✅ | Responsive design |
| Links | ✅ | Smart internal/external handling |

### Blockquotes
> This is a blockquote that demonstrates the styling with a green left border and italic text. It's perfect for highlighting important information or quotes.

### Code Inline
You can use \`inline code\` anywhere in your text, and it will be properly styled with a background and monospace font.

### Links
- [Internal link](/blog) - Uses Next.js Link
- [External link](https://github.com) - Opens in new tab

---

## Conclusion

The markdown renderer provides a rich, styled experience for blog content with proper theming and responsive design.`;

export default function MarkdownTestPage() {
  return (
    <main className="prose prose-invert mx-auto max-w-4xl mt-18 px-4 relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-green to-accent-purple animate-gradient-shift" />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Markdown Rendering Test</h1>
        <p className="text-muted-foreground mb-6">
          This page demonstrates the markdown rendering capabilities of the blog system.
        </p>
        <a 
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 border border-theme rounded-lg hover:bg-surface/50 transition-colors"
        >
          ← Back to Blog
        </a>
      </header>

      <MarkdownRenderer content={sampleMarkdown} />
    </main>
  );
}
