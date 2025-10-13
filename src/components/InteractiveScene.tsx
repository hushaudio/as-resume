"use client";

import { Suspense, lazy, useMemo, useRef, useState, useEffect } from "react";

export type GraphNode = {
  id: string;
  label: string;
  type: "person" | "cred" | "experience" | "company" | "project" | "music" | "skill" | "role";
  meta?: Record<string, unknown>;
};

export type GraphLink = { source: string; target: string };

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

type PositionedNode = GraphNode & { x: number; y: number };

export default function InteractiveScene({ graph }: { graph: GraphData }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{ id: string; label: string; x: number; y: number } | null>(null);
  const [tapId, setTapId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [angleDeg, setAngleDeg] = useState(0);
  const [zoom, setZoom] = useState(1);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const [canWebGL, setCanWebGL] = useState(false);

  const ThreeScene = useMemo(() => lazy(() => import("@/components/ThreeScene")), []);

  // Simple radial layout in 2D SVG
  const layout = useMemo(() => {
    const width = 960; // virtual canvas size (viewBox)
    const height = 540;
    const cx = width / 2;
    const cy = height / 2;
    const positioned: PositionedNode[] = [];
    const center = graph.nodes.find((n) => n.type === "person") || null;
    if (center) positioned.push({ ...center, x: cx, y: cy });

    const layers: Array<{ types: GraphNode["type"][]; r: number }> = [
      { types: ["cred"], r: 110 },
      { types: ["experience", "company"], r: 170 },
      { types: ["project", "music"], r: 230 },
      { types: ["skill"], r: 300 },
    ];

    const rng = (seed: number) => () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };
    const rand = rng(42);

    for (const layer of layers) {
      const nodes = graph.nodes.filter((n) => layer.types.includes(n.type));
      const count = nodes.length || 1;
      nodes.forEach((n, i) => {
        const angle = (i / count) * Math.PI * 2;
        const jitter = (rand() - 0.5) * 0.4;
        const x = cx + Math.cos(angle + jitter * 0.3) * (layer.r + jitter * 12);
        const y = cy + Math.sin(angle + jitter * 0.3) * (layer.r + jitter * 12);
        positioned.push({ ...n, x, y });
      });
    }

    const byId = new Map<string, PositionedNode>();
    for (const p of positioned) byId.set(p.id, p);
    const edges: Array<[PositionedNode, PositionedNode]> = [];
    for (const l of graph.links) {
      const a = byId.get(l.source);
      const b = byId.get(l.target);
      if (a && b) edges.push([a, b]);
    }
    return { width, height, positioned, edges };
  }, [graph]);

  // Convert client pointer to SVG coordinates for tooltip placement
  const toLocal = (ev: React.MouseEvent | React.TouchEvent, x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const rect = el.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setTapId(null); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Avoid SSR/client floating-point drift by rendering the graph only after mount
  useEffect(() => {
    setMounted(true);
    // Light WebGL capability check
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
      setCanWebGL(ok);
    } catch {
      setCanWebGL(false);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden text-[var(--color-foreground)]" style={{ width: '100vw', height: '100vh' }}>
      {mounted && canWebGL ? (
        <Suspense
          fallback={<div className="absolute inset-0 grid place-items-center text-sm text-[var(--muted)]">Preparing 3D…</div>}
        >
          <ThreeScene graph={graph} />
        </Suspense>
      ) : mounted ? (
        <>
          <svg
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            width="100%"
            height="100%"
            role="img"
            aria-label="Knowledge graph"
            style={{ touchAction: "none", cursor: draggingRef.current ? "grabbing" : "grab", color: 'var(--color-foreground)' }}
            onWheel={(e) => {
              e.preventDefault();
              const k = Math.sign(e.deltaY) * 0.1;
              setZoom((z) => Math.max(0.5, Math.min(2, z * (1 - k))));
            }}
          >
            {/* Background drag layer for rotating the "camera" */}
            <rect
              x={0}
              y={0}
              width={layout.width}
              height={layout.height}
              fill="transparent"
              onPointerDown={(e) => {
                draggingRef.current = true;
                lastXRef.current = e.clientX;
                (e.currentTarget as SVGRectElement).setPointerCapture?.(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!draggingRef.current) return;
                const dx = e.clientX - lastXRef.current;
                lastXRef.current = e.clientX;
                setAngleDeg((a) => a + dx * 0.25);
              }}
              onPointerUp={(e) => {
                draggingRef.current = false;
                (e.currentTarget as SVGRectElement).releasePointerCapture?.(e.pointerId);
              }}
              onPointerCancel={(e) => {
                draggingRef.current = false;
                (e.currentTarget as SVGRectElement).releasePointerCapture?.(e.pointerId);
              }}
            />

            <g
              transform={`translate(${layout.width / 2}, ${layout.height / 2}) rotate(${angleDeg}) scale(${zoom}) translate(${-layout.width / 2}, ${-layout.height / 2})`}
            >
              <g stroke="currentColor" strokeOpacity="0.12">
                {layout.edges.map(([a, b], i) => (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                ))}
              </g>
              <g>
                {layout.positioned.map((n) => (
                  <circle
                    key={n.id}
                    cx={n.x}
                    cy={n.y}
                    r={5}
                    fill="currentColor"
                    onMouseEnter={(e) => setHover({ id: n.id, label: n.label, ...toLocal(e, e.clientX, e.clientY) })}
                    onMouseMove={(e) => setHover({ id: n.id, label: n.label, ...toLocal(e, e.clientX, e.clientY) })}
                    onMouseLeave={() => setHover((h) => (h && h.id === n.id ? null : h))}
                    onClick={() => setTapId((prev) => (prev === n.id ? null : n.id))}
                    onTouchStart={(e) => {
                      const t = e.touches[0];
                      if (t) setHover({ id: n.id, label: n.label, ...toLocal(e, t.clientX, t.clientY) });
                    }}
                    onTouchEnd={() => setTapId((prev) => (prev === n.id ? null : n.id))}
                  />
                ))}
              </g>
            </g>
          </svg>

          {(hover || tapId) && (
            <div
              className="pointer-events-none absolute rounded px-3 py-2 text-xs ring-1 backdrop-blur-md shadow-lg text-[var(--color-foreground)] bg-[var(--surface)]"
              style={{
                left: (hover?.x ?? 12) + 8,
                top: (hover?.y ?? 12) + 8,
                zIndex: 60,
                ['--tw-ring-color' as string]: 'var(--border)'
              }}
            >
              {hover?.label || graph.nodes.find((n) => n.id === tapId)?.label}
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-sm text-[var(--muted)]">Loading…</div>
      )}
    </div>
  );
}
