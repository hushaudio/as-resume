"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { GraphData } from "@/components/InteractiveScene";

export default function ThreeScene({ graph }: { graph: GraphData }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<{ id: string; label: string; type: string; x: number; y: number } | null>(null);
  const [labels, setLabels] = useState<Array<{ id: string; label: string; type: string; x: number; y: number; visible: boolean }>>(
    []
  );

  // Flatten nodes and links into simple arrays for minimal Three init
  const memo = useMemo(() => ({ nodes: graph.nodes, links: graph.links }), [graph]);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

      if (disposed) return;
      const el = ref.current;
      if (!el) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 150);
      camera.position.set(0, 0, 22);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      el.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 10;
      controls.maxDistance = 45;

      const resize = () => {
        const r = el.getBoundingClientRect();
        const w = Math.max(1, Math.floor(r.width));
        const h = Math.max(1, Math.floor(r.height));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      // Build points on spherical shells around a center node (the person)
      const pointGeo = new THREE.BufferGeometry();
      const positions: number[] = [];
      const idToIndex = new Map<string, number>();
      const indexToId: string[] = [];
      const nodeById = new Map(memo.nodes.map((n) => [n.id, n] as const));

      const center = memo.nodes.find((n) => n.type === ("person" as any));
      const others = memo.nodes.filter((n) => n !== center);

      // Helper: fibonacci sphere distribution on radius r
      const fibonacciSphere = (count: number, r: number, phase: number) => {
        const pts: Array<[number, number, number]> = [];
        if (count <= 0) return pts;
        if (count === 1) return [[0, 0, r]]; // arbitrary pole
        const golden = Math.PI * (3 - Math.sqrt(5)); // ~2.39996
        for (let i = 0; i < count; i++) {
          const y = 1 - (i / (count - 1)) * 2; // 1..-1
          const radius = Math.sqrt(Math.max(0, 1 - y * y));
          const theta = golden * i + phase;
          const x = Math.cos(theta) * radius;
          const z = Math.sin(theta) * radius;
          pts.push([x * r, y * r, z * r]);
        }
        return pts;
      };

      // Group nodes by type and choose shell radii (extreme spacing to prevent any overlap)
      const typeToRadius: Record<string, number> = {
        cred: 5.0,
        experience: 7.0,
        company: 7.0,
        project: 9.5,
        music: 9.5,
        skill: 12.0,
        person: 0,
      } as const as Record<string, number>;

      const groups = new Map<string, typeof others>();
      for (const n of others) {
        const arr = groups.get(n.type as string) || [];
        arr.push(n as any);
        groups.set(n.type as string, arr);
      }

      // Add center first at origin so it indexes to 0 (optional)
      if (center) {
        idToIndex.set(center.id, positions.length / 3);
        positions.push(0, 0, 0);
        indexToId.push(center.id);
      }

      // For each group, scatter on its spherical shell
      // Simple deterministic hash for per-type phase
      const hash = (s: string) => {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < s.length; i++) {
          h ^= s.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
        return h >>> 0;
      };

      for (const [type, arr] of groups) {
        const r = typeToRadius[type] ?? 3.0;
        const phase = (hash(type) / 4294967295) * Math.PI * 2;
        // Base placement
        const pts = fibonacciSphere(arr.length, r, phase);

        // Extreme repulsion algorithm with much larger minimum distance
        const vecs = pts.map(([x, y, z]) => new THREE.Vector3(x, y, z));
        const ITER = Math.min(200, 40 + Math.floor(arr.length * 4)); // Even more iterations
        const DESIRED_MIN_DIST = (3.5 * Math.PI * r) / Math.sqrt(arr.length); // Much larger ideal spacing
        
        for (let it = 0; it < ITER; it++) {
          const forces = vecs.map(() => new THREE.Vector3(0, 0, 0));
          for (let i = 0; i < vecs.length; i++) {
            for (let j = i + 1; j < vecs.length; j++) {
              const a = vecs[i];
              const b = vecs[j];
              const d = a.clone().sub(b);
              const dist = d.length();
              const distSq = Math.max(1e-4, dist * dist);
              
              // Extreme force with much larger threshold
              let forceMag = 0;
              if (dist < DESIRED_MIN_DIST * 2.5) {
                // Maximum repulsion when too close
                forceMag = 2.0 * (1 - dist / (DESIRED_MIN_DIST * 2.5)) / distSq;
              } else {
                // Still push apart even when far
                forceMag = 0.2 / distSq;
              }
              
              // Project force onto tangent plane to keep on sphere
              const aNorm = a.clone().normalize();
              const bNorm = b.clone().normalize();
              const dNorm = d.clone().normalize();
              
              const ta = dNorm.clone().sub(aNorm.clone().multiplyScalar(dNorm.dot(aNorm))).multiplyScalar(forceMag);
              const tb = ta.clone().multiplyScalar(-1);
              forces[i].add(ta);
              forces[j].add(tb);
            }
          }
          
          // Apply forces with high damping
          const damping = 0.75;
          for (let i = 0; i < vecs.length; i++) {
            vecs[i].add(forces[i].multiplyScalar(damping)).normalize().multiplyScalar(r);
          }
        }

        for (let i = 0; i < arr.length; i++) {
          const v = vecs[i];
          idToIndex.set(arr[i].id, positions.length / 3);
          positions.push(v.x, v.y, v.z);
          indexToId.push(arr[i].id);
        }
      }
      pointGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const pointMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, sizeAttenuation: true });
      const points = new THREE.Points(pointGeo, pointMat);
      scene.add(points);

      // Lines for links
      const linePositions: number[] = [];
      for (const l of memo.links) {
        const ai = idToIndex.get(l.source);
        const bi = idToIndex.get(l.target);
        if (ai == null || bi == null) continue;
        const a3 = ai * 3;
        const b3 = bi * 3;
        linePositions.push(
          positions[a3], positions[a3 + 1], positions[a3 + 2],
          positions[b3], positions[b3 + 1], positions[b3 + 2]
        );
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      // Use theme colors from CSS variables
      const getCSSColor = (name: string, fallback: number) => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        if (!v) return fallback;
        const c = new THREE.Color(v as any);
        return c.getHex();
      };
      const lineColor = getCSSColor("--accent-brown", 0x8b6b4a);
      const lineMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.2 });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);

      // Hover picking
      const raycaster = new THREE.Raycaster();
      // pick radius in world units; tuned for our point size
      (raycaster.params as any).Points = { threshold: 0.12 };
      const ndc = new THREE.Vector2();
      let isDragging = false;
      const onPointerMove = (ev: PointerEvent) => {
        if (isDragging) { setHover(null); return; }
        const rect = renderer.domElement.getBoundingClientRect();
        const cx = ev.clientX - rect.left;
        const cy = ev.clientY - rect.top;
        ndc.x = (cx / rect.width) * 2 - 1;
        ndc.y = -(cy / rect.height) * 2 + 1;
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObject(points, false);
        if (hits.length > 0) {
          const idx = (hits[0].index ?? -1) as number;
          if (idx >= 0) {
            const id = indexToId[idx];
            const node = idToIndex.has(id) ? nodeById.get(id!) : undefined;
            if (node) {
              setHover({ id: node.id, label: node.label, type: node.type, x: cx, y: cy });
              renderer.domElement.style.cursor = "pointer";
              return;
            }
          }
        }
        renderer.domElement.style.cursor = "grab";
        setHover(null);
      };
      const onPointerLeave = () => { setHover(null); renderer.domElement.style.cursor = "grab"; };
      renderer.domElement.style.cursor = "grab";
      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerleave", onPointerLeave);
      controls.addEventListener("start", () => { isDragging = true; setHover(null); });
      controls.addEventListener("end", () => { isDragging = false; });

      let raf = 0;
      const tempVec = new THREE.Vector3();
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        
        // Project 3D positions to screen for persistent labels
        const rect = renderer.domElement.getBoundingClientRect();
        const nextLabels: typeof labels = [];
        for (let i = 0; i < indexToId.length; i++) {
          const id = indexToId[i];
          const node = nodeById.get(id);
          if (!node) continue;
          
          // Get 3D position
          const px = positions[i * 3];
          const py = positions[i * 3 + 1];
          const pz = positions[i * 3 + 2];
          tempVec.set(px, py, pz);
          
          // Project to NDC then screen
          tempVec.project(camera);
          const sx = (tempVec.x * 0.5 + 0.5) * rect.width;
          const sy = (-tempVec.y * 0.5 + 0.5) * rect.height;
          
          // Check if behind camera or out of frustum
          const visible = tempVec.z < 1;
          
          nextLabels.push({ id, label: node.label, type: node.type, x: sx, y: sy, visible });
        }
        setLabels(nextLabels);
        
        raf = requestAnimationFrame(animate);
      };
      animate();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        renderer.domElement.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
        scene.clear();
        pointGeo.dispose();
        lineGeo.dispose();
        (pointMat as any).dispose?.();
        (lineMat as any).dispose?.();
        renderer.dispose();
        renderer.domElement?.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [memo]);

  // Compute related nodes for tooltip
  const relatedNodes = useMemo(() => {
    if (!hover) return [];
    const ids = new Set<string>();
    for (const l of memo.links) {
      if (l.source === hover.id) ids.add(l.target);
      else if (l.target === hover.id) ids.add(l.source);
    }
    return memo.nodes.filter((n) => ids.has(n.id));
  }, [hover, memo]);

  return (
    <div ref={ref} className="relative w-full h-full">
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-sm text-[color:var(--muted)]">Preparing 3D…</div>
      )}
      
      {/* Persistent floating labels - always visible, now interactive */}
      {ready &&
        labels
          .filter((l) => l.visible)
          .map((l) => (
            <div
              key={l.id}
              className="absolute text-[10px] text-white/70 whitespace-nowrap cursor-pointer hover:text-white transition-colors"
              style={{
                left: l.x,
                top: l.y,
                transform: "translate(-50%, -120%)",
              }}
              onMouseEnter={() => setHover({ id: l.id, label: l.label, type: l.type, x: l.x, y: l.y })}
              onMouseLeave={() => setHover(null)}
            >
              {l.label}
            </div>
          ))}
      
      {hover && (
        <div
          className="pointer-events-none absolute rounded-lg bg-black/80 px-3 py-2 text-xs ring-1 ring-white/20 z-10 max-w-xs"
          style={{ left: hover.x + 12, top: hover.y + 12 }}
        >
          <div className="font-semibold text-[color:var(--accent)]">{hover.label}</div>
          <div className="text-[10px] text-[color:var(--muted)] mt-0.5 capitalize">{hover.type}</div>
          {relatedNodes.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="text-[10px] text-[color:var(--muted)] mb-1">Related</div>
              <div className="flex flex-wrap gap-1">
                {relatedNodes.slice(0, 8).map((n) => (
                  <span
                    key={n.id}
                    className="inline-block rounded bg-white/10 px-1.5 py-0.5 text-[10px]"
                  >
                    {n.label}
                  </span>
                ))}
                {relatedNodes.length > 8 && (
                  <span className="text-[10px] text-[color:var(--muted)]">+{relatedNodes.length - 8} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


