"use client";

import { useEffect, useRef, useState } from "react";

type ThreeModule = typeof import("three");

export type ThreeSceneProps = {
  className?: string;
  /**
   * Clamp device pixel ratio to reduce GPU work.
   * Example: [1, 2] caps DPR between 1 and 2.
   */
  dpr?: [min: number, max: number];
  /**
   * Hint for the GPU power selection.
   * Use 'low-power' to avoid dGPU on laptops.
   */
  powerPreference?: WebGLPowerPreference;
  /** Transparent canvas by default to avoid paint cost. */
  transparent?: boolean;
};

/**
 * A lightweight, lazy-initialized Three.js scene optimized for PageSpeed.
 * - Loads Three only on the client, only when visible.
 * - Respects reduced motion, pauses when tab is hidden, and disposes on unmount.
 * - Clamps DPR to keep GPU work in check on high-DPI displays.
 */
export default function ThreeScene({
  className,
  dpr = [1, 2],
  powerPreference = "low-power",
  transparent = true,
}: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  // Defer initialization until in-viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || ready) return;

    let three: ThreeModule | null = null;
    let disposed = false;
    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Avoid heavy work on very low-memory devices.
    const navWithMem = navigator as Navigator & { deviceMemory?: number };
    const deviceMemory = typeof navWithMem.deviceMemory === "number" ? navWithMem.deviceMemory : undefined;
    if (deviceMemory && deviceMemory < 2) {
      // Render a static fallback (no WebGL) by simply returning.
      return;
    }

    const init = async () => {
      try {
        three = await import("three");
      } catch {
        // If dynamic import fails, do nothing gracefully.
        return;
      }
      if (disposed) return;

      const el = containerRef.current!;
      const {
        Scene,
        PerspectiveCamera,
        WebGLRenderer,
        BoxGeometry,
        Mesh,
        MeshNormalMaterial,
        Color,
        ACESFilmicToneMapping,
        SRGBColorSpace,
        Clock,
      } = three!;

      const scene = new Scene();
      if (!transparent) {
        scene.background = new Color(0x000000);
      }

      const camera = new PerspectiveCamera(60, 1, 0.1, 100);
      camera.position.set(2, 1.5, 3);

      const renderer = new WebGLRenderer({
        antialias: false,
        alpha: transparent,
        powerPreference,
        canvas: undefined,
      });
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.outputColorSpace = SRGBColorSpace;

      // Clamp DPR to avoid overdraw on hi-DPI.
      const minDPR = Math.max(0.75, dpr[0]);
      const maxDPR = Math.min(2.0, dpr[1]);
      const deviceDPR = Math.min(maxDPR, Math.max(minDPR, window.devicePixelRatio || 1));
      renderer.setPixelRatio(deviceDPR);

      el.appendChild(renderer.domElement);

      // Simple content: a small rotating cube.
      const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
      scene.add(cube);

      const clock = new Clock();

      const resize = () => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      resize();

      let paused = document.visibilityState === "hidden" || prefersReducedMotion;

      const onVisibility = () => {
        paused = document.visibilityState === "hidden" || prefersReducedMotion;
        if (!paused) loop();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const loop = () => {
        if (disposed || paused) return;
        const t = clock.getElapsedTime();
        cube.rotation.x = t * 0.6;
        cube.rotation.y = t * 0.4;
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(loop);
      };

      const onResize = () => resize();
      window.addEventListener("resize", onResize, { passive: true });

      if (prefersReducedMotion) {
        // Render a single static frame.
        renderer.render(scene, camera);
      } else if (document.visibilityState !== "hidden") {
        loop();
      }

      setReady(true);

      // Cleanup on unmount
      return () => {
        disposed = true;
        cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);

        // Dispose geometry/materials to free GPU memory.
        cube.geometry.dispose();
        if (Array.isArray(cube.material)) cube.material.forEach((m) => m.dispose());
        else cube.material.dispose();
        scene.clear();
        renderer.dispose();
        renderer.forceContextLoss?.();
        renderer.domElement?.remove();
      };
    };

    const cleanupPromise = init();

    return () => {
      disposed = true;
      if (typeof cleanupPromise === "function") cleanupPromise();
    };
  }, [visible, ready, dpr, powerPreference, transparent]);

  return (
    <div
      ref={containerRef}
      className={
        [
          // Reserve space to avoid CLS and keep LCP fast.
          "relative w-full aspect-[16/9] overflow-hidden rounded-xl",
          "bg-white/5 ring-1 ring-white/10",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")
      }
      aria-label="Decorative 3D scene"
      role="img"
    >
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-sm text-[color:var(--muted)]">
          Loading 3D…
        </div>
      )}
      {/* Canvas is injected by Three at runtime */}
      <noscript>
        <div className="absolute inset-0 grid place-items-center text-sm text-[color:var(--muted)]">
          Enable JavaScript to view the 3D scene.
        </div>
      </noscript>
    </div>
  );
}
