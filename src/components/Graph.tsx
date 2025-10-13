import InteractiveScene, { type GraphNode, type GraphLink } from "@/components/InteractiveScene";

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
    "I build the bridge from prototype to production across web/app (Next.js, React Native), audio DSP/JUCE (C++), and local-AI (Python/ONNX). I scope constraints fast, ship reliable systems, and harden them for live shows or large-scale traffic—often with analytics/CRO baked in.",
  whatIDo: [
    "Product engineering: building production applications and native tools across web, desktop, and mobile",
    "AI/ML systems: end-to-end pipelines across audio, text, image, and video — C++/JUCE, ONNX, Transformers/Hugging Face, local and cloud inference. Trained 1000+ models spanning text, image, and audio generation",
    "Performance & analytics: instrumentation, SEO-aware frontend engineering, performance budgets and Core Web Vitals; practical experience running A/B tests when needed",
    "Live systems & shows: MIDI/MTC, Max devices, clocking networks, and hardened fail-safe stage rigs",
  ],
  experience: [
    {
      title: "UE5/iOS Game Tech",
      company: "Oberha5li Studios",
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
      years: "2015–Present",
      bullets: [
        "Built solutions for 30+ marketing clients using Klaviyo, Google APIs,Twilio, Google Analytics, Google Tag Manager, Facebook Pixels, .",
        "Modular LP system powering UA at scale for Hungryroot (early stage → ~$1B valuation).",
        "Built and managed 565media.com (Node.js/Strapi/Next.js); previously custom WordPress theme from.",
        "Continuous A/B tests, clean event schemas, SEO-aware React/Next builds, CI/CD; green Web Vitals.",
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
    "Three.js",
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

// Comprehensive metadata for graph tooltips
const graphMetadata = {
  projects: {
    "DeepSampler2": {
      description: "First-ever text-to-audio-sample VST plugin. Built with C++/JUCE for DSP processing and React/Vite for the UI. Integrated with Audialab Engine for local AI inference using Stable Audio Open. Beta contractor for Stable Audio Open, providing early access that informed and accelerated development.",
      stack: ["C++", "JUCE", "React", "Vite", "Stable Audio Open", "DSP", "WebSockets", "PyInstaller"],
      timeline: "2023–Present",
      impact: "First-to-market product in text-to-audio VST space",
      keyChallenges: ["Real-time audio processing", "Model optimization", "HTTP/WebSocket communication for audio generation and real-time inference updates" ]
    },
    "Audialab Engine": {
      description: "Python desktop application for hosting local AI audio models. Supports hot-swappable backends from Hugging Face and community sources using .safetensors and .checkpoint formats with transformers. Built with PyInstaller for distribution (handled by team). Enables offline, creator-friendly workflows with hackable model pipelines. Designed for rapid model experimentation without cloud dependencies.",
      stack: ["Python", "transformers", "safetensors", "PyInstaller"],
      timeline: "2023–Present",
      impact: "Empowers creators with local AI tools",
      keyChallenges: ["Model serving and inference optimization", "Offline-first architecture", "Packaging as PyInstaller tray icon app", "Hot-swappable model backends", "Cross-thread communication between JUCE processor and GUI threads with HTTP and WebSocket layer coordination"]
    },
    "Interloper": {
      description: "JUCE plugin with fully embedded ONNX runtime for in-plugin AI audio generation—no external dependencies. C++/JUCE backend handles DSP and model inference, React/Vite UI provides intuitive controls. Eliminated the need for separate engine installations, dramatically reducing setup friction and support load.",
      stack: ["C++", "JUCE", "ONNX", "React", "Vite", "DSP"],
      timeline: "2023–Present",
      impact: "Zero-dependency AI audio plugin",
      keyChallenges: ["ONNX runtime integration and optimization", "Zero-dependency plugin architecture"]
    },
    "The Audioverse": {
      description: "Fully decentralized streaming platform—no centralized servers, no gimmicks. React Native mobile app with wallet integration, WatermelonDB for offline-first local state, ENS for user profiles, fun and interactive QR flows for purchases. Custom NFT smart contracts for release ownership, all on-chain. Audio chunked to IPFS for truly decentralized storage with public/private encryption. NestJS blockchain oracle 'The Crossroads' listens for custom purchase events on-chain and computes charts entirely from blockchain data—no centralized database. 100% creator-owned, censorship-resistant distribution.",
      stack: ["React Native", "NestJS", "Solidity", "IPFS", "WatermelonDB", "Goerli", "Blockchain Oracles"],
      timeline: "2022–2024",
      impact: "100% decentralized music platform with zero centralized infrastructure",
      keyChallenges: ["Truly decentralized storage and streaming without centralized fallbacks", "NFT-inherited release ownership on-chain", "Real-time charts computed purely from blockchain events", "Secure audio chunking and encryption for private files on IPFS"],
      video: "/videos/audioverse.mp4",
      videoDescription: "This demo uses mock data for the \"Audioverse\" and \"Feed\" screens to illustrate flows that would normally require larger amounts of user data. \"Scan\", \"Libary\", and \"Profile\" screens all use real blockchain data on the Goerli test network and real IPFS peer shared data for full decentralization."
    },
    "The Oracle": {
      description: "Astrology planner and oracle chat. It generates daily/weekly readings from Swiss Ephemeris, interprets pinned charts in chat, and auto-schedules tasks when alignments are optimal. Supports multi-chart workflows (natal, transits, progressions, returns, event/relocation/harmonics) plus synastry/composite with custom relationship types (e.g., Band mate”). Week-at-a-glance surfaces key windows; a daily pipeline precomputes ~5 charts/day for personalized guidance.",
      stack: ["React Native", "TypeScript", "Node.js", "Swiss Ephemeris", "OpenAI", "Apple EventKit", "Google Calendar API"],
      timeline: "2024–Present (pre-launch)",
      impact: "Turns astrology into an actionable plan: contextual readings + calendar-aligned scheduling.",
      keyChallenges: ["Programatically creating accurate astrological charts with Swiss Ephemeris for AI context", "Tool-calling OpenAI for contextual insights at appropraite times", "Calendar integrations for event-based chart generation", "Prompt engineering Synastry chart interpretations with custom relationship types"]
    }
  },
  skills: {
    "React": {
      description: "8+ years building production web and mobile apps. Used across Hungryroot LPs, The Audioverse, The Oracle, and Audialab plugins. Expert in performance optimization, SEO-aware rendering, and component architecture.",
      projects: ["DeepSampler2", "Interloper", "The Audioverse", "The Oracle", "565 Media work"],
      proficiency: "Expert"
    },
    "Next.js": {
      description: "6+ years building SEO-optimized, server-rendered applications. Implemented for 565 Media's website and landing pages achieving green Core Web Vitals.",
      projects: ["The Oracle", "565 Media landing pages"],
      proficiency: "Advanced"
    },
    "React Native": {
      description: "8+ years building cross-platform mobile apps. Developed The Audioverse mobile app with wallet integration, offline-first architecture using WatermelonDB, and complex QR/NFC flows. Built The Oracle mobile app with calendar integrations and astrology workflows.",
      projects: ["The Audioverse", "The Oracle"],
      proficiency: "Expert"
    },
    "TypeScript": {
      description: "6+ years for type-safe development across full-stack applications. Primary language for web/mobile projects, ensuring maintainability and reducing runtime errors.",
      projects: ["All modern web projects", "The Oracle", "The Audioverse", "565 Media"],
      proficiency: "Expert"
    },
    "Python": {
      description: "3+ years for AI/ML pipelines and desktop applications. Built Audialab Engine for local model hosting. Experience with PyInstaller, model serving, and data processing pipelines.",
      projects: ["Audialab Engine"],
      proficiency: "Advanced"
    },
    "C++": {
      description: "5+ years specializing in audio DSP and real-time processing. Core language for JUCE plugins (DeepSampler2, Interloper). Handles real-time audio, ONNX integration, and low-latency requirements.",
      projects: ["DeepSampler2", "Interloper"],
      proficiency: "Advanced"
    },
    "JUCE": {
      description: "5+ years building professional audio plugins. Framework for all Audialab VST/AU plugins. Deep knowledge of audio processing, plugin architecture, and cross-platform compilation.",
      projects: ["DeepSampler2", "Interloper", "Max for Live devices"],
      proficiency: "Expert"
    },
    "DSP": {
      description: "10+ years of digital signal processing for audio applications. Implemented real-time audio effects, sample processing, and spectral analysis. Critical skill for all audio plugin development.",
      projects: ["DeepSampler2", "Interloper", "Live audio rigs"],
      proficiency: "Expert"
    },
    "ONNX": {
      description: "2+ years integrating ML models into production applications. Embedded ONNX runtime in C++ for Interloper, optimized inference for real-time audio. Experience with model quantization and performance tuning.",
      projects: ["DeepSampler2", "Interloper", "Audialab Engine"],
      proficiency: "Advanced"
    },
    "Node.js": {
      description: "8+ years building scalable backends. Used for NestJS APIs, serverless functions, and build tooling. Powers backends for The Audioverse, The Oracle, and 565 Media projects.",
      projects: ["The Audioverse", "The Oracle", "565 Media", "OneShotMove"],
      proficiency: "Expert"
    },
    "NestJS": {
      description: "3+ years building structured, type-safe APIs. Framework of choice for The Audioverse backend. Provides clean architecture with dependency injection and modular design.",
      projects: ["The Audioverse"],
      proficiency: "Advanced"
    },
    "Solidity": {
      description: "3+ years writing smart contracts for NFT and DeFi applications. Developed custom NFT-inherited contracts for The Audioverse release ownership. Deployed to Goerli testnet.",
      projects: ["The Audioverse"],
      proficiency: "Advanced"
    },
    "Docker": {
      description: "6+ years containerizing applications for consistent deployments. Used for dev environments, CI/CD pipelines, and production deployments across 565 Media and Audialab projects.",
      projects: ["Audialab Engine", "565 Media", "The Audioverse"],
      proficiency: "Advanced"
    },
    "Unreal Engine 5": {
      description: "4+ years consulting on game deployment pipelines. Unblocked TestFlight release for deadmau5's Meowingtons game. Expertise in build automation and platform-specific quirks.",
      projects: ["deadmau5 Meowingtons"],
      proficiency: "Advanced"
    },
    "Max for Live": {
      description: "10+ years creating custom Ableton devices. Built live-looping rig for Caroline Jones with fail-safe recovery, MTC sync, and networked clocking. Deep integration with MIDI/audio routing.",
      projects: ["Ric Wake / Caroline Jones rig"],
      proficiency: "Expert"
    },
    "MIDI/MTC": {
      description: "23+ years implementing MIDI timing and control. Built rock-solid sync systems for live performances. Experience with MIDI Clock, MTC, and networked timing across multiple devices.",
      projects: ["Ric Wake / Caroline Jones rig", "Live shows"],
      proficiency: "Expert"
    },
    "CI/CD": {
      description: "3+ years automating build and deployment pipelines. Implemented for 565 Media landing pages, ensuring rapid iteration and reliable deploys. GitHub Actions, automated testing, and deployment workflows.",
      projects: ["565 Media", "OneShotMove", "The Audioverse"],
      proficiency: "Advanced"
    },
    "DevOps": {
      description: "8+ years managing production infrastructure and deployment pipelines. Learned and refined through Hungryroot scaling to 1M+ daily users. Server management, monitoring, deployment automation, scaling strategies, and infrastructure optimization under high-traffic conditions.",
      projects: ["Hungryroot infrastructure", "565 Media", "The Audioverse", "The Oracle"],
      proficiency: "Expert"
    },
    "Nginx": {
      description: "8+ years configuring web servers and reverse proxies. Used for high-traffic sites at 565 Media. Expert in SSL/TLS, caching strategies, and load balancing.",
      projects: ["565 Media infrastructure"],
      proficiency: "Expert"
    },
    "C#": {
      description: "4+ years with C# for game development and Unity projects. Used in Unreal Engine consulting work and cross-platform development.",
      projects: ["Oberha5li Studios"],
      proficiency: "Advanced"
    },
    "Shopify API": {
      description: "3+ years building e-commerce integrations and custom solutions using Shopify API. Implemented for 565 Media clients requiring headless commerce and custom storefronts.",
      projects: ["565 Media client work"],
      proficiency: "Advanced"
    },
    "Neo4j": {
      description: "6 months of graph database experience for complex relational data modeling. Used for knowledge graphs and connected data systems.",
      projects: ["Data modeling projects"],
      proficiency: "Intermediate"
    },
    "SQL": {
      description: "4+ years working with relational databases (PostgreSQL, MySQL, SQLite) across multiple projects. Backend data persistence and complex queries. Used MongoDB extensively until 2021.",
      projects: ["565 Media", "OneShotMove", "The Audioverse", "The Oracle"],
      proficiency: "Advanced"
    },
    "PHP": {
      description: "11+ years building backend systems and WordPress integrations. Started with WordPress development, used extensively for 565 Media client work and custom WordPress themes before migrating to modern stacks.",
      projects: ["565 Media legacy projects", "WordPress custom themes"],
      proficiency: "Expert"
    },
    "transformers": {
      description: "3+ years working with Hugging Face transformers library for AI/ML model integration and training. Used in Audialab Engine for loading and serving audio generation models. Experience training models for text, image, and audio.",
      projects: ["Audialab Engine"],
      proficiency: "Advanced"
    },
    "AI Infrastructure": {
      description: "3+ years building end-to-end AI/ML pipelines for audio, text, and image processing. Trained 1000+ models spanning text, image, and audio generation. Experience with local and cloud inference, model optimization, ONNX runtime integration, and production deployment of AI systems.",
      projects: ["DeepSampler2", "Interloper", "Audialab Engine", "The Oracle"],
      proficiency: "Advanced"
    }
  },
  experience: {
    "Founding Engineer": {
      description: "Early-stage technical role focused on building foundations from the ground up. Skills developed: system architecture, technical direction setting, full-stack ownership from DSP to UI, integrating cutting-edge technologies, and shipping production-grade tools. Expertise in taking research/prototypes and hardening them for real-world use.",
      technologies: ["C++", "JUCE", "Python", "React", "ONNX", "DSP"],
      keyAchievements: ["First engineering hire experience", "Architecture from scratch", "Production plugin development"]
    },
    "Contract Engineer": {
      description: "Freelance/contract engineering focused on delivering specific technical solutions and scaling existing systems. Skills developed: rapid context switching, client communication, building modular reusable systems, A/B testing frameworks, analytics hygiene, SEO-optimized React/Next builds, CI/CD pipeline maintenance, and infrastructure scaling.",
      technologies: ["React", "Next.js", "Node.js", "Docker", "Nginx", "CI/CD"],
      keyAchievements: ["Long-term client relationships", "High-traffic scaling", "Core Web Vitals optimization"]
    },
    "Full-Stack Engineer": {
      description: "End-to-end engineering covering every layer from UI to database. Skills developed: complete application ownership, rapid prototyping to production, integrating third-party APIs (Google Maps, Calendar), building quote engines, payment systems, scheduling logic, and optimizing for user experience.",
      technologies: ["React", "Next.js", "Node.js", "Google APIs"],
      keyAchievements: ["Full platform ownership", "Rapid development cycles", "UX-focused engineering"]
    },
    "Consulting Engineer": {
      description: "Advisory technical role solving complex technical challenges and designing custom integrations. Skills developed: live performance systems, real-time audio/MIDI processing, fail-safe architecture, hardware/software integration, rapid prototyping under tight deadlines, and building tour-grade reliability into systems.",
      technologies: ["Max for Live", "MIDI/MTC"],
      keyAchievements: ["'Impossible' problem solving", "Rapid prototyping", "Tour-grade reliability"]
    },
    "UE5/Game Tech (Consult)": {
      description: "Specialized consulting in game development and deployment. Skills developed: Unreal Engine 5 architecture, deployment pipeline design, platform-specific build troubleshooting, process documentation, and ongoing technical advisement for interactive experiences.",
      technologies: ["Unreal Engine 5"],
      keyAchievements: ["Pipeline unblocking", "Process documentation", "Platform expertise"]
    },

    "Founder": {
      description: "Founded Iowa COVID County Tracker during the pandemic. Built county-level dashboards from state data, providing trend visibility for local communities. Featured by Southeast Iowa Union for public service contribution.",
      technologies: ["React", "Next.js", "TypeScript", "Data processing"],
      keyAchievements: ["Southeast Iowa Union feature", "Real-time data visualization", "Public service during pandemic"]
    }
  },
  companies: {
    "Audialab": {
      description: "Led development of two groundbreaking AI audio plugins as founding engineer. DeepSampler2: world's first text-to-audio-sample VST. Interloper: embedded-ONNX generator. Audialab Engine: local model host. Architected full stack from DSP to UI, integrated cutting-edge AI models (Stable Audio Open beta contractor), and shipped production tools used by thousands of producers.",
      technologies: ["C++", "JUCE", "Python", "React", "ONNX", "DSP"],
      keyAchievements: ["First-to-market text-to-audio VST", "Zero-dependency AI plugin architecture", "Stable Audio Open beta contractor"]
    },
    "565 Media": {
      description: "Built modular landing page system powering user acquisition for Hungryroot as they scaled from early stage to ~$1B valuation. Served 30+ marketing clients with solutions using Klaviyo, Google APIs, Strapi, WordPress, Twilio, and DigitalOcean. Built and managed 565media.com using Node.js/Strapi/Next.js. Implemented continuous A/B testing framework, clean analytics event schemas, and SEO-optimized React/Next builds with green Core Web Vitals.",
      technologies: ["React", "Next.js", "Node.js", "Strapi", "WordPress", "Klaviyo", "Google APIs", "Twilio", "DigitalOcean", "Docker", "Nginx", "CI/CD"],
      keyAchievements: ["Scaled infrastructure through $1B valuation growth", "30+ marketing clients served", "Green Core Web Vitals at scale", "Modular LP system"]
    },
    "Oberha5li Studios": {
      description: "Unblocked TestFlight deployment pipeline for Meowingtons Simulator (Unreal Engine 5 title). Documented repeatable release process, solved platform-specific build issues, and provided ongoing technical advisement for game deployment.",
      technologies: ["Unreal Engine 5"],
      keyAchievements: ["Unblocked TestFlight release", "Documented deployment process"]
    },
    "Hungryroot": {
      description: "Built and maintained high-performance landing page infrastructure using EJS for fast server response times. Managed servers scaling from early stage to 1M+ users per day as company grew to ~$1B valuation. Delivered critical updates under tight deadlines to ensure landing page speed and availability at massive scale. 8+ years of continuous optimization and infrastructure management.",
      technologies: ["EJS", "Node.js", "React", "Next.js", "Nginx", "CI/CD", "Performance optimization"],
      keyAchievements: ["Scaled to 1M+ daily users", "Sub-second server response times", "8+ years infrastructure management", "Zero downtime during hypergrowth"]
    },
    "deadmau5": {
      description: "Grammy-nominated electronic music producer Joel Zimmerman. Pioneer in electronic music and technology integration."
    },
    "OneShotMove": {
      description: "Built complete booking platform with instant quoting, payments, and scheduling. Integrated Google Maps for mileage calculation, Google Calendar for crew availability, and ops rules engine. Achieved #1 Yelp ranking in Los Angeles (2018) through exceptional UX and reliable service.",
      technologies: ["React", "Next.js", "Node.js", "Google APIs"],
      keyAchievements: ["#1 Yelp in LA (2018)", "Real-time quote engine", "Calendar-driven scheduling"]
    },
    "Ric Wake / RB-360": {
      description: "Designed and built one-person live-looping rig for on-stage performances with Caroline Jones—a system industry experts said wasn't possible. Created custom Max for Live devices with fail-safe recovery, tight MTC sync with Nir Z's drums, and networked clocking for sample-accurate timing. Delivered working prototype in one week, hardened for tour reliability.",
      technologies: ["Max for Live", "MIDI/MTC"],
      keyAchievements: ["'Impossible' system shipped in 1 week", "Tour-proven reliability", "Fail-safe recovery architecture"]
    },
    "Iowa COVID County Tracker": {
      description: "Founded and built this public service project during the pandemic. Ingested and normalized Iowa state COVID reports into county-level dashboards, providing trend visibility for local communities. Featured by Southeast Iowa Union for public service contribution.",
      technologies: ["React", "Next.js", "TypeScript", "Data processing"],
      keyAchievements: ["Southeast Iowa Union feature", "Real-time data visualization", "Public service during pandemic"]
    }
  },
  music: {
    "Strange Music": {
      description: "Independent hip-hop label founded by Tech N9ne. Signed artist status with multiple releases and collaborations. One of the most successful independent labels in hip-hop, demonstrating ability to work at professional label standards.",
      year: "2020–Present",
      role: "Signed Artist"
    },
    "W.H.A.T. — Tech N9ne, HU$H, Kim Dracula": {
      description: "Strange Music release featuring Tech N9ne and Kim Dracula. Three-way collaboration bringing together hip-hop and alternative scenes. Featured vocal artist, co-producer, played guitars, and sang the chorus.",
      year: "2023",
      role: "Featured Vocal Artist, Co-Producer, Guitarist, Vocalist",
      genre: "Nu-Metal Rap"
    },
    "BLIGHT — Tech N9ne, HU$H": {
      description: "Strange Music collaboration EP with Tech N9ne. Produced all music, rapped, and sang on all tracks while Tech N9ne provided rap verses. Full creative control on production and vocals.",
      year: "2023",
      role: "Producer, Vocalist, Rapper",
      genre: "Hip-Hop"
    },
    "Iron Man 3 soundtrack credit": {
      description: "Production credit on Wondergirls track 'Let's Go All The Way' featured in Marvel's Iron Man 3 official soundtrack. Handled majority of production and recording. Covered vocals for Scott Weiland (Stone Temple Pilots) and Ian Astbury (The Cult), both legends who were no longer in the band. Featured Robbie Williams and Ashley Hamilton (who appears in the film as the first explosion victim in the Chinese Theatre). High-profile sync placement with legendary artists.",
      year: "2013",
      role: "Producer, Engineer, Vocalist (covering Scott Weiland & Ian Astbury)",
      genre: "Rock"
    },
    "Kazoo Kid remix (with Mike Diva)": {
      description: "Viral remix collaboration with director Mike Diva. Multi-million view remix demonstrating ability to create culturally relevant content that resonates with internet audiences.",
      year: "2016",
      role: "Producer, Artist",
      genre: "Electronic/Viral"
    },
    "SiriusXM BPM remixes": {
      description: "Several official remixes that charted on SiriusXM's BPM electronic music channel. Demonstrated consistent ability to create radio-ready dance music productions.",
      year: "2009–2012",
      role: "Remixer, Producer",
      genre: "Electronic Dance"
    },
    "Orgy — 'Talk Sick', 'Monster in Me'": {
      description: "Production work with industrial rock band Orgy. Contributed to multiple album tracks, working with established artists in the alternative/industrial scene.",
      year: "2015",
      role: "Producer",
      genre: "Industrial Rock"
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
      description: "Grocery startup that grew from early stage to ~$1B valuation. Built and maintained high-performance landing page infrastructure, scaling to 1M+ daily users. 8+ years of continuous optimization and infrastructure management."
    },
    "565 Media": {
      description: "Handled 565's website and delivery pipeline; built and maintained landing pages and tracking for 30+ clients. Oversaw Hungryroot's ad LPs and server ops at ~1M daily visits scale."
    },
    "deadmau5": {
      description: "Grammy-nominated electronic music producer. Consulting on Unreal Engine iOS game development and deployment."
    },
    "Oberha5li Studios": {
      description: "Game development studio founded by deadmau5. Technical consulting on Unreal Engine iOS game development and deployment."
    },
    "Ric Wake / RB-360": {
      description: "Music industry veteran (Ric Wake) and rising country artist (Caroline Jones). Built tour-grade live looping technology."
    },
    "Iron Man 3": {
      description: "Marvel blockbuster film. Production credit on Wondergirls track 'Let's Go All The Way' featured on the official soundtrack. Handled majority of production and recording, covered vocals for Scott Weiland (Stone Temple Pilots) and Ian Astbury (The Cult), both legends who were no longer in the band."
    }
  }
};

export default function Graph() {
  // Build an interactive knowledge graph from resume data.
  const graph = (() => {
    type Node = GraphNode;
    type Link = GraphLink;
    const nodes: Node[] = [];
    const links: Link[] = [];
    const byId = new Map<string, Node>();
    const labelSeen = new Map<string, string>();

    const addNode = (id: string, label: string, type: Node["type"], meta?: Record<string, unknown>) => {
      if (byId.has(id)) return;
      const existingType = labelSeen.get(label);
      if (existingType && existingType !== type) {
        if (typeof window !== "undefined") {
          console.warn(`[graph] Duplicate label detected: "${label}" for types ${existingType} and ${type}. Skipping second instance.`);
        }
        // Do not add a second node with identical label but different type
        return;
      }
      labelSeen.set(label, type as string);
      const n = { id, label, type, meta };
      byId.set(id, n);
      nodes.push(n);
    };
    const addLink = (a: string, b: string) => {
      links.push({ source: a, target: b });
    };
    const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    // Helper no longer used after explicit mappings

    // Person
    const personMeta = {
      description: data.about,
      title: data.title,
      tagline: data.tagline,
      email: data.email,
      github: data.github,
      whatIDo: data.whatIDo,
      skills: data.skills,
      oneLiner: data.oneLiner,
      accomplishments: data.accomplishments
    };
    addNode("person", data.name, "person", personMeta);

    // Hero creds
    for (const c of data.heroCreds) {
      const id = `cred:${slug(c)}`;
      const meta = graphMetadata.creds[c as keyof typeof graphMetadata.creds];
      addNode(id, c, "cred", meta);
      addLink("person", id);
    }

    // Experiences and companies
    // Track unique roles to avoid duplicates
    const rolesAdded = new Set<string>();

    for (const role of data.experience) {
      // Add role type node (if not already added)
      const roleId = `role:${slug(role.title)}`;
      if (!rolesAdded.has(roleId)) {
        const roleMeta = graphMetadata.experience[role.title as keyof typeof graphMetadata.experience];
        addNode(roleId, role.title, "role", roleMeta);
        rolesAdded.add(roleId);
      }
      // Ensure person is connected to role
      addLink("person", roleId);

      // Add company node
      const compId = `company:${slug(role.company)}`;
      const compMeta = graphMetadata.companies[role.company as keyof typeof graphMetadata.companies];
      addNode(compId, role.company, "company", compMeta);
      // Connect role type to company
      addLink(roleId, compId);
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
        // Roles don't link to skills - companies do
      ],
      projects: [
        { key: "DeepSampler2", skills: ["C++", "JUCE", "DSP", "ONNX", "React", "TypeScript"] },
        { key: "Interloper", skills: ["C++", "JUCE", "ONNX", "DSP"] },
        { key: "Audialab Engine", skills: ["Python", "ONNX", "Docker"] },
        { key: "The Audioverse", skills: ["React Native", "NestJS", "Node.js", "TypeScript", "Solidity", "CI/CD"] },
        { key: "The Oracle", skills: ["React", "Next.js", "TypeScript", "Node.js"] },
      ],
      music: [
        { key: "Strange Music", releases: ["W.H.A.T. — Tech N9ne, HU$H, Kim Dracula", "BLIGHT — Tech N9ne, HU$H"] },
      ],
      creds: [
        { cred: "Audialab", targets: ["Founding Engineer", "Audialab", "DeepSampler2", "Interloper", "Audialab Engine"] },
        { cred: "Strange Music", targets: ["Strange Music", "W.H.A.T. — Tech N9ne, HU$H, Kim Dracula", "BLIGHT — Tech N9ne, HU$H"] },
        { cred: "Hungryroot", targets: ["Contract Engineer", "565 Media"] },
        { cred: "deadmau5", targets: ["deadmau5", "Oberha5li Studios"] },
        { cred: "Oberha5li Studios", targets: ["UE5/Game Tech", "Oberha5li Studios", "deadmau5"] },
        { cred: "Ric Wake / RB-360", targets: ["Consulting Engineer", "Ric Wake / RB-360"] },
        { cred: "Iron Man 3", targets: ["Iron Man 3 soundtrack credit"] },
      ],
      roles: [
        { key: "Founding Engineer", companies: ["Audialab"] },
        { key: "Contract Engineer", companies: ["565 Media", "OneShotMove"] },
        { key: "Consulting Engineer", companies: ["Ric Wake / RB-360"] },
        { key: "UE5/Game Tech (Consult)", companies: ["Oberha5li Studios"] },
        { key: "Founder", companies: ["Iowa COVID County Tracker"] },
      ],
      companies: [
        { key: "Audialab", skills: ["C++", "JUCE", "Python", "React", "ONNX", "DSP"] },
        { key: "565 Media", skills: ["React", "Next.js", "Node.js", "Strapi", "WordPress", "Klaviyo", "Twilio", "DigitalOcean", "Docker", "Nginx", "CI/CD"] },
        { key: "Hungryroot", skills: ["EJS", "Node.js", "Nginx", "DevOps"] },
        { key: "OneShotMove", skills: ["React", "Next.js", "Node.js", "TypeScript", "CI/CD"] },
        { key: "Ric Wake / RB-360", skills: ["Max for Live", "MIDI/MTC"] },
        { key: "Oberha5li Studios", skills: ["Unreal Engine 5"] },
        { key: "Iowa COVID County Tracker", skills: ["React", "Next.js", "TypeScript", "Node.js", "CI/CD"] },
      ],
      // NEW: Project to Company relationships
      projectCompanies: [
        { key: "DeepSampler2", company: "Audialab" },
        { key: "Interloper", company: "Audialab" },
        { key: "Audialab Engine", company: "Audialab" },
      ],
      // NEW: Role to Skill relationships
      roleSkills: [
        { key: "Founding Engineer", skills: ["C++", "JUCE", "Python", "React", "ONNX", "DSP"] },
        { key: "Contract Engineer", skills: ["React", "Next.js", "Node.js", "Docker", "CI/CD"] },
        { key: "Full-Stack Engineer", skills: ["React", "Next.js", "Node.js", "TypeScript"] },
        { key: "Consulting Engineer", skills: ["Max for Live", "MIDI/MTC"] },
        { key: "UE5/iOS Game Tech", skills: ["Unreal Engine 5"] },
        { key: "Founder", skills: ["React", "Next.js", "TypeScript", "Node.js"] },
      ],
      // NEW: Music to Skill relationships
      musicSkills: [
        { key: "Strange Music", skills: ["DSP", "MIDI/MTC"] },
        { key: "W.H.A.T. — Tech N9ne, HU$H, Kim Dracula", skills: ["DSP", "MIDI/MTC"] },
        { key: "BLIGHT — Tech N9ne, HU$H", skills: ["DSP", "MIDI/MTC"] },
        { key: "Iron Man 3 soundtrack credit", skills: ["DSP", "MIDI/MTC"] },
        { key: "SiriusXM BPM remixes", skills: ["DSP", "MIDI/MTC"] },
        { key: "Kazoo Kid remix (with Mike Diva)", skills: ["DSP", "MIDI/MTC"] },
        { key: "Orgy — 'Talk Sick', 'Monster in Me'", skills: ["DSP", "MIDI/MTC"] },
      ],
    } as const;

    // Build lookup by label for existing nodes
    const labelToId = new Map<string, string>();
    for (const n of nodes) labelToId.set(n.label, n.id);

    // Apply experience skill links (currently disabled - skills link to companies instead)
    // for (const r of linkRules.experience) {
    //   const expId = labelToId.get(r.key);
    //   if (!expId) continue;
    //   for (const s of r.skills) {
    //     const sid = labelToId.get(s);
    //     if (sid) addLink(sid, expId);
    //   }
    // }

    // Apply project skill links
    for (const r of linkRules.projects) {
      const pid = labelToId.get(r.key);
      if (!pid) continue;
      for (const s of r.skills) {
        const sid = labelToId.get(s);
        if (sid) addLink(sid, pid);
      }
    }

    // Apply music links (label to releases)
    for (const r of linkRules.music) {
      const labelId = labelToId.get(r.key);
      if (!labelId) continue;
      for (const release of r.releases) {
        const releaseId = labelToId.get(release);
        if (releaseId) addLink(labelId, releaseId);
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

    // Apply companies → skills
    for (const r of linkRules.companies) {
      const companyId = labelToId.get(r.key);
      if (!companyId) continue;
      for (const s of r.skills) {
        const sid = labelToId.get(s);
        if (sid) addLink(sid, companyId);
      }
    }

    // Apply project → company relationships
    for (const r of linkRules.projectCompanies) {
      const projectId = labelToId.get(r.key);
      const companyId = labelToId.get(r.company);
      if (projectId && companyId) addLink(projectId, companyId);
    }

    // Apply role → skill relationships
    for (const r of linkRules.roleSkills) {
      const roleId = labelToId.get(r.key);
      if (!roleId) continue;
      for (const s of r.skills) {
        const sid = labelToId.get(s);
        if (sid) addLink(sid, roleId);
      }
    }

    // Apply music → skill relationships
    for (const r of linkRules.musicSkills) {
      const musicId = labelToId.get(r.key);
      if (!musicId) continue;
      for (const s of r.skills) {
        const sid = labelToId.get(s);
        if (sid) addLink(sid, musicId);
      }
    }

    // Apply roles → companies (already connected in experience loop, this is for validation)
    // Note: Role to company connections are now handled in the experience loop above

    return { nodes, links };
  })();

  return (
    <div className="fixed inset-0">{/* fullscreen, nav floats above */}
      <InteractiveScene graph={graph} />
    </div>
  );
}
