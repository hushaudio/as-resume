import Link from "next/link";

export default function NotFound() {
  return (
    <main className="prose prose-invert mx-auto max-w-4xl mt-18 px-4 relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-green to-accent-purple animate-gradient-shift" />
      </div>

      <div className="text-center py-20">
        <h1 className="text-6xl font-bold mb-4 text-accent-green">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The blog post you're looking for doesn't exist or may have been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/blog"
            className="px-6 py-3 bg-accent-green/10 border border-accent-green/20 rounded-lg hover:bg-accent-green/20 transition-colors"
          >
            Browse All Articles
          </Link>
          <Link 
            href="/resume"
            className="px-6 py-3 border border-theme rounded-lg hover:bg-surface/50 transition-colors"
          >
            Back to Resume
          </Link>
        </div>
      </div>
    </main>
  );
}
