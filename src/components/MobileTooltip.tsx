"use client";

import React from "react";

export default function MobileTooltip({ anchor, onClose, children }: { anchor: "top" | "bottom"; onClose: () => void; children: React.ReactNode }) {
  // Add top padding when anchored to top so content is pushed below the nav
  const innerPaddingClass = anchor === 'top' ? 'pt-16' : '';
  return (
    <div className={`fixed left-0 right-0 z-[60] transition-transform duration-300 ${anchor === 'bottom' ? 'bottom-0 translate-y-0' : 'top-0 -translate-y-0'}`}>
      <div className={`mx-auto max-w-4xl bg-black/95 text-xs text-white/90 p-4 ring-1 ring-white/10 ${innerPaddingClass} ${anchor === 'bottom' ? 'rounded-t-lg rounded-b-none' : 'rounded-t-none rounded-b-lg'}`}>
        <div className="flex justify-end">
          <button onClick={onClose} className="text-sm text-white/60">Close</button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}


