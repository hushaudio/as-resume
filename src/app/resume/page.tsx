import VideoPopup from "@/components/VideoPopup";

const data = {
  name: "Aaron Shier",
  title: "Senior Full-Stack & Creative-Audio Engineer",
  tagline: "Creative solutions for complex problems.",
  email: "hush@ohshutit.com",
  github: "https://github.com/hushaudio",
  heroCreds: [
    "Audialab",
    "Strange Music",
    "Hungryroot",
    "deadmau5",
    "Oberha5li Studios",
    "Ric Wake / RB-360",
    "Iron Man 3",
  ],
  about:
    "I build the bridge from prototype to production across web/mobile (Next.js, React Native), audio DSP/JUCE (C++), and local-AI (Python/ONNX). I scope constraints fast, ship reliable systems, and harden them for live shows or large-scale traffic—often with analytics/CRO baked in.",
  whatIDo: [
    "Product engineering: building production applications and native tools across web, desktop, and mobile",
    "AI/ML systems: end-to-end pipelines across audio, text, image, and video — C++/JUCE, ONNX, Transformers/Hugging Face, local and cloud inference. Trained 1000+ models spanning text, image, and audio generation",
    "Performance & analytics: instrumentation, SEO-aware frontend engineering, performance budgets and Core Web Vitals; practical experience running A/B tests when needed",
    "Live systems & shows: MIDI/MTC, Max devices, clocking networks, and hardened fail-safe stage rigs",
  ],
  experience: [
    {
      title: "UE5/Game Tech",
      company: "Oberha5li Studios (deadmau5)",
      years: "2024–Present",
      bullets: ["Unblocked TestFlight deployment for Mowingtons.", "Was asked to stay on the team to handle iOS deployment, replacing a publishing company."],
      link: "https://store.steampowered.com/app/2766880/Meowingtons_Simulator/"
    },
    {
      title: "Founding Engineer",
      company: "Audialab",
      years: "2024–Present",
      bullets: [
        "Designed and built DeepSampler2 (first ever text-to-audio-sample VST).",
        "Designed and built Audialab Engine desktop application (Python) for local model hosting; hot-swappable community models.",
        "Designed and built Interloper, working with our incredible team on the ONNX integration (React/Vite + C++/JUCE + embedded ONNX for native AI audio generation).",
      ],
      link: "https://audialab.com"
    },
    {
      title: "Contract Engineer",
      company: "565 Media",
      years: "2015–Present",
      bullets: [
        "Built solutions for 30+ marketing clients using Klaviyo, Google APIs, Twilio, Google Analytics (Multiple Generations), Google Tag Manager, Facebook Pixels, Mailchimp, HubSpot, SendGrid, Zapier, WordPress, Shopify, WooCommerce, and more.",
        "Modular LP system powering UA at scale for Hungryroot (early stage → ~$1B valuation).",
        "Built and managed 565media.com (Node.js/Strapi/Next.js); previously a custom WordPress theme I created for them in 2015.",
        "SEO-aware React/Next/EJS/Wordpress landing pages and websites, performance optimizations, analytics instrumentation, and technical delivery supporting high-scale marketing and paid acquisition.",
      ],
      link: "https://565media.com"
    },
    {
      title: "Founder",
      company: "Iowa COVID County Tracker",
      years: "2020",
      bullets: ["County-level dashboards from state data; covered by Southeast Iowa Union."],
      link: "https://www.southeastiowaunion.com/news/fairfield-man-designs-app-to-track-covid/"
    },
    {
      title: "Consulting Engineer",
      company: "Ric Wake / RB-360",
      years: "2016–2019",
      bullets: [
        "Created a one-person on-stage live-looping rig with fail-safe recovery.",
        "Max for Live devices + tight sync to Nir Z via MTC and networked clocking.",
      ],
      link: "https://www.rb360.com/"
    },
    {
      title: "Full-Stack Engineer",
      company: "OneShotMove",
      years: "2018",
      bullets: [
        "Built complete booking platform with instant quoting and payments using Google Maps mileage calculations.",
        "Integrated Google Calendar for crew availability and ops rules; company achieved #1 Yelp ranking in Los Angeles (2018).",
      ],
      link: "https://oneshotmove.com"
    },
  ],
  accomplishments: [
    "Stable Audio Open official beta contractor (early access) → informed and accelerated DeepSampler2.",
    "Hungryroot growth: high-converting LPs and analytics stack that scaled paid acquisition.",
    "'Not possible' → shipped: live-looping performance system delivered as a working prototype in one week.",
    "Press/Credits (selected): Iron Man 3 soundtrack credit; Southeast Iowa Union feature.",
    "Signed to Strange Music (Tech N9ne) with releases/features — leveraged to open technical collaborations.",
  ],
  projects: [
    "DeepSampler2",
    "Interloper",
    "Audialab Engine",
    "The Audioverse",
    "The Oracle",
  ],
  // Detailed projects for page rendering (graph uses projects above)
  projectsDetailed: [
    {
      title: "The Audioverse — decentralized streaming platform",
      date: "2022",
      bullets: [
        "Ownership & releases: NFT-inherited class specific to Audioverse releases; platform-defined API/standard.",
        "Storage/streaming: audio chunked to IPFS; public/private files with encryption.",
        "Oracle: 'The Crossroads' computed sales to produce real-time charts.",
        "Mobile app (React Native): wallet support, WatermelonDB local store; ENS user profiles; QR sharing to purchase flows.",
        (
          <span key="audioverse-video">
            <VideoPopup 
              src="/videos/audioverse.mp4" 
              linkText="click here for video example"
              description='This demo uses mock data for the "Audioverse" and "Feed" screens to illustrate flows that would normally require larger amounts of user data. "Scan", "Library", and "Profile" screens all use real blockchain data on the Goerli test network and real IPFS peer shared data for full decentralization.'
              linkColor="text-accent"
            />
          </span>
        ),
      ],
    },
    {
      title: "The Oracle — Swiss Ephemeris app (pre-launch)",
      date: "2025",
      bullets: [
        "Multi-chart astrology workflow: natal, transits, progressions, returns with Swiss Ephemeris calculations.",
        "Google and Apple Calendar integrations for event-based chart generation.",
        "AI chatbot with pinned charts and scheduling tool access for contextual insights.",
        "Synastry charts with custom relationship types for relationship analysis.",
        "Daily insights pipeline: automated generation of 5 daily charts for personalized forecasting.",
        "Built with React/Next.js, TypeScript, Node.js; calendar APIs; OpenAI integration for chatbot.",
      ],
    },
  ],
  music: [
    "Strange Music",
    "W.H.A.T. — Tech N9ne, HU$H, Kim Dracula",
    "BLIGHT — Tech N9ne, HU$H",
    "Iron Man 3 soundtrack credit",
    "Kazoo Kid remix (with Mike Diva)",
    "SiriusXM BPM remixes",
    "Orgy — 'Talk Sick', 'Monster in Me'",
  ],
  skills: [
    "React",
    "Next.js",
    "React Native",
    "NestJS",
    "Node.js",
    "TypeScript",
    "Python",
    "C++",
    "JUCE",
    "DSP",
    "Max for Live",
    "MIDI/MTC",
    "ONNX",
    "Unreal Engine 5",
    "Docker",
    "Nginx",
    "CI/CD",
    "DevOps",
    "C#",
    "Shopify API",
    "Neo4j",
    "SQL",
    "PHP",
    "Solidity",
    "transformers",
    "AI Infrastructure",
  ],
  oneLiner:
    "Nothing is impossible, some things just haven't been developed yet.",
} as const;

