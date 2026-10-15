import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/content/projects";
import { incidents } from "@/content/incidents";
import { IncidentLog } from "@/components/ui/IncidentLog";
import { PushDiagram } from "@/components/ui/PushDiagram";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-10">
        <ol className="flex items-center gap-2 text-sm font-mono text-fg-muted">
          <li>
            <Link href="/#work" className="hover:text-fg transition-colors">
              Work
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-fg">{project.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-h1 font-semibold tracking-tight text-fg mb-3">
          {project.title}
        </h1>
        <p className="text-lg text-fg-muted leading-relaxed max-w-[70ch]">
          {project.tagline}
        </p>
      </header>

      {/* Body */}
      <article className="max-w-[70ch]">
        {slug === "status-publisher" && <PushDiagram />}
        {project.body.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-h2 font-semibold text-fg mb-4">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="text-fg-muted leading-relaxed mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </section>
        ))}
        {slug === "homelab" && incidents.length > 0 && (
          <IncidentLog incidents={incidents} />
        )}
      </article>

      {/* Stack */}
      {project.stack.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs font-mono text-fg-muted uppercase tracking-widest mb-3">
            Stack
          </p>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li
                key={item}
                className="px-2.5 py-1 rounded border border-border text-xs font-mono text-fg-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Links */}
      {project.links.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-mono text-fg-muted uppercase tracking-widest mb-3">
            Links
          </p>
          <ul className="flex flex-col gap-2">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-accent hover:text-accent-hov transition-colors"
                >
                  {link.label}
                  <span aria-hidden="true"> →</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <nav
        aria-label="Case study navigation"
        className="mt-16 pt-8 border-t border-border flex items-center justify-between text-sm font-mono"
      >
        <Link
          href="/#work"
          className="text-fg-muted hover:text-fg transition-colors"
        >
          <span aria-hidden="true">← </span>All work
        </Link>
        {(() => {
          const idx = projects.findIndex((p) => p.slug === slug);
          const next = projects[idx + 1];
          return next ? (
            <Link
              href={`/work/${next.slug}`}
              className="text-fg-muted hover:text-fg transition-colors"
            >
              {next.title}<span aria-hidden="true"> →</span>
            </Link>
          ) : null;
        })()}
      </nav>
    </div>
  );
}
