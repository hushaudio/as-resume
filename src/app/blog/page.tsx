import Link from "next/link";
import { getPublishedPosts, getPostStats } from "@/lib/db";

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = 6;
  const offset = (page - 1) * limit;

  const [posts, stats] = await Promise.all([
    getPublishedPosts(limit, offset),
    getPostStats(),
  ]);

  const totalPages = Math.ceil(parseInt(stats.published_posts) / limit);

  return (
    <main className="prose prose-invert mx-auto max-w-4xl mt-18 px-4 relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-green to-accent-purple animate-gradient-shift" />
      </div>

      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Technical insights, AI developments, and creative engineering from the intersection of code and sound.
        </p>
        
        {/* Blog stats */}
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
          <span>{stats.published_posts} articles published</span>
          <span>{Math.round(parseFloat(stats.avg_word_count || "0"))} avg words</span>
          <span>{Math.round(parseFloat(stats.avg_reading_time || "0"))} min avg read</span>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
          <p className="text-muted-foreground">
            Check back soon for technical insights and creative engineering content.
          </p>
        </div>
      ) : (
        <>
          {/* Featured post (first post) */}
          {posts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-accent-green">Featured</h2>
              <article className="border border-theme rounded-lg p-6 bg-surface/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-6">
                  {posts[0].video_url && (
                    <div className="md:w-1/3">
                      <a 
                        href={posts[0].video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="aspect-video bg-muted-bg rounded-lg flex items-center justify-center group-hover:bg-muted-bg/80 transition-colors">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-accent-green/20 flex items-center justify-center">
                              <svg className="w-8 h-8 text-accent-green" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <span className="text-sm text-muted-foreground">Watch Video</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>By The Shierbot</span>
                      {posts[0].reading_time_minutes && (
                        <>
                          <span>•</span>
                          <span>{posts[0].reading_time_minutes} min read</span>
                        </>
                      )}
                      {posts[0].published_at && (
                        <>
                          <span>•</span>
                          <span>{new Date(posts[0].published_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">
                      <Link 
                        href={`/blog/${posts[0].slug}`}
                        className="hover:text-accent-green transition-colors"
                      >
                        {posts[0].title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {posts[0].excerpt || posts[0].content.substring(0, 200) + "..."}
                    </p>
                    <Link 
                      href={`/blog/${posts[0].slug}`}
                      className="inline-flex items-center text-accent-green hover:text-accent-green/80 transition-colors"
                    >
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            </section>
          )}

          {/* Other posts */}
          {posts.length > 1 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-accent">Recent Posts</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {posts.slice(1).map((post) => (
                  <article key={post.id} className="border border-theme rounded-lg p-6 bg-surface/30 backdrop-blur-sm hover:bg-surface/50 transition-colors">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span>By The Shierbot</span>
                      {post.reading_time_minutes && (
                        <>
                          <span>•</span>
                          <span>{post.reading_time_minutes} min read</span>
                        </>
                      )}
                      {post.published_at && (
                        <>
                          <span>•</span>
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-accent-green transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-accent-green hover:text-accent-green/80 transition-colors text-sm"
                    >
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/blog?page=${page - 1}`}
                    className="px-4 py-2 border border-theme rounded-lg hover:bg-surface/50 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                
                {page < totalPages && (
                  <Link
                    href={`/blog?page=${page + 1}`}
                    className="px-4 py-2 border border-theme rounded-lg hover:bg-surface/50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
