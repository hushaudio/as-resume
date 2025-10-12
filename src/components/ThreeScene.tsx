/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import MobileTooltip from "./MobileTooltip";
import type { GraphData } from "@/components/InteractiveScene";
import { getNodeTypeColor } from "@/lib/nodeColors";

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
  // Desktop-only: lock tooltip on click until outside click or new hover
  const [locked, setLocked] = useState<{ id: string; x: number; y: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [showControlsTooltip, setShowControlsTooltip] = useState(false);
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

  // Global outside-click to clear desktop locked tooltip when clicking outside the component
  useEffect(() => {
    const onDocPointerDown = (e: PointerEvent) => {
      if (!locked) return;
      const root = ref.current;
      const tip = tooltipRef.current;
      const target = e.target as Node | null;
      if (!target) return;
      // If click is inside tooltip, ignore (tooltip should not close)
      if (tip && tip.contains(target)) return;
      // If click is outside root container, clear lock
      if (root && !root.contains(target)) {
        setLocked(null);
      }
    };
    document.addEventListener('pointerdown', onDocPointerDown, true);
    return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
  }, [locked]);
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
      const getCSSColorAsThree = (name: string, fallbackHex: number) => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        if (v) {
          try { return new THREE.Color(v as string); } catch {}
        }
        return new THREE.Color(fallbackHex);
      };
      
      const accentBrown = getCSSColorAsThree("--accent-brown", 0xd78736);
      const accentBlue = getCSSColorAsThree("--accent", 0x60a5fa);
      const accentGreen = getCSSColorAsThree("--accent-green", 0x86efac);
      const accentPurple = getCSSColorAsThree("--accent-purple", 0xc084fc);
      const red = new THREE.Color(0xff0000);
      const white = new THREE.Color(0xffffff);
      
      for (let i = 0; i < indexToId.length; i++) {
        const id = indexToId[i];
        const node = nodeById.get(id);
        let color = white;
        
        if (node) {
          // Check if it's a Tech N9ne related project (music node) - special red
          if (node.type === "music" && node.label.toLowerCase().includes("tech n9ne")) {
            color = red;
          } else if (node.type === "project" || node.type === "company") {
            // Projects & companies = brown
            color = accentBrown;
          } else if (node.type === "music") {
            // Music = purple
            color = accentPurple;
          } else if (node.type === "skill") {
            // Skills = green
            color = accentGreen;
          } else if (node.type === "role" || node.type === "experience" || node.type === "cred") {
            // Experience/roles/credentials = blue
            color = accentBlue;
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
        if (hitId) {
          // If hovering a new node while locked, release lock
          if (locked && locked.id !== hitId) setLocked(null);
          isHoveringLabelRef.current = true; renderer.domElement.style.cursor = "pointer"; return;
        }
        renderer.domElement.style.cursor = "grab";
        isHoveringLabelRef.current = false;
        setHover(null);
      };
      // Desktop click to lock/unlock
      const onPointerUpDesktop = (ev: PointerEvent) => {
        if (isTouchRef.current) return; // handled by mobile logic
        if (isDragging) return;
        const rect = renderer.domElement.getBoundingClientRect();
        const cx = ev.clientX - rect.left;
        const cy = ev.clientY - rect.top;
        const hitId = selectNodeAt(ev.clientX, ev.clientY);
        if (hitId) {
          setLocked({ id: hitId, x: cx, y: cy });
        } else {
          // Clicked empty canvas -> clear lock
          setLocked(null);
        }
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
      renderer.domElement.addEventListener('pointerup', onPointerUpDesktop, { passive: true } as any);
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
    const id = isTouchDevice ? hover?.id : (hover?.id ?? locked?.id);
    if (!id) return [];
    const ids = new Set<string>();
    for (const l of memo.links) {
      if (l.source === id) ids.add(l.target);
      else if (l.target === id) ids.add(l.source);
    }
    return memo.nodes.filter((n) => ids.has(n.id));
  }, [hover, locked, memo, isTouchDevice]);

  // Active selection for desktop: prefer hover; fall back to locked
  const activeId = useMemo(() => {
    if (isTouchDevice) return hover?.id ?? null;
    return (hover?.id ?? locked?.id) ?? null;
  }, [hover, locked, isTouchDevice]);

  const activePos = useMemo(() => {
    if (isTouchDevice) return hover ? { x: hover.x, y: hover.y } : null;
    if (hover) return { x: hover.x, y: hover.y };
    if (locked) return { x: locked.x, y: locked.y };
    return null;
  }, [hover, locked, isTouchDevice]);

  const currentNode = useMemo(() => {
    if (!activeId) return null;
    return memo.nodes.find((n) => n.id === activeId) || null;
  }, [activeId, memo]);

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
      {/* Controls help icon - Desktop */}
      {ready && !isTouchDevice && (
        <div className="absolute top-4 left-4 z-20">
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm ring-1 ring-white/20 cursor-help transition-all hover:bg-black/80 hover:ring-white/40"
            onMouseEnter={() => setShowControlsTooltip(true)}
            onMouseLeave={() => setShowControlsTooltip(false)}
          >
            {/* Camera icon */}
            <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-white/70 font-medium">?</span>
          </div>
          
          {/* Controls tooltip */}
          {showControlsTooltip && (
            <div className="absolute top-full left-0 mt-2 w-64 px-3 py-2.5 rounded-lg bg-black/90 backdrop-blur-sm ring-1 ring-white/20 text-xs text-white/80 space-y-3">
              <div className="font-semibold text-white text-sm">Camera Controls</div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] font-medium min-w-[60px]">Rotate:</span>
                  <span>Click and drag</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] font-medium min-w-[60px]">Pan:</span>
                  <span>Right-click drag or Shift + drag</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[color:var(--accent)] font-medium min-w-[60px]">Zoom:</span>
                  <span>Mouse wheel</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[color:var(--accent-green)] font-medium min-w-[60px]">Select:</span>
                  <span>Click node or label</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <div className="font-semibold text-white text-sm mb-1.5">Color Guide</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[color:var(--accent-brown)]" />
                    <span className="text-[10px]">Projects & Companies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[color:var(--accent-purple)]" />
                    <span className="text-[10px]">Music & Creative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[color:var(--accent-green)]" />
                    <span className="text-[10px]">Skills & Tech</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[color:var(--accent)]" />
                    <span className="text-[10px]">Experience & Roles</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Controls help icon - Mobile */}
      {ready && isTouchDevice && !mobileOpen && (
        <div className="absolute top-4 left-4 z-20">
          <button 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm ring-1 ring-white/20 transition-all active:bg-black/80 active:ring-white/40"
            onClick={() => setShowControlsTooltip(!showControlsTooltip)}
          >
            {/* Touch icon */}
            <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            <span className="text-xs text-white/70 font-medium">?</span>
          </button>
          
          {/* Controls tooltip */}
          {showControlsTooltip && (
            <>
              {/* Backdrop to close on tap outside */}
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10"
                onClick={() => setShowControlsTooltip(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-64 px-3 py-2.5 rounded-lg bg-black/90 backdrop-blur-sm ring-1 ring-white/20 text-xs text-white/80 space-y-3 z-20">
                <div className="font-semibold text-white text-sm">Touch Controls</div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-[color:var(--accent)] font-medium min-w-[60px]">Rotate:</span>
                    <span>Swipe with one finger</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[color:var(--accent)] font-medium min-w-[60px]">Pan:</span>
                    <span>Swipe with two fingers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[color:var(--accent)] font-medium min-w-[60px]">Zoom:</span>
                    <span>Pinch to zoom in/out</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[color:var(--accent-green)] font-medium min-w-[60px]">Select:</span>
                    <span>Tap node or label</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-white/10">
                  <div className="font-semibold text-white text-sm mb-1.5">Color Guide</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[color:var(--accent-brown)]" />
                      <span className="text-[10px]">Projects & Companies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[color:var(--accent-purple)]" />
                      <span className="text-[10px]">Music & Creative</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[color:var(--accent-green)]" />
                      <span className="text-[10px]">Skills & Tech</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[color:var(--accent)]" />
                      <span className="text-[10px]">Experience & Roles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-[10px]">Tech N9ne / Strange Music</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
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
          onMouseEnter={() => {
            if (locked && locked.id !== l.id) setLocked(null);
            setHover({ id: l.id, label: l.label, type: l.type, x: l.x, y: l.y });
            isHoveringLabelRef.current = true;
          }}
          onMouseLeave={() => { setHover(null); isHoveringLabelRef.current = false; }}
          onClick={(e) => {
            if (isTouchRef.current) return;
            e.stopPropagation();
            setLocked({ id: l.id, x: l.x, y: l.y });
          }}
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
      {(!isTouchDevice && activeId && activePos && currentNode) && (
        <TooltipBox x={activePos.x} y={activePos.y} interactive={!!locked} innerRef={tooltipRef}>
          <div className="font-semibold text-sm" style={{ color: getNodeTypeColor(currentNode.type) }}>{currentNode.label}</div>
          <div className="text-[10px] text-[color:var(--muted)] mt-0.5 capitalize">{currentNode.type}</div>
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
              {(currentNode.meta as any).keyChallenges && (
                <div className="mt-2">
                  <div className="text-[10px] text-[color:var(--accent-purple)] font-medium mb-1">Key Challenges</div>
                  <div className="space-y-1">
                    {(currentNode.meta as any).keyChallenges.map((challenge: string, i: number) => (
                      <div key={i} className="text-[10px] text-white/70 leading-relaxed">• {challenge}</div>
                    ))}
                  </div>
                </div>
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
              {(currentNode.meta as any).year && (
                <div className="text-[10px] text-[color:var(--muted)] mt-2"><span className="font-medium">Year:</span> {(currentNode.meta as any).year}</div>
              )}
              {(currentNode.meta as any).role && (
                <div className="text-[10px] text-[color:var(--accent-purple)] mt-1"><span className="font-medium">Role:</span> {(currentNode.meta as any).role}</div>
              )}
              {(currentNode.meta as any).genre && (
                <div className="text-[10px] text-[color:var(--muted)] mt-1"><span className="font-medium">Genre:</span> {(currentNode.meta as any).genre}</div>
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
          <div className="font-semibold text-sm" style={{ color: getNodeTypeColor(mobileCurrentNode.type) }}>{mobileCurrentNode.label}</div>
          <div className="text-[10px] text-[color:var(--muted)] mt-0.5 capitalize">{mobileCurrentNode.type}</div>
          {mobileCurrentNode.meta && (
            <div className="mt-3 space-y-2">
              {(mobileCurrentNode.meta as any).description && (
                <div className="text-[11px] leading-relaxed text-white/80">{(mobileCurrentNode.meta as any).description}</div>
              )}
              {((mobileCurrentNode.meta as any).stack || (mobileCurrentNode.meta as any).technologies) && (
                <div className="mt-2">
                  <div className="text-[10px] text-[color:var(--accent-green)] font-medium mb-1">{(mobileCurrentNode.meta as any).stack ? "Stack" : "Technologies"}</div>
                  <div className="flex flex-wrap gap-1">
                    {((mobileCurrentNode.meta as any).stack || (mobileCurrentNode.meta as any).technologies || []).map((tech: string, i: number) => (
                      <span key={i} className="inline-block rounded bg-[color:var(--accent-green)]/20 px-1.5 py-0.5 text-[10px] text-[color:var(--accent-green)]">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
              {(mobileCurrentNode.meta as any).timeline && (
                <div className="text-[10px] text-[color:var(--muted)]"><span className="font-medium">Timeline:</span> {(mobileCurrentNode.meta as any).timeline}</div>
              )}
              {(mobileCurrentNode.meta as any).impact && (
                <div className="text-[10px] text-[color:var(--accent-brown)]"><span className="font-medium">Impact:</span> {(mobileCurrentNode.meta as any).impact}</div>
              )}
              {(mobileCurrentNode.meta as any).keyChallenges && (
                <div className="mt-2">
                  <div className="text-[10px] text-[color:var(--accent-purple)] font-medium mb-1">Key Challenges</div>
                  <div className="space-y-1">
                    {(mobileCurrentNode.meta as any).keyChallenges.map((challenge: string, i: number) => (
                      <div key={i} className="text-[10px] text-white/70 leading-relaxed">• {challenge}</div>
                    ))}
                  </div>
                </div>
              )}
              {(mobileCurrentNode.meta as any).proficiency && (
                <div className="text-[10px]"><span className="font-medium text-[color:var(--muted)]">Proficiency:</span> <span className="text-[color:var(--accent)]">{(mobileCurrentNode.meta as any).proficiency}</span></div>
              )}
              {(mobileCurrentNode.meta as any).projects && Array.isArray((mobileCurrentNode.meta as any).projects) && (
                <div className="mt-2">
                  <div className="text-[10px] text-[color:var(--muted)] font-medium mb-1">Used in</div>
                  <div className="flex flex-wrap gap-1">
                    {(mobileCurrentNode.meta as any).projects.map((proj: string, i: number) => (
                      <span key={i} className="inline-block rounded bg-white/10 px-1.5 py-0.5 text-[10px]">{proj}</span>
                    ))}
                  </div>
                </div>
              )}
              {(mobileCurrentNode.meta as any).keyAchievements && (
                <div className="mt-2">
                  <div className="text-[10px] text-[color:var(--accent)] font-medium mb-1">Key Achievements</div>
                  <div className="space-y-1">
                    {(mobileCurrentNode.meta as any).keyAchievements.map((achievement: string, i: number) => (
                      <div key={i} className="text-[10px] text-white/70 leading-relaxed">• {achievement}</div>
                    ))}
                  </div>
                </div>
              )}
              {(mobileCurrentNode.meta as any).year && (
                <div className="text-[10px] text-[color:var(--muted)] mt-2"><span className="font-medium">Year:</span> {(mobileCurrentNode.meta as any).year}</div>
              )}
              {(mobileCurrentNode.meta as any).role && (
                <div className="text-[10px] text-[color:var(--accent-purple)] mt-1"><span className="font-medium">Role:</span> {(mobileCurrentNode.meta as any).role}</div>
              )}
              {(mobileCurrentNode.meta as any).genre && (
                <div className="text-[10px] text-[color:var(--muted)] mt-1"><span className="font-medium">Genre:</span> {(mobileCurrentNode.meta as any).genre}</div>
              )}
            </div>
          )}
          {mobileRelatedNodes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-[10px] text-[color:var(--muted)] mb-1.5 font-medium">Related Connections</div>
              <div className="flex flex-wrap gap-1">
                {mobileRelatedNodes.slice(0,6).map((n) => (
                  <div key={n.id} className="inline-block rounded bg-white/10 px-2 py-1 text-[10px]">{n.label}</div>
                ))}
                {mobileRelatedNodes.length > 6 && (
                  <span className="text-[10px] text-[color:var(--muted)]">+{mobileRelatedNodes.length - 6} more</span>
                )}
              </div>
            </div>
          )}
        </MobileTooltip>
      )}
    </div>
  );
}

function TooltipBox({ x, y, children, interactive = false, innerRef }: { x: number; y: number; children: React.ReactNode; interactive?: boolean; innerRef?: React.Ref<HTMLDivElement> }) {
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

    // Flip vertically if exceeding bottom edge, but only if there's room above
    if (top + MAX_H + PADDING > vh) {
      const flippedTop = y - PADDING;
      // Check if flipping upward would go off the top
      if (flippedTop >= PADDING) {
        // Safe to flip above
        top = flippedTop;
        transform = transform.includes("-100%") ? "translate(-100%, -100%)" : "translate(0, -100%)";
      }
      // Otherwise keep it below and let clamping handle it
    }

    // Additionally check if we're too close to top edge (when tooltip renders above by default or gets flipped)
    if (transform.includes("translateY(-100%)") || transform.includes("translate(-100%, -100%)") || transform.includes("translate(0, -100%)")) {
      // Tooltip is flipped upward, check if it would go off top
      const estimatedHeight = MAX_H;
      if (top - estimatedHeight < PADDING) {
        // Would go off top, flip it back down
        top = y + PADDING;
        transform = transform.includes("translateX(-100%)") || transform.includes("translate(-100%") ? "translate(-100%, 0)" : "translate(0, 0)";
      }
    }

    // Clamp to viewport
    left = Math.min(Math.max(left, PADDING), vw - PADDING);
    top = Math.min(Math.max(top, PADDING), vh - PADDING);
  }

  return (
    <div
      ref={innerRef as any}
      className={`${interactive ? 'pointer-events-auto' : 'pointer-events-none'} absolute rounded-lg bg-black/90 px-4 py-3 text-xs ring-1 ring-white/20 z-10 max-w-md backdrop-blur-sm`}
      style={{ left, top, transform, maxHeight: MAX_H, overflowY: 'auto' as const, minWidth: MIN_W, maxWidth: 'min(480px, calc(100vw - 24px))' }}
      onPointerDown={interactive ? (e) => { e.stopPropagation(); } : undefined}
    >
      {children}
    </div>
  );
}

function TooltipStyles() {
  return null;
}
