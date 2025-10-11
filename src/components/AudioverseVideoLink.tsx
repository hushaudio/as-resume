"use client";

import { useState } from "react";

export default function AudioverseVideoLink({ src }: { src: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
    <div className="mt-2">
      <button
        onClick={() => setOpen(true)}
        className="text-accent underline decoration-dotted"
        type="button"
        >
        click here for video example
      </button>
      <p>This demo uses mock data for the &quot;Audioverse&quot; and &quot;Feed&quot; screens to illustrate flows that would normally require larger amounts of user data. &quot;Scan&quot;, &quot;Libary&quot;, and &quot;Profile&quot; screens all use real blockchain data on the Goerli test network and real IPFS peer shared data for full decentralization.</p>
    </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
        <div className="w-[min(95vw,400px)] aspect-[10/20] bg-black rounded-lg p-4 overflow-hidden">
            <div className="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-2 py-1 text-sm text-muted-foreground"
                aria-label="Close video"
              >
                Close
              </button>
            </div>
            <div className="mt-2">
              <div className="w-full h-full grid place-items-center">
                <video
                  src={src}
                  controls
                  className="w-full rounded bg-black"
                  style={{ maxHeight: 'calc(100vh - 220px)', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


