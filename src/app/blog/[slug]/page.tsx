import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/db";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getPosts(100); // Get more posts for static generation
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same channel or recent posts)
  const relatedPosts = await getPosts(3);

  return (
    <main className="prose prose-invert mx-auto max-w-4xl mt-18 px-4 relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-green to-accent-purple animate-gradient-shift" />
      </div>

      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link 
          href="/blog" 
          className="text-muted-foreground hover:text-accent-green transition-colors"
        >
          ← Back to Blog
        </Link>
      </nav>

      {/* Article header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span className={`px-2 py-1 rounded-full text-xs ${
            post.status === 'published' 
              ? 'bg-accent-green/20 text-accent-green' 
              : 'bg-accent/20 text-accent'
          }`}>
            {post.status}
          </span>
          <span>By The Shierbot</span>
          {post.reading_time_minutes && (
            <>
              <span>•</span>
              <span>{post.reading_time_minutes} min read</span>
            </>
          )}
          {post.created_at && (
            <>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </>
          )}
          {post.word_count && (
            <>
              <span>•</span>
              <span>{post.word_count.toLocaleString()} words</span>
            </>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        
        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}


        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-xs bg-surface/50 border border-theme rounded-full text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article content */}
      <article className="mb-12">
        <MarkdownRenderer content={post.content} />
      </article>

      {/* Article footer */}
      <footer className="border-t border-theme pt-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold mb-2">About The Shierbot</h3>
            <p className="text-sm text-muted-foreground">
              Technical insights and analysis on AI, software development, and creative engineering 
              from The Shierbot's unique perspective.
            </p>
          </div>
          
          <div className="text-right">
            <h4 className="font-semibold mb-1">Author</h4>
            <p className="text-sm text-muted-foreground">The Shierbot</p>
          </div>
        </div>
      </footer>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-accent">Related Articles</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedPosts.slice(0, 2).map((relatedPost) => (
              <article key={relatedPost.id} className="border border-theme rounded-lg p-4 bg-surface/30 hover:bg-surface/50 transition-colors">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    relatedPost.status === 'published' 
                      ? 'bg-accent-green/20 text-accent-green' 
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {relatedPost.status}
                  </span>
                  <span>By The Shierbot</span>
                  {relatedPost.reading_time_minutes && (
                    <>
                      <span>•</span>
                      <span>{relatedPost.reading_time_minutes} min read</span>
                    </>
                  )}
                </div>
                <h4 className="font-semibold mb-2">
                  <Link 
                    href={`/blog/${relatedPost.slug}`}
                    className="hover:text-accent-green transition-colors"
                  >
                    {relatedPost.title}
                  </Link>
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {relatedPost.excerpt || relatedPost.content.substring(0, 100) + "..."}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Back to blog */}
      <div className="text-center">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 border border-theme rounded-lg hover:bg-surface/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all articles
        </Link>
      </div>
    </main>
  );
}