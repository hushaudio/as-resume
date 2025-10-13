import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aaron Shier | Senior Developer & Creative Engineer",
  description:
    "Engineer-artist who unfolds solutions where there's no template—and ships them reliable.",
  icons: {
    icon: [
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: light)", sizes: "32x32" },
      { url: "/favicon-light.png", media: "(prefers-color-scheme: dark)", sizes: "32x32" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Comprehensive favicon support for crisp rendering */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-light.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-dark.png" media="(prefers-color-scheme: dark)" />
        {/* Fallback for browsers that don't support media queries */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-dark.png" />
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-light.png" media="(prefers-color-scheme: light)" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-dark.png" media="(prefers-color-scheme: dark)" />
        {/* Windows tile */}
        <meta name="msapplication-TileColor" content="#0A0A0A" />
        <meta name="msapplication-TileImage" content="/favicon-dark.png" />
        {/* Theme color */}
        <meta name="theme-color" content="#0A0A0A" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        {/* Apply saved theme ASAP to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { var d = document.documentElement; var s = localStorage.getItem('theme'); if (s === 'dark' || s === 'light') { d.classList.add(s); } } catch(e) {} })();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Transparent floating nav */}
        <div className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
          <nav className="mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-3 items-center rounded-full bg-[var(--surface)] backdrop-blur-md px-4 py-2 ring-1 border-theme pointer-events-auto select-none" style={{ ['--tw-ring-color' as string]: 'var(--border)' }}>
              <div className="justify-self-start">
                <Link href="/resume" className="text-sm text-[var(--color-foreground)]/90 hover:opacity-100 transition-opacity">Classic Resume</Link>
              </div>
              <div className="justify-self-center">
                <ThemeToggle />
              </div>
              <div className="justify-self-end">
                <Link href="/graph" className="text-sm text-[var(--color-foreground)]/90 hover:opacity-100 transition-opacity">Experience Graph</Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
          {children}
        </div>
      </body>
    </html>
  );
}
