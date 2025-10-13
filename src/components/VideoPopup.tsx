"use client";

import { useState } from "react";

interface VideoPopupProps {
  src: string;
  linkText: string;
  description?: string;
  linkColor?: string;
}

export default function VideoPopup({ src, linkText, description, linkColor = "text-accent" }: VideoPopupProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <div className="mt-2">
        <button
          onClick={() => setOpen(true)}
          className={`${linkColor} underline decoration-dotted`}
          type="button"
        >
          {linkText}
        </button>
        {description && <p className="mt-1">{description}</p>}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-[min(95vw,400px)] aspect-[9/19.5] bg-black rounded-lg p-4 overflow-hidden">
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

