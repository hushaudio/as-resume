import InteractiveScene, { type GraphNode, type GraphLink } from "@/components/InteractiveScene";
import AudioverseVideoLink from "@/components/AudioverseVideoLink";

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
    "Ric Wake / Caroline Jones",
    "Iron Man 3",
  ],
  about:
    "I turn my own needs into dependable tools—rapid prototypes that harden into production. My lane: the overlap of web/app, audio DSP/JUCE, and local-AI. When others say ‘not possible,’ I map constraints, build the path, and make it stable enough for stage or scale.",
  whatIDo: [
    "Product engineering: building production applications and native tools across web, desktop, and mobile",
    "AI/ML systems: end-to-end pipelines across audio, text, and video — C++/JUCE, ONNX, Transformers/Hugging Face, local and cloud inference",
    "Performance & analytics: instrumentation, SEO-aware frontend engineering, performance budgets and Core Web Vitals; practical experience running A/B tests when needed",
    "Live systems & shows: MIDI/MTC, Max devices, clocking networks, and hardened fail-safe stage rigs",
  ],
  experience: [
    {
      title: "UE5/Game Tech (Consult)",
      company: "deadmau5 (Oberha5li Studios)",
      years: "2024–Present",
      bullets: ["Unblocked TestFlight deployment for Mowingtons."],
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
      years: "2016–Present",
      bullets: [
        "Modular LP system powering UA at scale for Hungryroot (early stage → ~$1B valuation).",
        "Continuous A/B tests, clean event schemas, SEO-aware React/Next builds, CI/CD; green Web Vitals.",
      ],
      link: "https://565media.com"
    },
    {
      title: "Founder/Engineer",
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
        "One-person on-stage live-looping rig with fail-safe recovery.",
        "Max for Live devices + tight sync to Nir Z via MTC and networked clocking.",
      ],
      link: "https://www.rb360.com/"
    },
    {
      title: "Full-Stack Engineer",
      company: "OneShotMove",
      years: "2018",
      bullets: [
        "Booking + instant quoting + payments: Google Maps mileage → live quote → checkout.",
        "Google Calendar availability integration; ops rules; #1 Yelp in Los Angeles (2018).",
      ],
      link: "https://oneshotmove.com"
    },
  ],
  accomplishments: [
    "Stable Audio Open official beta contractor (early access) → informed and accelerated DeepSampler2.",
    "Hungryroot growth: high-converting LPs and analytics stack that scaled paid acquisition.",
    "‘Not possible’ → shipped: live-looping performance system delivered as a working prototype in one week.",
    "Press/Credits (selected): Iron Man 3 soundtrack credit; Southeast Iowa Union feature.",
    "Signed to Strange Music (Tech N9ne) with releases/features — leveraged to open technical collaborations.",
  ],
  projects: [
    "DeepSampler2 — first text→audio-sample VST",
    "Interloper — JUCE/ONNX embedded generator",
    "Audialab Engine — local Python AI host",
    "The Audioverse — decentralized streaming platform",
    "The Oracle — Swiss Ephemeris app (pre-launch)",
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
            <AudioverseVideoLink src="/videos/audioverse.mp4" />
          </span>
        ),
      ],
    },
    {
      title: "The Oracle — Swiss Ephemeris app (pre-launch)",
      date: "2025",
      bullets: ["Swiss Ephemeris astrology app; multi-chart workflow."],
    },
  ],
  music: [
    "Strange Music colaboration release BLIGHT with Tech N9ne",
    "Producer credits for 'Wondergirls - Lets go all the way' in Iron Man 3 soundtrack",
    "Music production for the viral video 'Kazoo Kid' remix (with Mike Diva)",
    "Multiple charting SiriusXM BPM remixes",
    "Producer credits for Orgy — 'Talk Sick', 'Monster in Me'",
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

export default function Home() {
  // Build an interactive knowledge graph from resume data.
  const graph = (() => {
    type Node = GraphNode;
    type Link = GraphLink;
    const nodes: Node[] = [];
    const links: Link[] = [];
    const byId = new Map<string, Node>();

    const addNode = (id: string, label: string, type: Node["type"]) => {
      if (!byId.has(id)) {
        const n = { id, label, type };
        byId.set(id, n);
        nodes.push(n);
      }
    };
    const addLink = (a: string, b: string) => {
      links.push({ source: a, target: b });
    };
    const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    // Helper no longer used after explicit mappings

    // Person
    addNode("person", data.name, "person");

    // Hero creds
    for (const c of data.heroCreds) {
      const id = `cred:${slug(c)}`;
      addNode(id, c, "cred");
      addLink("person", id);
    }

    // Experiences and companies
    for (const role of data.experience) {
      const expId = `exp:${slug(`${role.title}@${role.company}`)}`;
      addNode(expId, `${role.title} — ${role.company}`, "experience");
      addLink("person", expId);

      const compId = `company:${slug(role.company)}`;
      addNode(compId, role.company, "company");
      addLink(expId, compId);
    }

    // Projects
    for (const p of data.projects) {
      const pid = `project:${slug(p)}`;
      addNode(pid, p, "project");
      addLink("person", pid);
    }

      // Creative highlights (Music)
      for (const m of data.music) {
        const mid = `music:${slug(m)}`;
        addNode(mid, m, "music");
        addLink("person", mid);
      }

    // Skills
    for (const s of data.skills) {
      const sid = `skill:${slug(s)}`;
      addNode(sid, s, "skill");
      addLink("person", sid);
    }

    // Explicit link rules: map skills to experiences/projects and creds to related nodes.
    const linkRules = {
      experience: [
        { key: "Founding Engineer — Audialab", skills: ["Python", "C++", "JUCE", "DSP", "ONNX", "React", "TypeScript"] },
        { key: "Contract Engineer — 565 Media", skills: ["React", "Next.js", "Node.js", "CI/CD", "A/B", "CRO", "Nginx", "Docker", "TypeScript"] },
        { key: "Full-Stack Engineer — OneShotMove", skills: ["React", "Next.js", "Node.js", "TypeScript", "CI/CD"] },
        { key: "Consulting Engineer — Ric Wake / Caroline Jones", skills: ["JUCE", "DSP", "MIDI/MTC", "C++"] },
        { key: "UE5/Game Tech (Consult) — deadmau5", skills: ["Unreal Engine 5"] },
        { key: "Founder/Engineer — Iowa COVID County Tracker", skills: ["React", "Next.js", "TypeScript", "Node.js", "CI/CD"] },
      ],
      projects: [
        { key: "DeepSampler2 — first text→audio-sample VST", skills: ["C++", "JUCE", "DSP", "ONNX", "React", "TypeScript"] },
        { key: "Interloper — JUCE/ONNX embedded generator", skills: ["C++", "JUCE", "ONNX", "DSP"] },
        { key: "Audialab Engine — local Python AI host", skills: ["Python", "ONNX", "Docker"] },
        { key: "The Audioverse — decentralized streaming platform", skills: ["React Native", "Node.js", "TypeScript", "Solidity", "CI/CD"] },
        { key: "The Oracle — Swiss Ephemeris app (pre-launch)", skills: ["React", "Next.js", "TypeScript", "Node.js"] },
      ],
      creds: [
        { cred: "Audialab", targets: ["Founding Engineer — Audialab", "DeepSampler2 — first text→audio-sample VST", "Interloper — JUCE/ONNX embedded generator", "Audialab Engine — local Python AI host"] },
        { cred: "Strange Music", targets: ["Strange Music releases with Tech N9ne (feat. Kim Dracula)"] },
        { cred: "Hungryroot", targets: ["Contract Engineer — 565 Media"] },
        { cred: "deadmau5", targets: ["UE5/Game Tech (Consult) — deadmau5"] },
        { cred: "Ric Wake / RB-360", targets: ["Consulting Engineer — Ric Wake / Caroline Jones"] },
        { cred: "Iron Man 3", targets: ["Iron Man 3 soundtrack credit"] },
      ],
    } as const;

    // Build lookup by label for existing nodes
    const labelToId = new Map<string, string>();
    for (const n of nodes) labelToId.set(n.label, n.id);

    // Apply experience skill links
    for (const r of linkRules.experience) {
      const expId = labelToId.get(r.key);
      if (!expId) continue;
      for (const s of r.skills) {
        const sid = labelToId.get(s);
        if (sid) addLink(sid, expId);
      }
    }

    // Apply project skill links
    for (const r of linkRules.projects) {
      const pid = labelToId.get(r.key);
      if (!pid) continue;
      for (const s of r.skills) {
        const sid = labelToId.get(s);
        if (sid) addLink(sid, pid);
      }
    }

    // Apply creds → related nodes
    for (const r of linkRules.creds) {
      const cid = labelToId.get(r.cred);
      if (!cid) continue;
      for (const t of r.targets) {
        const tid = labelToId.get(t);
        if (tid) addLink(cid, tid);
      }
    }

    return { nodes, links };
  })();
  return (
    <main className="prose prose-invert mx-auto max-w-3xl">
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
        <h2 className="text-xl font-medium text-accent-brown">Summary</h2>
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
        {Array.isArray((data as any).projectsDetailed) ? (
          <div className="mt-4 space-y-6">
            {(data as any).projectsDetailed.map((p: { title: string; date?: string; bullets: string[] }, idx: number) => (
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
        <h2 className="text-xl font-medium text-accent-brown">Skills</h2>
        <p className="mt-2">{data.skills.join(" · ")}</p>
      </section>

      {/* One-liner integrated into Summary; section removed for professional tone */}

      <section className="mt-10">
        <h2 className="text-xl font-medium text-accent">Interactive</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Knowledge graph of this resume. Click a node to explore related items.
        </p>
        <div className="mt-4">
          <InteractiveScene graph={graph} />
        </div>
      </section>

      <footer className="mt-12 text-sm text-muted-foreground">Generated with as-resume</footer>
    </main>
  );
}