export default function Resume() {
  return (
    <main className="prose prose-invert mx-auto max-w-3xl mt-18 px-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{data.name}</h1>
          <p className="text-sm">{data.title}</p>
          <p className="text-sm text-muted-foreground">{data.tagline}</p>
          {/* <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {data.heroCreds.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 ring-1 ring-white/10 text-accent-green"
              >
                {c}
              </span>
            ))}
          </div> */}
        </div>
        <div className="text-sm">
          <div>
            <a className="text-accent-green" href={`mailto:${data.email}`}>
              {data.email}
            </a>
          </div>
          <div>
            <a
              className="text-accent"
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Summary</h2>
        <p className="mt-2">{data.about}</p>
        {data.oneLiner && (
          <p className="mt-2 text-sm text-muted-foreground">{data.oneLiner}</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium text-accent-green">Core Competencies</h2>
        <ul className="list-disc ml-5 mt-4">
          {data.whatIDo.map((w, i) => (
            <li className="mb-4" key={i}>{w}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium text-accent">Experience</h2>
        <div className="mt-4 space-y-6">
          {data.experience.map((role) => (
            <article key={`${role.title}-${role.company}`}>
              <div className="flex items-start gap-4">
                <div className="border-l-2 pl-3" style={{ borderColor: 'var(--accent)' }}>
                  <h3 className="font-semibold mb-0">{role.title} — {role.company}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{role.years}</p>
                </div>
              </div>
              <ul className="list-disc ml-5 mt-2">
                {role.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium text-accent-brown">Projects</h2>
        {Array.isArray(data.projectsDetailed) ? (
          <div className="mt-4 space-y-6">
            {data.projectsDetailed.map((p, idx: number) => (
              <article key={idx}>
                <div className="border-l-2 pl-3" style={{ borderColor: 'var(--accent-brown)' }}>
                  <h3 className="font-semibold">{p.title}</h3>
                  {p.date && <p className="text-sm text-muted-foreground mt-1">({p.date})</p>}
                </div>
                {p.bullets?.length > 0 && (
                  <ul className="list-disc ml-5 mt-2">
                    {p.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        ) : (
          <ul className="list-disc ml-5 mt-4">
            {data.projects.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}
      </section>

      {/* <section className="mt-8">
        <h2 className="text-xl font-medium text-accent-green">Achievements</h2>
        <ul className="list-disc ml-5 mt-4">
          {data.accomplishments.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section> */}

      <section className="mt-8">
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer">Creative credits (optional)</summary>
          <ul className="list-disc ml-5 mt-2">
            {data.music.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </details>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Skills</h2>
        <p className="mt-2">{data.skills.join(" · ")}</p>
      </section>

      {/* One-liner integrated into Summary; section removed for professional tone */}

      <footer className="mt-12 text-sm text-muted-foreground pb-4 pt-4">Created by Aaron Shier using Next.js</footer>
    </main>
  );
}
