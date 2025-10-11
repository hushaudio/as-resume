/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import MobileTooltip from "./MobileTooltip";
import type { GraphData } from "@/components/InteractiveScene";

export default function ThreeScene({ graph }: { graph: GraphData }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<{ id: string; label: string; type: string; x: number; y: number } | null>(null);
  const [labels, setLabels] = useState<Array<{ id: string; label: string; type: string; x: number; y: number; visible: boolean }>>(
    []
  );
  const isHoveringCanvasRef = useRef(false);
  const isHoveringLabelRef = useRef(false);
  const [mobileAnchor, setMobileAnchor] = useState<null | "top" | "bottom">(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSelectedId, setMobileSelectedId] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isTouchRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  // debugInfo removed
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasTouch = 'ontouchstart' in window || (navigator as any).maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches;
      setIsTouchDevice(!!hasTouch);
    } catch (e) { 
      setIsTouchDevice(false); 
    }
  }, []);
  useEffect(() => {
    isTouchRef.current = isTouchDevice;
  }, [isTouchDevice]);
  // Prevent page scrolling when mobile tooltip is open
  useEffect(() => {
    if (!isTouchDevice) return;
    const prevOverflow = typeof document !== 'undefined' ? document.body.style.overflow : '';
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflow;
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen, isTouchDevice]);
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
      // Prevent text selection / native gestures on canvas
      (renderer.domElement.style as any).userSelect = 'none';
      (renderer.domElement.style as any).webkitUserSelect = 'none';
      (renderer.domElement.style as any).touchAction = 'none';

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 5;
      controls.maxDistance = 30;

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

      const center = memo.nodes.find((n) => n.type === ("person" as unknown as string));
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
        role: 6.5,
        experience: 7.5,
        company: 7.5,
        project: 9.0, // slightly closer
        music: 10.5,  // slightly farther to avoid overlap with projects
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
        // Deterministic per-type base phase
        let phase = (hash(type) / 4294967295) * Math.PI * 2;
        // Additional label-based jitter to separate similarly named nodes across types
        const labelHash = (s: string) => {
          let h = 0;
          for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
          return h / 4294967295;
        };
        if (type === "music" || type === "project") {
          // Use node labels to offset the phase slightly
          // Combine all labels in this group to make distribution stable across renders
          const combined = arr.map((n) => n.label).join("|");
          phase += (labelHash(combined) - 0.5) * 0.6; // ±0.3 rad tweak
        }
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
      
      // Color array for nodes based on type
      const colors: number[] = [];
      const getNodeColor = (name: string, fallbackHex: number) => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        if (v) {
        try { return new THREE.Color(v as string); } catch {}
        }
        return new THREE.Color(fallbackHex);
      };
      
      const accentBrown = getNodeColor("--accent-brown", 0x8b6b4a);
      const accentBlue = getNodeColor("--accent", 0x3b82f6);
      const accentGreen = getNodeColor("--accent-green", 0x22c55e);
      const red = new THREE.Color(0xff0000);
      const white = new THREE.Color(0xffffff);
      
      for (let i = 0; i < indexToId.length; i++) {
        const id = indexToId[i];
        const node = nodeById.get(id);
        let color = white;
        
        if (node) {
          // Check if it's a Tech N9ne related project (music node)
          if (node.type === "music" && node.label.toLowerCase().includes("tech n9ne")) {
            color = red;
          } else if (node.type === "company" || node.type === "cred") {
            // Companies and credentials (which include companies) = brown
            color = accentBrown;
          } else if (node.type === "role" || node.type === "experience") {
            color = accentBlue;
          } else if (node.type === "skill") {
            color = accentGreen;
          }
        }
        
        colors.push(color.r, color.g, color.b);
      }
      
      pointGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const pointMat = new THREE.PointsMaterial({ 
        size: 0.12, 
        sizeAttenuation: true,
        vertexColors: true
      });
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
        const c = new THREE.Color(v as string);
        return c.getHex();
      };
      const lineColor = getCSSColor("--accent-brown", 0x8b6b4a);
      const lineMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.2 });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);

      // Hover/tap picking
      const raycaster = new THREE.Raycaster();
      // Dynamic pick radius - much larger on touch for easier hits
      const updatePickThreshold = () => {
        const threshold = isTouchRef.current ? 0.25 : 0.12;
      (raycaster.params as any).Points = { threshold };
      };
      updatePickThreshold();
      const ndc = new THREE.Vector2();
      let isDragging = false;
      const selectNodeAt = (clientX: number, clientY: number) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const cx = clientX - rect.left;
        const cy = clientY - rect.top;
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
              return node.id;
            }
          }
        }
        return null;
      };

      const onPointerMove = (ev: PointerEvent) => {
        // Ignore hover logic on touch devices to avoid flicker/clearing selection
        if (isTouchRef.current) return;
        if (isDragging) { setHover(null); isHoveringLabelRef.current = false; return; }
        const rect = renderer.domElement.getBoundingClientRect();
        const cx = ev.clientX - rect.left;
        const cy = ev.clientY - rect.top;
        const hitId = selectNodeAt(ev.clientX, ev.clientY);
        if (hitId) { isHoveringLabelRef.current = true; renderer.domElement.style.cursor = "pointer"; return; }
        renderer.domElement.style.cursor = "grab";
        isHoveringLabelRef.current = false;
        setHover(null);
      };
      // Touch tap handling for mobile: toggle MobileTooltip anchored to top/bottom
      const onPointerDown = (ev: PointerEvent) => {
        const isTouch = ev.pointerType === 'touch' || (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches);
        if (!isTouch) return;
        // Record start to distinguish tap vs drag; do not block OrbitControls
        touchStartRef.current = { x: ev.clientX, y: ev.clientY, time: performance.now() };
      };

      const onPointerUp = (ev: PointerEvent) => {
        const isTouch = ev.pointerType === 'touch' || (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches);
        if (!isTouch) return;
        const start = touchStartRef.current;
        touchStartRef.current = null;
        if (!start) return;
        const dx = ev.clientX - start.x;
        const dy = ev.clientY - start.y;
        const distSq = dx * dx + dy * dy;
        const dt = performance.now() - start.time;
        const TAP_MAX_DIST_SQ = 15 * 15; // More forgiving threshold
        const TAP_MAX_DT = 500; // More time for slower taps
        if (distSq > TAP_MAX_DIST_SQ || dt > TAP_MAX_DT) {
          // Treat as drag; do nothing so OrbitControls handles it
          return;
        }

        // Force update pick threshold with live ref value
        const threshold = isTouchRef.current ? 0.3 : 0.12; // Even larger pick radius
        (raycaster.params as any).Points = { threshold };
        
        const rect = renderer.domElement.getBoundingClientRect();
        const cy = ev.clientY - rect.top;
        const vhMid = rect.height / 2;
        const anchor: "top" | "bottom" = cy > vhMid ? "top" : "bottom";
        
        // Direct raycast without calling selectNodeAt to avoid hover side-effects
        const cx = ev.clientX - rect.left;
        ndc.x = (cx / rect.width) * 2 - 1;
        ndc.y = -(cy / rect.height) * 2 + 1;
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObject(points, false);
        
        let hitId: string | null = null;
        if (hits.length > 0) {
          const idx = (hits[0].index ?? -1) as number;
          if (idx >= 0) {
            const id = indexToId[idx];
            if (idToIndex.has(id)) {
              hitId = id;
            }
          }
        }
        
        if (hitId) {
          const node = nodeById.get(hitId);
          if (!node) return;
          
          // Immediate state update, no batching
          if (mobileOpen && mobileAnchor === anchor && mobileSelectedId === hitId) {
            // Close
            setMobileOpen(false);
            setMobileAnchor(null);
            setMobileSelectedId(null);
            setHover(null);
          } else {
            // Open - set all state in one batch
            setMobileAnchor(anchor);
            setMobileSelectedId(hitId);
            setHover({ id: node.id, label: node.label, type: node.type as string, x: cx, y: cy });
            setMobileOpen(true); // Set open last to ensure other state is ready
          }
        } else {
          // Tapped empty space → close
          setMobileOpen(false);
          setMobileAnchor(null);
          setMobileSelectedId(null);
          setHover(null);
        }
      };
      const onPointerLeave = () => { setHover(null); renderer.domElement.style.cursor = "grab"; };
      const onPointerEnter = () => { isHoveringCanvasRef.current = true; };
      const onPointerLeaveCanvas = () => { isHoveringCanvasRef.current = false; };

      renderer.domElement.style.cursor = "grab";
      renderer.domElement.addEventListener("pointermove", onPointerMove, { passive: true } as any);
      renderer.domElement.addEventListener("pointerleave", onPointerLeave);
      renderer.domElement.addEventListener("pointerenter", onPointerEnter);
      renderer.domElement.addEventListener("pointerleave", onPointerLeaveCanvas);
      renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true } as any);
      renderer.domElement.addEventListener('pointerup', onPointerUp, { passive: true } as any);
      controls.addEventListener("start", () => { isDragging = true; setHover(null); isHoveringLabelRef.current = false; });
      controls.addEventListener("end", () => { isDragging = false; });

      let raf = 0;
      const tempVec = new THREE.Vector3();
      const spherical = new THREE.Spherical();
      let currentRotationSpeed = 0;
      const targetRotationSpeed = 0.0004; // Even slower rotation speed (0.5x)
      const targetVerticalSpeed = 0.00015; // Gentle vertical bobbing (0.5x)
      const easingFactor = 0.02; // How quickly it eases in/out
      let verticalPhase = 0; // Track vertical oscillation phase
      const verticalAmplitude = 0.05; // radians offset for polar angle (~2.8deg)
      let autoRotating = false; // track if auto-rotation is currently active
      let basePhi = 0; // baseline polar angle when auto-rotation starts/resumes

      const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
      const minPhi = 0.01;
      const maxPhi = Math.PI - 0.01;

      const animate = () => {
        // Smoothly ease rotation speed based on hover/dragging state
        // Important: Mobile/tablet must NEVER auto-rotate. Use isTouchRef to avoid stale closure state.
        // Stop rotation when hovering over canvas OR text labels, or when dragging
        const targetSpeed = (!isTouchRef.current && !isHoveringCanvasRef.current && !isHoveringLabelRef.current && !isDragging)
          ? targetRotationSpeed
          : 0;
        currentRotationSpeed += (targetSpeed - currentRotationSpeed) * easingFactor;

        const nowActive = Math.abs(currentRotationSpeed) > 0.00001;
        
        // Only apply auto-rotation if active
        if (nowActive && !isDragging) {
          // Get current camera position in spherical coords
          const toCam = camera.position.clone().sub(controls.target);
          spherical.setFromVector3(toCam);

          if (!autoRotating) {
            // Starting auto-rotation: align baseline to avoid vertical jump
            const currentDesiredOffset = Math.sin(verticalPhase) * verticalAmplitude;
            basePhi = clamp(spherical.phi - currentDesiredOffset, minPhi, maxPhi);
            autoRotating = true;
          }

          // Horizontal azimuthal rotation (theta around Y axis)
          spherical.theta += currentRotationSpeed;

          // Gentle vertical modulation (phi) around baseline
          verticalPhase += targetVerticalSpeed;
          const desiredOffset = Math.sin(verticalPhase) * verticalAmplitude;
          spherical.phi = clamp(basePhi + desiredOffset, minPhi, maxPhi);

          // Write back to camera position
          tempVec.setFromSpherical(spherical);
          camera.position.copy(controls.target).add(tempVec);
          camera.lookAt(controls.target);
        } else if (autoRotating) {
          // Stopping auto-rotation: keep camera where it is
          autoRotating = false;
        }

        // Update controls AFTER auto-rotation (if any)
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
        renderer.domElement.removeEventListener("pointerenter", onPointerEnter);
        renderer.domElement.removeEventListener("pointerleave", onPointerLeaveCanvas);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown as any);
        renderer.domElement.removeEventListener('pointerup', onPointerUp as any);
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

  // Compute related nodes and current node data for tooltip
  const relatedNodes = useMemo(() => {
    if (!hover) return [];
    const ids = new Set<string>();
    for (const l of memo.links) {
      if (l.source === hover.id) ids.add(l.target);
      else if (l.target === hover.id) ids.add(l.source);
    }
    return memo.nodes.filter((n) => ids.has(n.id));
  }, [hover, memo]);

  const currentNode = useMemo(() => {
    if (!hover) return null;
    return memo.nodes.find((n) => n.id === hover.id) || null;
  }, [hover, memo]);

  // Mobile-specific current node derived from mobileSelectedId so tooltip
  // does not depend on transient `hover` state (which is cleared by pointermove)
  const mobileCurrentNode = useMemo(() => {
    if (!mobileSelectedId) return null;
    return memo.nodes.find((n) => n.id === mobileSelectedId) || null;
  }, [mobileSelectedId, memo]);

  const mobileRelatedNodes = useMemo(() => {
    if (!mobileSelectedId) return [];
    const ids = new Set<string>();
    for (const l of memo.links) {
      if (l.source === mobileSelectedId) ids.add(l.target);
      else if (l.target === mobileSelectedId) ids.add(l.source);
    }
    return memo.nodes.filter((n) => ids.has(n.id));
  }, [mobileSelectedId, memo]);

  return (
    <div
      ref={ref}
      className="relative w-full h-full select-none"
      style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' as any }}
    >
      {/* Debug info removed */}
      {/* Tooltip container to keep within viewport */}
      <TooltipStyles />
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-sm text-[color:var(--muted)]">Preparing 3D…</div>
      )}
      {ready && labels.filter((l) => l.visible).map((l) => (
        <div
          key={l.id}
          className="absolute text-[10px] text-white/70 whitespace-nowrap cursor-pointer hover:text-white transition-colors select-none"
          style={{ left: l.x, top: l.y, transform: "translate(-50%, -120%)", pointerEvents: 'auto' }}
          onMouseEnter={() => { setHover({ id: l.id, label: l.label, type: l.type, x: l.x, y: l.y }); isHoveringLabelRef.current = true; }}
          onMouseLeave={() => { setHover(null); isHoveringLabelRef.current = false; }}
          onPointerDown={(e: any) => {
            // Record touch start for label taps (mobile). Do not stop propagation so drag still works.
            if (!isTouchRef.current) return;
            touchStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
          }}
          onPointerUp={(e: any) => {
            if (!isTouchRef.current) return;
            const start = touchStartRef.current;
            touchStartRef.current = null;
            if (!start) return;
            const dx = e.clientX - start.x;
            const dy = e.clientY - start.y;
            const distSq = dx * dx + dy * dy;
            const dt = performance.now() - start.time;
            const TAP_MAX_DIST_SQ = 15 * 15;
            const TAP_MAX_DT = 500;
            if (distSq > TAP_MAX_DIST_SQ || dt > TAP_MAX_DT) return; // treat as drag
            // It's a tap on the label — open mobile tooltip for this id
            const rect = ref.current?.getBoundingClientRect();
            if (!rect) return;
            const cy = e.clientY - rect.top;
            const vhMid = rect.height / 2;
            const anchor: "top" | "bottom" = cy > vhMid ? "top" : "bottom";
            const hitId = l.id;
            const cx = e.clientX - rect.left;
            // Update mobile selection
            if (mobileOpen && mobileAnchor === anchor && mobileSelectedId === hitId) {
              setMobileOpen(false);
              setMobileAnchor(null);
              setMobileSelectedId(null);
              setHover(null);
            } else {
              setMobileAnchor(anchor);
              setMobileSelectedId(hitId);
              setHover({ id: l.id, label: l.label, type: l.type, x: cx, y: cy });
              setMobileOpen(true);
            }
          }}
        >
          {l.label}
        </div>
      ))}
      {/* Desktop tooltip */}
      {(!isTouchDevice && hover && currentNode) && (
        <TooltipBox x={hover.x} y={hover.y}>
          <div className="font-semibold text-[color:var(--accent)] text-sm">{hover.label}</div>
          <div className="text-[10px] text-[color:var(--muted)] mt-0.5 capitalize">{hover.type}</div>
          {currentNode.meta && (
            <div className="mt-3 space-y-2">
              {(currentNode.meta as any).description && (
                <div className="text-[11px] leading-relaxed text-white/80">{(currentNode.meta as any).description}</div>
              )}
              {((currentNode.meta as any).stack || (currentNode.meta as any).technologies) && (
                <div className="mt-2">
                  <div className="text-[10px] text-[color:var(--accent-green)] font-medium mb-1">{(currentNode.meta as any).stack ? "Stack" : "Technologies"}</div>
                  <div className="flex flex-wrap gap-1">
                    {((currentNode.meta as any).stack || (currentNode.meta as any).technologies || []).map((tech: string, i: number) => (
                      <span key={i} className="inline-block rounded bg-[color:var(--accent-green)]/20 px-1.5 py-0.5 text-[10px] text-[color:var(--accent-green)]">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
              {(currentNode.meta as any).timeline && (
                <div className="text-[10px] text-[color:var(--muted)]"><span className="font-medium">Timeline:</span> {(currentNode.meta as any).timeline}</div>
              )}
              {(currentNode.meta as any).impact && (
                <div className="text-[10px] text-[color:var(--accent-brown)]"><span className="font-medium">Impact:</span> {(currentNode.meta as any).impact}</div>
              )}
              {(currentNode.meta as any).proficiency && (
                <div className="text-[10px]"><span className="font-medium text-[color:var(--muted)]">Proficiency:</span> <span className="text-[color:var(--accent)]">{(currentNode.meta as any).proficiency}</span></div>
              )}
              {(currentNode.meta as any).projects && Array.isArray((currentNode.meta as any).projects) && (
                <div className="mt-2">
                  <div className="text-[10px] text-[color:var(--muted)] font-medium mb-1">Used in</div>
                  <div className="text-[10px] text-white/70">{(currentNode.meta as any).projects.join(", ")}</div>
                </div>
              )}
              {(currentNode.meta as any).keyAchievements && (
                <div className="mt-2">
                  <div className="text-[10px] text-[color:var(--accent-brown)] font-medium mb-1">Key Achievements</div>
                  <ul className="list-disc list-inside text-[10px] text-white/80 space-y-0.5">
                    {((currentNode.meta as any).keyAchievements || []).map((achievement: string, i: number) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {relatedNodes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-[10px] text-[color:var(--muted)] mb-1.5 font-medium">Related Connections</div>
              <div className="flex flex-wrap gap-1">
                {relatedNodes.slice(0, 12).map((n) => (
                  <span key={n.id} className="inline-block rounded bg-white/10 px-1.5 py-0.5 text-[10px] hover:bg-white/20 transition-colors">{n.label}</span>
                ))}
                {relatedNodes.length > 12 && (
                  <span className="text-[10px] text-[color:var(--muted)]">+{relatedNodes.length - 12} more</span>
                )}
              </div>
            </div>
          )}
        </TooltipBox>
      )}

      {/* Mobile tooltip */}
      {isTouchDevice && mobileOpen && mobileAnchor && mobileSelectedId && mobileCurrentNode && (
        <MobileTooltip 
          anchor={mobileAnchor} 
          onClose={() => { setMobileOpen(false); setMobileAnchor(null); setMobileSelectedId(null); setHover(null); }}
        >
          <div className="font-semibold text-[color:var(--accent)] text-sm">{mobileCurrentNode.label}</div>
          <div className="text-[10px] text-[color:var(--muted)] mt-0.5 capitalize">{mobileCurrentNode.type}</div>
          {mobileCurrentNode.meta && (
            <div className="mt-3 space-y-2">{(mobileCurrentNode.meta as any).description}</div>
          )}
          {mobileRelatedNodes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              {mobileRelatedNodes.slice(0,6).map((n) => (
                <div key={n.id} className="inline-block rounded bg-white/10 px-2 py-1 text-[10px] mr-1">{n.label}</div>
              ))}
            </div>
          )}
        </MobileTooltip>
      )}
    </div>
  );
}

function TooltipBox({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  // Compute clamped position with smart flipping near edges
  const PADDING = 12;
  const MAX_W = 480; // matches max-w-md
  const MIN_W = 300; // prevent ultra-thin tooltips on flip
  const MAX_H = 0.8 * (typeof window !== 'undefined' ? window.innerHeight : 800);

  let left = x + PADDING;
  let top = y + PADDING;
  let transform = "translate(0, 0)";

  if (typeof window !== 'undefined') {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Flip horizontally if exceeding right edge
    if (left + MAX_W + PADDING > vw) {
      // When anchoring to the right edge of the tooltip (translateX(-100%)),
      // ensure there is at least MIN_W space to the left of the anchor.
      left = Math.max(PADDING + MIN_W, x - PADDING);
      transform = "translate(-100%, 0)";
    }

    // Flip vertically if exceeding bottom edge
    if (top + MAX_H + PADDING > vh) {
      top = Math.max(PADDING, y - PADDING);
      transform = transform.includes("-100%") ? "translate(-100%, -100%)" : "translate(0, -100%)";
    }

    // Clamp to viewport
    left = Math.min(Math.max(left, PADDING), vw - PADDING);
    top = Math.min(Math.max(top, PADDING), vh - PADDING);
  }

  return (
    <div
      className="pointer-events-none absolute rounded-lg bg-black/90 px-4 py-3 text-xs ring-1 ring-white/20 z-10 max-w-md backdrop-blur-sm"
      style={{ left, top, transform, maxHeight: MAX_H, overflowY: 'auto' as const, minWidth: MIN_W, maxWidth: 'min(480px, calc(100vw - 24px))' }}
    >
      {children}
    </div>
  );
}

function TooltipStyles() {
  return null;
}


