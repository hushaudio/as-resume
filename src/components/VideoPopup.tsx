"use client";

import { useState, useEffect } from "react";

interface VideoPopupProps {
  src: string;
  linkText: string;
  description?: string;
  linkColor?: string;
}

export default function VideoPopup({ src, linkText, description, linkColor = "text-accent" }: VideoPopupProps) {
  const [open, setOpen] = useState(false);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [open]);
  
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${linkColor} hover:underline cursor-pointer inline-flex items-center gap-1`}
        type="button"
      >
        {linkText}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
      {description && <span className="text-sm text-muted-foreground ml-1">— {description}</span>}

      {open && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl my-8 bg-[color:var(--surface)] rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-semibold text-[color:var(--color-foreground)]">Demo Video</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-[color:var(--color-foreground)] transition-colors p-1 rounded-full hover:bg-[color:var(--muted-bg)]"
                aria-label="Close video"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Video Container */}
            <div className="relative bg-black" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <video
                src={src}
                controls
                autoPlay
                className="w-full h-full object-contain"
                style={{ maxHeight: 'calc(90vh - 180px)' }}
              />
            </div>
            
            {/* Footer with description */}
            {description && (
              <div className="p-4 border-t text-sm text-muted-foreground" style={{ borderColor: 'var(--border)' }}>
                {description}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
