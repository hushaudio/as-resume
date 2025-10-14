"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import VideoPopup from "@/components/VideoPopup";

const data = {
  name: "Aaron Shier",
  title: "Senior Full-Stack + Audio/AI Engineer",
  tagline: "Remote (US)",
  email: "hush@ohshutit.com",
  github: "https://github.com/hushaudio",
  portfolio: "https://ohshutit.com",
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
    "I take ideas from prototype to production across web/mobile (TypeScript: Next.js, React Native), audio DSP/JUCE (C++), and local-AI (Python/ONNX). I build robust, scalable systems—with analytics and CRO integrated. Recent work: unblocked iOS releases for deadmau5's UE5 game team, shipped ONNX-powered audio generation in a JUCE VST plugin, and kept marketing LPs fast with over ~1M daily visits.",
  whatIDo: [
    "Product & Platform: Next.js/React Native, Node.js/NestJS, JUCE/C++, TypeScript",
    "Audio/AI: ONNX, Transformers/HF, local + cloud inference, real-time DSP",
    "Perf & Growth: Core Web Vitals (LCP/CLS/INP), SEO, analytics pipelines, CRO experiment design",
    "Live & Reliability: MIDI/MTC, Max for Live, clocking, fail-safe rigs, CI/CD"
  ],
  experience: [
    {
      title: "Contract Engineer",
      company: "565 Media",
      years: "2015–Present",
      bullets: [
        <>Delivered LP/analytics systems for <strong>50+ clients</strong>; owned GA/GTM/Klaviyo/Mail/SMS integrations end-to-end.</>,
        <><strong>Hungryroot</strong>: modular LP framework that scaled user acquisition; handled up to ~<strong>1M daily visits</strong> with Core Web Vitals passing and &lt;2.5s LCP on priority routes; improved experiment cadence and pixel hygiene, leading to noticeably better CPA.</>,
        "Built and maintained 565media.com (Node/Strapi/Next); migrated from legacy WordPress while preserving SEO equity."
      ],
      link: "https://565media.com"
    },
    {
      title: "UE5 / iOS Release Engineer",
      company: "Oberha5li Studios (deadmau5)",
      years: "2024–Present",
      bullets: [
        "Unblocked TestFlight for *Mowingtons* by fixing provisioning, bundle IDs, and entitlements; cut release lead time to ~4 hours.",
        "Offered a streamlined TestFlight pipeline; instead, Joel asked me to join the team directly so they could depend on me for releases instead of a competative game publisher."
      ],
      link: "https://store.steampowered.com/app/2766880/Meowingtons_Simulator/"
    },
    {
      title: "Founding Engineer",
      company: "Audialab",
      years: "2024–Present",
      bullets: [
        <>Shipped <strong>DeepSampler2</strong> (text→audio-sample VST) with embedded ONNX in JUCE; gen times &lt;3s on 4090, &lt;25s on M-series for up to 48s of audio using high quality settings.</>,
        <>Built <strong>Audialab Engine</strong> (Python desktop) for hot-swappable local models; first in existance model runner application for local generative text to audio inference. 3.5k+ downloads on release weekend.</>,
        <>Designed and created <strong>Interloper</strong> (React/Vite + JUCE/ONNX) enabling native AI audio generation on the plugin level.</>
      ],
      link: "https://audialab.com"
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
        "Designed and deployed an advanced live-looping rig spanning two networked computers and multiple MIDI devices, featuring automatic fail-safe recovery; synchronized Ableton (Max for Live) to the drummer over the network via MTC. Highly resilient, complex multi-device system."
      ],
      link: "https://www.rb360.com/"
    },
    {
      title: "Full-Stack Engineer",
      company: "OneShotMove",
      years: "2018",
      bullets: [
        <>Built complete booking platform with instant quotes (Google Maps mileage API); integrated crew availability (Google Calendar) and custom ops rules.</>,
        <>Company achieved <strong>#1 Yelp ranking in Los Angeles (2018)</strong> during my tenure; platform handled real-time scheduling, payments, and dispatch coordination.</>
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
      title: "The Audioverse — decentralized streaming platform (2022)",
      bullets: [
        <><strong>What:</strong> Ownership-aware releases + real-time charts; mobile wallet flows.</>,
        <><strong>How:</strong> NFT-inherited class; IPFS-chunked audio (public/private + encryption); &ldquo;The Crossroads&rdquo; oracle; React Native app (ENS, WatermelonDB, QR share).</>,
        (
          <span key="audioverse-video">
            <strong>Demo:</strong>{" "}
            <VideoPopup
              src="/videos/audioverse.mp4"
              linkText="Watch demo video"
              description="Goerli testnet + IPFS live for Scan/Library/Profile screens. Audioverse/Feed use mock data for illustration."
              linkColor="text-accent-green"
            />
          </span>
        ),
      ],
    },
    {
      title: "The Oracle — Swiss Ephemeris planner (pre-launch, 2025)",
      bullets: [
        <><strong>What:</strong> Daily astro planner + oracle chat with pinned charts; schedules actions on ideal windows.</>,
        <><strong>How:</strong> Multi-chart (natal/transits/progressions/returns), Google/Apple Calendar integration, synastry with custom relationship types, OpenAI-backed insights.</>,
        <><strong>Stack:</strong> Next.js/TypeScript/Node, Swiss Ephemeris bindings, calendar APIs.</>
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
  skills: {
    frontend: ["React", "Next.js", "React Native", "TypeScript", "Three.js", "EJS", "HTML/CSS", "handlebars"],
    backend: ["Node.js", "NestJS", "Express", "Python", "SQL", "TypeORM", "Prisma", "MongoDB", "Mongoose", "Neo4j"],
    audio: ["C++", "JUCE", "Max for Live", "MIDI/MTC"],
    ai: ["ONNX Runtime", "Transformers/HF", "inference pipelines (local/cloud)", "Runpod", "Google Colab"],
    devops: ["Docker", "Nginx", "CI/CD (GitHub Actions)", "Analytics & Observability (GA4, GTM, ETL)"],
    other: ["C#", "Solidity", "PHP", "Shopify API"]
  },
} as const;

export default function Resume() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const getIsDark = () => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return mq.matches; // system
    };

    setIsDark(getIsDark());

    const onSystemChange = () => {
      if (!localStorage.getItem("theme")) {
        setIsDark(mq.matches);
      }
    };

    const onStorageChange = () => {
      setIsDark(getIsDark());
    };

    mq.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorageChange);
    
    // Poll for theme changes (for same-tab updates)
    const interval = setInterval(() => {
      const currentIsDark = getIsDark();
      if (currentIsDark !== isDark) {
        setIsDark(currentIsDark);
      }
    }, 100);

    return () => {
      mq.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorageChange);
      clearInterval(interval);
    };
  }, [isDark]);

  return (
    <main className="prose prose-invert mx-auto max-w-3xl mt-18 px-4">
      <header className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
        <div className="flex-shrink-0 w-[200px] md:w-42 aspect-square">
          {isDark !== null && (
            <img
              src={isDark ? "/images/headshot3.png" : "/images/headshot2.png"}
              alt="Aaron Shier headshot"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{data.name} — {data.title} • {data.tagline}</h1>
          </div>
          <div className="text-sm">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
              <a className="text-accent-green hover:underline" href={data.portfolio} target="_blank" rel="noopener noreferrer">
                ohshutit.com
              </a>
              <span>|</span>
              <a className="text-accent hover:underline" href={data.github} target="_blank" rel="noopener noreferrer">
                github.com/hushaudio
              </a>
              <span>|</span>
              <a className="text-accent-green hover:underline" href={`mailto:${data.email}`}>
                hush@ohshutit.com
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Summary</h2>
        <p className="mt-2">{data.about}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-medium text-accent-green">Core Competencies</h2>
        <div className="mt-4 space-y-2">
          {data.whatIDo.map((w, i) => {
            const [category, skills] = w.split(': ');
            return (
              <div key={i}>
                <strong>{category}:</strong> {skills}
              </div>
            );
          })}
        </div>
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
        <h2 className="text-xl font-medium">Skills</h2>
        <div className="mt-2 space-y-2">
          <div><strong>Frontend:</strong> {data.skills.frontend.join(", ")}</div>
          <div><strong>Backend:</strong> {data.skills.backend.join(", ")}</div>
          <div><strong>Audio/Native:</strong> {data.skills.audio.join(", ")}</div>
          <div><strong>AI/ML:</strong> {data.skills.ai.join(", ")}</div>
          <div><strong>DevOps:</strong> {data.skills.devops.join(", ")}</div>
          <div><strong>Also used:</strong> {data.skills.other.join(", ")}</div>
        </div>
      </section>

      <Footer />
    </main>
  );
}