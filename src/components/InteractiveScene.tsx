"use client";

import { Suspense, lazy } from "react";

const LazyThreeScene = lazy(() => import("@/components/ThreeScene"));

export default function InteractiveScene() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-sm text-muted-foreground">
          Preparing 3D…
        </div>
      }
    >
      <LazyThreeScene />
    </Suspense>
  );
}

