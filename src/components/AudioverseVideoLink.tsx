"use client";

import { useState } from "react";

export default function AudioverseVideoLink({ src, desc }: { src: string; desc?: string }) {
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
      <p>{desc ?? "This demo uses mock data for the \"Audioverse\" and \"Feed\" screens to illustrate flows that would normally require larger amounts of user data. \"Scan\", \"Libary\", and \"Profile\" screens all use real blockchain data on the Goerli test network and real IPFS peer shared data for full decentralization."}</p>
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

