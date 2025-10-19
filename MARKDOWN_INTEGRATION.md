# Markdown Integration

This document describes the markdown rendering integration added to the blog section.

## Overview

The blog now supports full markdown rendering for AI-generated content using `react-markdown` with GitHub Flavored Markdown (GFM) support and syntax highlighting.

## Features

### Markdown Support
- **GitHub Flavored Markdown (GFM)**: Tables, strikethrough, task lists, etc.
- **Syntax Highlighting**: Code blocks with language-specific highlighting
- **Custom Styling**: Consistent with the blog's design system
- **Link Handling**: Internal links use Next.js Link, external links open in new tabs

### Supported Elements
- **Headings**: H1-H6 with custom color coding
- **Paragraphs**: Proper spacing and typography
- **Lists**: Ordered and unordered lists with proper indentation
- **Code**: Inline code and code blocks with syntax highlighting
- **Tables**: Responsive tables with borders and styling
- **Blockquotes**: Styled with accent colors and borders
- **Links**: Smart handling of internal vs external links
- **Images**: Responsive images with proper sizing
- **Horizontal Rules**: Themed dividers

## Implementation

### Components
- **`MarkdownRenderer.tsx`**: Main component for rendering markdown content
- **`MDXComponents.tsx`**: Custom component overrides (unused but available)

### Dependencies
```json
{
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0", 
  "rehype-highlight": "^7.0.0"
}
```

### Configuration
- **Next.js Config**: Updated to support MDX files
- **CSS**: Custom syntax highlighting styles in `globals.css`
- **Theme Integration**: Uses CSS variables for consistent theming

## Styling

### Color Scheme
- **H1**: Accent green (`--accent-green`)
- **H2**: Accent blue (`--accent`)
- **H3**: Accent brown (`--accent-brown`)
- **H4-H6**: Default foreground color
- **Links**: Accent green with hover effects
- **Code**: Muted background with theme borders
- **Blockquotes**: Accent green left border

### Typography
- **Font Family**: Inherits from the main design system
- **Line Height**: Relaxed for better readability
- **Spacing**: Consistent margins and padding
- **Responsive**: Mobile-friendly layouts

## Usage

### In Blog Posts
```tsx
import MarkdownRenderer from "@/components/MarkdownRenderer";

// In your component
<MarkdownRenderer content={post.content} />
```

### Content Format
The AI-generated blog posts contain markdown content that gets rendered as:
- Structured headings and subheadings
- Formatted paragraphs with proper spacing
- Code blocks with syntax highlighting
- Tables for data presentation
- Blockquotes for important information
- Links to external resources

## Syntax Highlighting

### Supported Languages
- JavaScript/TypeScript
- Python
- JSON
- HTML/CSS
- SQL
- Bash/Shell
- And many more via highlight.js

### Styling
- **Background**: Muted background color
- **Border**: Theme-consistent borders
- **Colors**: Syntax-aware color coding
- **Scroll**: Horizontal scroll for long lines
- **Padding**: Comfortable spacing

## Examples

### Headings
```markdown
# Main Title (H1 - Green)
## Section Title (H2 - Blue)  
### Subsection (H3 - Brown)
```

### Code Blocks
```javascript
function example() {
  return "Hello, World!";
}
```

### Tables
| Feature | Status | Notes |
|---------|--------|-------|
| Markdown | ✅ | Full support |
| Syntax Highlighting | ✅ | Multiple languages |
| Tables | ✅ | Responsive design |

### Blockquotes
> This is an important note that will be styled with a green left border and italic text.

## Future Enhancements

- **Math Support**: LaTeX/MathJax integration
- **Mermaid Diagrams**: Flowcharts and diagrams
- **Custom Components**: Interactive elements
- **Table of Contents**: Auto-generated from headings
- **Search**: Full-text search within markdown content
- **Export**: PDF/HTML export functionality

## Troubleshooting

### Common Issues
1. **Content not rendering**: Check if content contains valid markdown
2. **Styling issues**: Verify CSS variables are properly defined
3. **Syntax highlighting**: Ensure `rehype-highlight` is properly configured
4. **Links not working**: Check internal vs external link handling

### Debug Mode
Enable development mode to see detailed error messages:
```bash
NODE_ENV=development npm run dev
```

## Performance

- **Client-side rendering**: Markdown is processed on the client
- **Memoization**: Content is memoized to prevent re-processing
- **Lazy loading**: Large content blocks are handled efficiently
- **Bundle size**: Minimal impact on overall bundle size
