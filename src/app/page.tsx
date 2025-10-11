import InteractiveScene, { type GraphNode, type GraphLink } from "@/components/InteractiveScene";

const data = {
  name: "HU$H (Aaron Shier)",
  tagline:
    "Engineer-artist who unfolds solutions where there’s no template—and ships them reliable.",
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
    "I turn rough needs into dependable tools—rapid prototypes that harden into production. My lane is the overlap of web/app, audio DSP/JUCE, and local-AI.",
  experience: [
    {
      title: "Founding Engineer",
      company: "Audialab",
      years: "2023–Present",
      bullets: [
        "Official Stable Audio Open beta contractor; used early access to lead DeepSampler2.",
        "Built DeepSampler2 (first text-to-audio-sample VST) and the Python Audialab Engine.",
        "Created Interloper with embedded ONNX in JUCE; React/Vite UI.",
      ],
    },
    {
      title: "Contract Engineer",
      company: "565 Media",
      years: "2016–Present",
      bullets: [
        "Modular LP system powering UA for Hungryroot (early stage → ~$1B valuation).",
        "Continuous A/B, analytics hygiene, SEO, CI/CD; green Core Web Vitals.",
      ],
    },
    {
      title: "Consulting Engineer",
      company: "Ric Wake / Caroline Jones",
      years: "2020–2022",
      bullets: [
        "One-person live-looping rig with fail-safe recovery.",
        "Max devices + MTC clocking with Nir Z.",
      ],
    },
    {
      title: "UE5/Game Tech (Consult)",
      company: "deadmau5",
      years: "2024–Present",
      bullets: ["Unblocked TestFlight; documented release path; ongoing advisement."],
    },
    {
      title: "Founder/Engineer",
      company: "Iowa COVID County Tracker",
      years: "2020",
      bullets: ["County-level dashboards; local press coverage."],
    },
  ],
  projects: [
    "DeepSampler2 — first text→audio-sample VST",
    "Interloper — JUCE/ONNX embedded generator",
    "Audialab Engine — local Python AI host",
    "The Oracle — Swiss Ephemeris app (pre-launch)",
  ],
  music: [
    "Strange Music releases with Tech N9ne (feat. Kim Dracula)",
    "Iron Man 3 soundtrack credit",
    "Viral Kazoo Kid remix; SiriusXM remixes",
    "Produced Orgy — 'Talk Sick'",
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
    "MIDI/MTC",
    "ONNX",
    "Unreal 5",
    "Docker",
    "Nginx",
    "CI/CD",
    "A/B",
    "CRO",
    "C#",
    "PHP",
    "Solidity",
  ],
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

    // Music
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
        { key: "Consulting Engineer — Ric Wake / Caroline Jones", skills: ["JUCE", "DSP", "MIDI/MTC", "C++"] },
        { key: "UE5/Game Tech (Consult) — deadmau5", skills: ["Unreal 5"] },
        { key: "Founder/Engineer — Iowa COVID County Tracker", skills: ["React", "Next.js", "TypeScript", "Node.js", "CI/CD"] },
      ],
      projects: [
        { key: "DeepSampler2 — first text→audio-sample VST", skills: ["C++", "JUCE", "DSP", "ONNX", "React", "TypeScript"] },
        { key: "Interloper — JUCE/ONNX embedded generator", skills: ["C++", "JUCE", "ONNX", "DSP"] },
        { key: "Audialab Engine — local Python AI host", skills: ["Python", "ONNX", "Docker"] },
        { key: "The Oracle — Swiss Ephemeris app (pre-launch)", skills: ["React", "Next.js", "TypeScript", "Node.js"] },
      ],
      creds: [
        { cred: "Audialab", targets: ["Founding Engineer — Audialab", "DeepSampler2 — first text→audio-sample VST", "Interloper — JUCE/ONNX embedded generator", "Audialab Engine — local Python AI host"] },
        { cred: "Strange Music", targets: ["Strange Music releases with Tech N9ne (feat. Kim Dracula)"] },
        { cred: "Hungryroot", targets: ["Contract Engineer — 565 Media"] },
        { cred: "deadmau5", targets: ["UE5/Game Tech (Consult) — deadmau5"] },
        { cred: "Ric Wake / Caroline Jones", targets: ["Consulting Engineer — Ric Wake / Caroline Jones"] },
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
          <p className="text-sm text-muted-foreground">{data.tagline}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {data.heroCreds.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 ring-1 ring-white/10"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <div>
            <a className="text-accent" href={`mailto:${data.email}`}>
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
        <h2 className="text-xl font-medium">About</h2>
        <p className="mt-2">{data.about}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Experience</h2>
        <div className="mt-4 space-y-6">
          {data.experience.map((role) => (
            <article key={`${role.title}-${role.company}`}>
              <h3 className="font-semibold">
                {role.title} — {role.company}
              </h3>
              <p className="text-sm text-muted-foreground">{role.years}</p>
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
        <h2 className="text-xl font-medium">Projects</h2>
        <ul className="list-disc ml-5 mt-4">
          {data.projects.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Music</h2>
        <ul className="list-disc ml-5 mt-4">
          {data.music.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Skills</h2>
        <p className="mt-2">{data.skills.join(" · ")}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium">Interactive</h2>
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
