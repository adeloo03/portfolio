import Link from "next/link";
import { Suspense } from "react";
import { projects } from "@/content/projects";
import { about } from "@/content/about";
import { StatusStrip, StatusStripSkeleton } from "@/components/ui/StatusStrip";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <p className="text-sm font-mono text-accent mb-4">
          Available · September 2026 · Leiden
        </p>
        <h1 className="text-h1 font-semibold tracking-tight text-fg leading-tight mb-4">
          I build things that keep running.
        </h1>
        <p className="text-lg text-fg-muted leading-relaxed max-w-xl mb-8">
          Third-year Computer Science student at Leiden University, looking for
          a six-month graduation internship at a company where the software has
          to keep working.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#work"
            className="inline-flex items-center px-5 py-2.5 rounded bg-accent text-n-950 text-sm font-medium hover:bg-accent-hov transition-colors"
          >
            View work
          </a>
          <a
            href="/cv.pdf"
            className="inline-flex items-center px-5 py-2.5 rounded border border-border text-fg text-sm font-medium hover:border-fg-muted transition-colors"
          >
            Download CV
            <span className="sr-only"> (PDF)</span>
          </a>
        </div>
      </section>

      {/* ── Live status ──────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 pb-16">
        <Suspense fallback={<StatusStripSkeleton />}>
          <StatusStrip />
        </Suspense>
      </div>

      {/* ── Work ─────────────────────────────────────────────── */}
      <section id="work" className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="text-h2 font-semibold text-fg mb-8">Work</h2>
        <ol className="flex flex-col gap-px border border-border rounded overflow-hidden">
          {projects.map((project, i) => (
            <li key={project.slug} className="bg-bg-raised">
              <Link
                href={`/work/${project.slug}`}
                className="group flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 px-5 py-5 hover:bg-border/30 transition-colors"
              >
                <span className="shrink-0 w-5 text-sm font-mono text-fg-muted pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors mb-1">
                    {project.title}
                  </p>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {project.tagline}
                  </p>
                </div>
                <span className="shrink-0 text-fg-muted text-sm hidden sm:block mt-0.5">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section id="contact" className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="text-h2 font-semibold text-fg mb-2">Contact</h2>
          <p className="text-fg-muted text-sm mb-8 max-w-md">
            Available for a six-month graduation internship from September 2026.
            Based in Leiden — open to on-site, hybrid, or remote at Dutch
            companies.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${about.contact.email}`}
              className="inline-flex items-center gap-2 text-fg font-mono text-sm hover:text-accent transition-colors"
            >
              <span aria-hidden="true">→</span>
              {about.contact.email}
            </a>
            <a
              href={about.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-fg-muted font-mono text-sm hover:text-fg transition-colors"
            >
              <span aria-hidden="true">→</span>
              {about.contact.github.replace("https://", "")}
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
