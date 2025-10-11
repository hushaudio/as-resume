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

// Comprehensive metadata for graph tooltips
const graphMetadata = {
  projects: {
    "DeepSampler2": {
      description: "First-ever text-to-audio-sample VST plugin. Built with C++/JUCE for DSP processing and React/Vite for the UI. Integrated with Audialab Engine for local AI inference using ONNX. Developed from early access to Stable Audio Open, turning cutting-edge research into a production plugin. Key challenges: real-time audio processing, ONNX model optimization, seamless UI-to-DSP communication.",
      stack: ["C++", "JUCE", "React", "Vite", "ONNX", "DSP"],
      timeline: "2023–Present",
      impact: "First-to-market product in text-to-audio VST space"
    },
    "Interloper": {
      description: "JUCE plugin with fully embedded ONNX runtime for in-plugin AI audio generation—no external dependencies. C++/JUCE backend handles DSP and model inference, React/Vite UI provides intuitive controls. Eliminated the need for separate engine installations, dramatically reducing setup friction and support load.",
      stack: ["C++", "JUCE", "ONNX", "React", "Vite", "DSP"],
      timeline: "2023–Present",
      impact: "Zero-dependency AI audio plugin"
    },
    "Audialab Engine": {
      description: "Python desktop application for hosting local AI audio models. Supports hot-swappable backends from Hugging Face and community sources. Built with PyInstaller for distribution (handled by team). Enables offline, creator-friendly workflows with hackable model pipelines. Designed for rapid model experimentation without cloud dependencies.",
      stack: ["Python", "ONNX", "Docker"],
      timeline: "2023–Present",
      impact: "Empowers creators with local AI tools"
    },
    "The Audioverse": {
      description: "Decentralized streaming platform proof-of-concept. React Native mobile app with wallet integration, WatermelonDB for offline-first local state, ENS for user profiles, QR flows for purchases. NestJS backend handles API/standard for NFT-inherited release ownership. Audio chunked to IPFS for decentralized storage with public/private encryption. Oracle 'The Crossroads' computes real-time charts from on-chain sales data. Demonstrates end-to-end creator-owned distribution.",
      stack: ["React Native", "NestJS", "Solidity", "IPFS", "WatermelonDB", "Goerli"],
      timeline: "2022–2024",
      impact: "First-principles decentralized music platform"
    },
    "The Oracle": {
      description: "Swiss Ephemeris astrology application with multi-chart workflows (natal, transits, progressions, returns). Google and Apple Calendar integrations enable event-based chart generation. AI chatbot with pinned charts and scheduling tool access provides contextual astrological insights. Synastry charts support custom relationship types. Daily insights pipeline automatically generates 5 charts per day for personalized forecasting. Built with React/Next.js, integrated with calendar APIs and OpenAI.",
      stack: ["React", "Next.js", "TypeScript", "Node.js", "OpenAI", "Calendar APIs"],
      timeline: "2024–Present (pre-launch)",
      impact: "AI-powered astrology with calendar intelligence"
    }
  },
  skills: {
    "React": {
      description: "6+ years building production web and mobile apps. Used across Hungryroot LPs, The Audioverse, The Oracle, and Audialab plugins. Expert in performance optimization, SEO-aware rendering, and component architecture.",
      projects: ["DeepSampler2", "Interloper", "The Audioverse", "The Oracle", "565 Media work"],
      proficiency: "Expert"
    },
    "Next.js": {
      description: "4+ years building SEO-optimized, server-rendered applications. Implemented for Hungryroot's landing pages achieving green Core Web Vitals. Used in The Oracle for SSR astrology charts.",
      projects: ["The Oracle", "565 Media landing pages"],
      proficiency: "Advanced"
    },
    "React Native": {
      description: "3+ years building cross-platform mobile apps. Developed The Audioverse mobile app with wallet integration, offline-first architecture using WatermelonDB, and complex QR/NFC flows.",
      projects: ["The Audioverse"],
      proficiency: "Advanced"
    },
    "TypeScript": {
      description: "5+ years for type-safe development across full-stack applications. Primary language for web/mobile projects, ensuring maintainability and reducing runtime errors.",
      projects: ["All modern web projects", "The Oracle", "The Audioverse", "565 Media"],
      proficiency: "Expert"
    },
    "Python": {
      description: "4+ years for AI/ML pipelines and desktop applications. Built Audialab Engine for local model hosting. Experience with PyInstaller, model serving, and data processing pipelines.",
      projects: ["Audialab Engine"],
      proficiency: "Advanced"
    },
    "C++": {
      description: "3+ years specializing in audio DSP and real-time processing. Core language for JUCE plugins (DeepSampler2, Interloper). Handles real-time audio, ONNX integration, and low-latency requirements.",
      projects: ["DeepSampler2", "Interloper"],
      proficiency: "Advanced"
    },
    "JUCE": {
      description: "3+ years building professional audio plugins. Framework for all Audialab VST/AU plugins. Deep knowledge of audio processing, plugin architecture, and cross-platform compilation.",
      projects: ["DeepSampler2", "Interloper", "Max for Live devices"],
      proficiency: "Expert"
    },
    "DSP": {
      description: "3+ years of digital signal processing for audio applications. Implemented real-time audio effects, sample processing, and spectral analysis. Critical skill for all audio plugin development.",
      projects: ["DeepSampler2", "Interloper", "Live audio rigs"],
      proficiency: "Advanced"
    },
    "ONNX": {
      description: "2+ years integrating ML models into production applications. Embedded ONNX runtime in C++ for Interloper, optimized inference for real-time audio. Experience with model quantization and performance tuning.",
      projects: ["DeepSampler2", "Interloper", "Audialab Engine"],
      proficiency: "Advanced"
    },
    "Node.js": {
      description: "6+ years building scalable backends. Used for NestJS APIs, serverless functions, and build tooling. Powers backends for The Audioverse, The Oracle, and 565 Media projects.",
      projects: ["The Audioverse", "The Oracle", "565 Media", "OneShotMove"],
      proficiency: "Expert"
    },
    "NestJS": {
      description: "3+ years building structured, type-safe APIs. Framework of choice for The Audioverse backend. Provides clean architecture with dependency injection and modular design.",
      projects: ["The Audioverse"],
      proficiency: "Advanced"
    },
    "Solidity": {
      description: "2+ years writing smart contracts for NFT and DeFi applications. Developed custom NFT-inherited contracts for The Audioverse release ownership. Deployed to Goerli testnet.",
      projects: ["The Audioverse"],
      proficiency: "Intermediate"
    },
    "Docker": {
      description: "5+ years containerizing applications for consistent deployments. Used for dev environments, CI/CD pipelines, and production deployments across 565 Media and Audialab projects.",
      projects: ["Audialab Engine", "565 Media", "The Audioverse"],
      proficiency: "Advanced"
    },
    "Unreal Engine 5": {
      description: "1 year consulting on game deployment pipelines. Unblocked TestFlight release for deadmau5's Meowingtons game. Expertise in build automation and platform-specific quirks.",
      projects: ["deadmau5 Meowingtons"],
      proficiency: "Intermediate"
    },
    "Max for Live": {
      description: "4+ years creating custom Ableton devices. Built live-looping rig for Caroline Jones with fail-safe recovery, MTC sync, and networked clocking. Deep integration with MIDI/audio routing.",
      projects: ["Ric Wake / Caroline Jones rig"],
      proficiency: "Advanced"
    },
    "MIDI/MTC": {
      description: "4+ years implementing MIDI timing and control. Built rock-solid sync systems for live performances. Experience with MIDI Clock, MTC, and networked timing across multiple devices.",
      projects: ["Ric Wake / Caroline Jones rig", "Live shows"],
      proficiency: "Expert"
    },
    "CI/CD": {
      description: "5+ years automating build and deployment pipelines. Implemented for 565 Media landing pages, ensuring rapid iteration and reliable deploys. GitHub Actions, automated testing, and deployment workflows.",
      projects: ["565 Media", "OneShotMove", "The Audioverse"],
      proficiency: "Advanced"
    },
    "Nginx": {
      description: "4+ years configuring web servers and reverse proxies. Used for high-traffic sites at 565 Media. Expert in SSL/TLS, caching strategies, and load balancing.",
      projects: ["565 Media infrastructure"],
      proficiency: "Advanced"
    }
  },
  experience: {
    "Founding Engineer — Audialab": {
      description: "Led development of three groundbreaking AI audio plugins as first engineering hire. DeepSampler2: world's first text-to-audio-sample VST. Interloper: embedded-ONNX generator. Audialab Engine: local model host. Architected full stack from DSP to UI, integrated cutting-edge AI models, and shipped production tools used by thousands of producers.",
      technologies: ["C++", "JUCE", "Python", "React", "ONNX", "DSP"],
      keyAchievements: ["First-to-market text-to-audio VST", "Zero-dependency AI plugin architecture", "Stable Audio Open beta contractor"]
    },
    "Contract Engineer — 565 Media": {
      description: "Built modular landing page system powering user acquisition for Hungryroot (early stage → ~$1B valuation). Implemented continuous A/B testing framework, clean analytics event schemas, and SEO-optimized React/Next builds with green Core Web Vitals. Maintained CI/CD pipelines and scaled infrastructure to handle high-traffic campaigns.",
      technologies: ["React", "Next.js", "Node.js", "Docker", "Nginx", "CI/CD"],
      keyAchievements: ["Scaled to $1B valuation growth", "Green Core Web Vitals at scale", "Modular LP system"]
    },
    "Full-Stack Engineer — OneShotMove": {
      description: "Built complete booking platform with instant quoting, payments, and scheduling. Integrated Google Maps for mileage calculation, Google Calendar for crew availability, and ops rules engine. Achieved #1 Yelp ranking in Los Angeles (2018) through exceptional UX and reliable service.",
      technologies: ["React", "Next.js", "Node.js", "Google APIs"],
      keyAchievements: ["#1 Yelp in LA (2018)", "Real-time quote engine", "Calendar-driven scheduling"]
    },
    "Consulting Engineer — Ric Wake / Caroline Jones": {
      description: "Designed and built one-person live-looping rig for on-stage performances—a system industry experts said wasn't possible. Created custom Max for Live devices with fail-safe recovery, tight MTC sync with Nir Z's drums, and networked clocking for sample-accurate timing. Delivered working prototype in one week, hardened for tour reliability.",
      technologies: ["Max for Live", "MIDI/MTC"],
      keyAchievements: ["'Impossible' system shipped in 1 week", "Tour-proven reliability", "Fail-safe recovery architecture"]
    },
    "UE5/Game Tech (Consult) — deadmau5": {
      description: "Unblocked TestFlight deployment pipeline for Meowingtons Simulator (Unreal Engine 5 title). Documented repeatable release process, solved platform-specific build issues, and provided ongoing technical advisement for game deployment.",
      technologies: ["Unreal Engine 5"],
      keyAchievements: ["Unblocked TestFlight release", "Documented deployment process"]
    },
    "Founder/Engineer — Iowa COVID County Tracker": {
      description: "Ingested and normalized Iowa state COVID reports into county-level dashboards during the pandemic. Provided trend visibility for local communities. Featured by Southeast Iowa Union for public service.",
      technologies: ["React", "Next.js", "TypeScript", "Data processing"],
      keyAchievements: ["Southeast Iowa Union feature", "Real-time data visualization"]
    }
  },
  companies: {
    "Audialab": {
      description: "AI audio technology company developing cutting-edge VST plugins. Pioneering text-to-audio generation for music producers."
    },
    "565 Media": {
      description: "Digital marketing agency specializing in high-converting landing pages and growth marketing for startups."
    },
    "deadmau5 (Oberha5li Studios)": {
      description: "Electronic music producer and game developer. Creator of Meowingtons Simulator and various music tech projects."
    },
    "OneShotMove": {
      description: "Moving and logistics startup offering instant quotes and calendar-based booking in Los Angeles."
    },
    "Ric Wake / RB-360": {
      description: "Music production and live performance company. Collaborations with Caroline Jones and drummer Nir Z."
    },
    "Iowa COVID County Tracker": {
      description: "Public service project providing granular COVID-19 data visualization for Iowa communities during the pandemic."
    }
  },
  music: {
    "Strange Music colaboration release BLIGHT with Tech N9ne": {
      description: "Production work on BLIGHT, a Strange Music label release. Collaboration with Tech N9ne, one of the most successful independent hip-hop artists. Demonstrated ability to work at professional label standards while maintaining creative integrity."
    },
    "Producer credits for 'Wondergirls - Lets go all the way' in Iron Man 3 soundtrack": {
      description: "Production credit on Wondergirls track featured in Marvel's Iron Man 3 official soundtrack. High-profile sync placement demonstrating production quality and industry connections."
    },
    "Music production for the viral video 'Kazoo Kid' remix (with Mike Diva)": {
      description: "Viral remix collaboration with director Mike Diva. Multi-million view remix demonstrating ability to create culturally relevant content that resonates with internet audiences."
    },
    "Multiple charting SiriusXM BPM remixes": {
      description: "Several official remixes that charted on SiriusXM's BPM electronic music channel (2009-2012). Demonstrated consistent ability to create radio-ready dance music productions."
    },
    "Producer credits for Orgy — 'Talk Sick', 'Monster in Me'": {
      description: "Production work with industrial rock band Orgy. Contributed to multiple album tracks, working with established artists in the alternative/industrial scene."
    }
  },
  creds: {
    "Audialab": {
      description: "Founding engineer role developing world-first AI audio plugins used by thousands of music producers globally."
    },
    "Strange Music": {
      description: "Label founded by Tech N9ne. Signed artist status with releases and feature collaborations, including work with Kim Dracula."
    },
    "Hungryroot": {
      description: "Grocery startup that grew from early stage to ~$1B valuation. Provided engineering that scaled their user acquisition."
    },
    "deadmau5": {
      description: "Grammy-nominated electronic music producer. Consulting on Unreal Engine game development and deployment."
    },
    "Ric Wake / RB-360": {
      description: "Music industry veteran (Ric Wake) and rising country artist (Caroline Jones). Built tour-grade live technology."
    },
    "Iron Man 3": {
      description: "Marvel blockbuster film. Production credit on official soundtrack demonstrating professional-grade work."
    }
  }
};

