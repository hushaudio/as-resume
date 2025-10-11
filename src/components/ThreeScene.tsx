"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { GraphData } from "@/components/InteractiveScene";

export default function ThreeScene({ graph }: { graph: GraphData }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

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
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
      camera.position.set(0, 0, 8);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      el.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 2;
      controls.maxDistance = 18;

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

      const center = memo.nodes.find((n) => n.type === ("person" as any));
      const others = memo.nodes.filter((n) => n !== center);

      // Helper: fibonacci sphere distribution on radius r
      const fibonacciSphere = (count: number, r: number) => {
        const pts: Array<[number, number, number]> = [];
        if (count <= 0) return pts;
        if (count === 1) return [[0, 0, r]]; // arbitrary pole
        const golden = Math.PI * (3 - Math.sqrt(5)); // ~2.39996
        for (let i = 0; i < count; i++) {
          const y = 1 - (i / (count - 1)) * 2; // 1..-1
          const radius = Math.sqrt(Math.max(0, 1 - y * y));
          const theta = golden * i;
          const x = Math.cos(theta) * radius;
          const z = Math.sin(theta) * radius;
          pts.push([x * r, y * r, z * r]);
        }
        return pts;
      };

      // Group nodes by type and choose shell radii
      const typeToRadius: Record<string, number> = {
        cred: 1.6,
        experience: 2.4,
        company: 2.4,
        project: 3.0,
        music: 3.0,
        skill: 3.8,
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
      }

      // For each group, scatter on its spherical shell
      for (const [type, arr] of groups) {
        const r = typeToRadius[type] ?? 3.0;
        const pts = fibonacciSphere(arr.length, r);
        for (let i = 0; i < arr.length; i++) {
          const [x, y, z] = pts[i];
          idToIndex.set(arr[i].id, positions.length / 3);
          positions.push(x, y, z);
        }
      }
      pointGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const pointMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, sizeAttenuation: true });
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
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);

      let raf = 0;
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
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

  return (
    <div ref={ref} className="relative w-full h-full">
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-sm text-[color:var(--muted)]">Preparing 3D…</div>
      )}
    </div>
  );
}


