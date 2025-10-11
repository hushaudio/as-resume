import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
    "Engineer-artist who unfolds solutions where there’s no template—and ships them reliable.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Transparent floating nav */}
        <div className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
          <nav className="mx-auto max-w-4xl px-4">
                <div className="flex items-center justify-between rounded-full bg-black/20 backdrop-blur-md px-4 py-2 ring-1 ring-white/10 pointer-events-auto select-none">
              <Link href="/resume" className="text-sm text-white/80 hover:text-white transition-colors">Classic Resume</Link>
              <Link href="/graph" className="text-sm text-white/80 hover:text-white transition-colors">Experience Graph</Link>
            </div>
          </nav>
        </div>

        <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
          {children}
        </div>
      </body>
    </html>
  );
}