export default function Home() {
  // Build an interactive knowledge graph from resume data.
  const graph = (() => {
    type Node = GraphNode;
    type Link = GraphLink;
    const nodes: Node[] = [];
    const links: Link[] = [];
    const byId = new Map<string, Node>();

    const addNode = (id: string, label: string, type: Node["type"], meta?: Record<string, unknown>) => {
      if (!byId.has(id)) {
        const n = { id, label, type, meta };
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
      const meta = graphMetadata.creds[c as keyof typeof graphMetadata.creds];
      addNode(id, c, "cred", meta);
      addLink("person", id);
    }

    // Experiences and companies
    for (const role of data.experience) {
      const expId = `exp:${slug(`${role.title}@${role.company}`)}`;
      const expKey = `${role.title} — ${role.company}`;
      const expMeta = graphMetadata.experience[expKey as keyof typeof graphMetadata.experience];
      addNode(expId, expKey, "experience", expMeta);
      addLink("person", expId);

      const compId = `company:${slug(role.company)}`;
      const compMeta = graphMetadata.companies[role.company as keyof typeof graphMetadata.companies];
      addNode(compId, role.company, "company", compMeta);
      addLink(expId, compId);
    }

    // Projects
    for (const p of data.projects) {
      const pid = `project:${slug(p)}`;
      // Extract clean project name for metadata lookup
      const projectName = p.split(" — ")[0];
      const projectMeta = graphMetadata.projects[projectName as keyof typeof graphMetadata.projects];
      addNode(pid, p, "project", projectMeta);
      addLink("person", pid);
    }

      // Creative highlights (Music)
      for (const m of data.music) {
        const mid = `music:${slug(m)}`;
        const musicMeta = graphMetadata.music[m as keyof typeof graphMetadata.music];
        addNode(mid, m, "music", musicMeta);
        addLink("person", mid);
      }

    // Skills
    for (const s of data.skills) {
      const sid = `skill:${slug(s)}`;
      const skillMeta = graphMetadata.skills[s as keyof typeof graphMetadata.skills];
      addNode(sid, s, "skill", skillMeta);
      addLink("person", sid);
    }

    // Explicit link rules: map skills to experiences/projects and creds to related nodes.
    const linkRules = {
      experience: [
        { key: "Founding Engineer — Audialab", skills: ["Python", "C++", "JUCE", "DSP", "ONNX", "React", "TypeScript"] },
        { key: "Contract Engineer — 565 Media", skills: ["React", "Next.js", "Node.js", "CI/CD", "Nginx", "Docker", "TypeScript"] },
        { key: "Full-Stack Engineer — OneShotMove", skills: ["React", "Next.js", "Node.js", "TypeScript", "CI/CD"] },
        { key: "Consulting Engineer — Ric Wake / RB-360", skills: ["Max for Live", "MIDI/MTC"] },
        { key: "UE5/Game Tech (Consult) — deadmau5 (Oberha5li Studios)", skills: ["Unreal Engine 5"] },
        { key: "Founder/Engineer — Iowa COVID County Tracker", skills: ["React", "Next.js", "TypeScript", "Node.js", "CI/CD"] },
      ],
      projects: [
        { key: "DeepSampler2 — first text→audio-sample VST", skills: ["C++", "JUCE", "DSP", "ONNX", "React", "TypeScript"] },
        { key: "Interloper — JUCE/ONNX embedded generator", skills: ["C++", "JUCE", "ONNX", "DSP"] },
        { key: "Audialab Engine — local Python AI host", skills: ["Python", "ONNX", "Docker"] },
        { key: "The Audioverse — decentralized streaming platform", skills: ["React Native", "NestJS", "Node.js", "TypeScript", "Solidity", "CI/CD"] },
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
