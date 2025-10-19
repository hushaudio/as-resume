import Link from "next/link";
import { getAllPosts, publishPost, unpublishPost } from "@/lib/admin";

interface AdminPageProps {
  searchParams: {
    action?: string;
    id?: string;
  };
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  // Handle actions
  if (searchParams.action && searchParams.id) {
    const id = parseInt(searchParams.id);
    
    if (searchParams.action === 'publish') {
      await publishPost(id);
    } else if (searchParams.action === 'unpublish') {
      await unpublishPost(id);
    }
    
    // Redirect to avoid resubmission
    return (
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Action completed</h1>
          <p className="text-muted-foreground mb-6">Redirecting...</p>
          <script dangerouslySetInnerHTML={{
            __html: `setTimeout(() => window.location.href = '/admin', 1000)`
          }} />
        </div>
      </div>
    );
  }

  const posts = await getAllPosts();

  return (
    <main className="prose prose-invert mx-auto max-w-6xl mt-18 px-4 relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-green to-accent-purple animate-gradient-shift" />
      </div>

      <header className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">Blog Admin</h1>
          <Link 
            href="/logout"
            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            Logout
          </Link>
        </div>
        <p className="text-muted-foreground mb-6">
          Manage blog posts and publishing status.
        </p>
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 border border-theme rounded-lg hover:bg-surface/50 transition-colors"
        >
          ← Back to Blog
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-theme rounded-lg">
          <thead>
            <tr className="bg-surface/50">
              <th className="border border-theme p-4 text-left">Title</th>
              <th className="border border-theme p-4 text-left">Status</th>
              <th className="border border-theme p-4 text-left">Channel</th>
              <th className="border border-theme p-4 text-left">Words</th>
              <th className="border border-theme p-4 text-left">Created</th>
              <th className="border border-theme p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-surface/30 transition-colors">
                <td className="border border-theme p-4">
                  <div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="font-medium hover:text-accent-green transition-colors"
                    >
                      {post.title}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-1">
                      {post.slug}
                    </div>
                  </div>
                </td>
                <td className="border border-theme p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    post.status === 'published' 
                      ? 'bg-accent-green/20 text-accent-green' 
                      : post.status === 'draft'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-muted/20 text-muted-foreground'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="border border-theme p-4 text-sm text-muted-foreground">
                  {post.channel_handle ? `@${post.channel_handle}` : 'N/A'}
                </td>
                <td className="border border-theme p-4 text-sm text-muted-foreground">
                  {post.word_count?.toLocaleString() || 'N/A'}
                </td>
                <td className="border border-theme p-4 text-sm text-muted-foreground">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-theme p-4">
                  <div className="flex gap-2">
                    {post.status === 'draft' ? (
                      <a
                        href={`/admin?action=publish&id=${post.id}`}
                        className="px-3 py-1 bg-accent-green/20 text-accent-green rounded text-sm hover:bg-accent-green/30 transition-colors"
                      >
                        Publish
                      </a>
                    ) : (
                      <a
                        href={`/admin?action=unpublish&id=${post.id}`}
                        className="px-3 py-1 bg-accent/20 text-accent rounded text-sm hover:bg-accent/30 transition-colors"
                      >
                        Unpublish
                      </a>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="px-3 py-1 border border-theme rounded text-sm hover:bg-surface/50 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      )}
    </main>
  );
}
