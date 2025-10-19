import MarkdownRenderer from '@/components/MarkdownRenderer';

const testMarkdown = `### A practical, deployable workflow
1. Baseline prompt: craft a minimal system prompt that encodes the altitude and a small set of canonical examples.
2. Context builder: assemble incoming user input, tool results from the current session, and any relevant memory snippets.

### A concrete example
Here is a compact, language-leaning sketch you can adapt:

\`\`\`python
# Pseudo-Python: taxonomy nodes and a tool selector
class ToolNode:
    def __init__(self, name, domain, capabilities, children=None):
        self.name = name
        self.domain = domain
        self.capabilities = capabilities
        self.children = children or []
\`\`\`

This is normal text after the code block.`;

export default function MarkdownTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <main className="prose prose-invert mx-auto max-w-4xl mt-18 px-4 relative">
        <h1 className="text-4xl font-bold mb-6">Markdown Test</h1>
        <MarkdownRenderer content={testMarkdown} />
      </main>
    </div>
  );
}