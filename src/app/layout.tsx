import type { Metadata } from "next";
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
  title: "Aaron Shier — Resume",
  description: "Resume of Aaron Shier",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
