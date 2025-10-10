export default function Home() {
  return (
    <main className="prose prose-invert mx-auto max-w-3xl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Aaron Shier</h1>
          <p className="text-sm text-muted-foreground">Full-stack Engineer — Open to work</p>
        </div>
        <div className="text-sm">
          <div>Seattle, WA</div>
          <div>
            <a className="text-accent" href="mailto:aaron@example.com">
              aaron@example.com
            </a>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Experience</h2>
        <div className="mt-4">
          <article>
            <h3 className="font-semibold">Senior Engineer — Acme Corp</h3>
            <p className="text-sm text-muted-foreground">2021 — Present</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Built scalable web platforms and APIs used by millions of users.</li>
              <li>Led migration to microservices and improved deployment times by 40%.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Education</h2>
        <div className="mt-4">
          <div>
            <strong>BS Computer Science</strong>
            <div className="text-sm text-muted-foreground">State University — 2016–2020</div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Skills</h2>
        <p className="mt-2">TypeScript · React · Next.js · Node.js · PostgreSQL · AWS</p>
      </section>

      <footer className="mt-12 text-sm text-muted-foreground">Generated with as-resume</footer>
    </main>
  );
}
