import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE = "https://abeldeloo.nl";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: { default: "Abel Deloo", template: "%s · Abel Deloo" },
  description:
    "Third-year Computer Science student at Leiden University. Available for a six-month graduation internship from September 2026.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: BASE,
    siteName: "Abel Deloo",
    title: "Abel Deloo — I build things that keep running.",
    description:
      "CS student at Leiden University. Self-hosted homelab, real uptime numbers. Available September 2026.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: BASE },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abel Deloo",
  url: BASE,
  email: "abel.deloo@gmail.com",
  jobTitle: "Computer Science Student",
  worksFor: { "@type": "Organization", name: "Leiden University" },
  sameAs: ["https://github.com/abeldl", "https://linkedin.com/in/abel-deloo"],
  description:
    "Third-year Computer Science student at Leiden University. Available for a six-month graduation internship from September 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-bg text-fg font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Skip link — first tab stop for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:bg-bg focus-visible:text-fg focus-visible:px-4 focus-visible:py-2 focus-visible:rounded focus-visible:border focus-visible:border-border"
        >
          Skip to main content
        </a>

        <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-mono text-sm font-medium text-fg hover:text-accent transition-colors"
            >
              abel deloo
            </Link>
            <nav aria-label="Main navigation" className="flex items-center gap-6">
              <ul className="flex items-center gap-6 text-sm text-fg-muted">
                <li>
                  <Link href="/#work" className="hover:text-fg transition-colors">
                    Work
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-fg transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-fg transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="font-mono hover:text-accent transition-colors"
                    aria-label="Switch to terminal view"
                  >
                    &gt;_
                  </Link>
                </li>
              </ul>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
            <span className="text-xs text-fg-muted font-mono">
              Abel Deloo · Leiden, NL
            </span>
            <ul className="flex items-center gap-4">
              <li>
                <a
                  href="https://github.com/abeldl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-fg-muted hover:text-fg transition-colors"
                >
                  GitHub<span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/abel-deloo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-fg-muted hover:text-fg transition-colors"
                >
                  LinkedIn<span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:abel.deloo@gmail.com"
                  className="text-xs text-fg-muted hover:text-fg transition-colors"
                >
                  Mail
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  );
}
