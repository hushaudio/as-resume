"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const getIsDark = () => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return mq.matches; // system
    };

    setIsDark(getIsDark());

    const onSystemChange = () => {
      if (!localStorage.getItem("theme")) {
        setIsDark(mq.matches);
      }
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  const handleClick = () => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const saved = localStorage.getItem("theme");

    const apply = (mode: "light" | "dark" | null) => {
      root.classList.remove("light", "dark");
      if (mode) root.classList.add(mode);
    };

    if (!saved) {
      const mode = mq.matches ? "light" : "dark"; // opposite of system
      localStorage.setItem("theme", mode);
      apply(mode);
      setIsDark(mode === "dark");
    } else if (saved === "light") {
      localStorage.setItem("theme", "dark");
      apply("dark");
      setIsDark(true);
    } else {
      localStorage.setItem("theme", "light");
      apply("light");
      setIsDark(false);
    }
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={handleClick}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--muted-bg)]"
    >
      {/* Render nothing until mounted to avoid hydration mismatch */}
      {isDark === null ? null : isDark ? (
        // Moon icon
        <svg viewBox="0 0 24 24" width="20" height="20" className="text-[var(--color-foreground)]">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
        </svg>
      ) : (
        // Sun icon
        <svg viewBox="0 0 24 24" width="20" height="20" className="text-[var(--color-foreground)]">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
          <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </button>
  );
}

