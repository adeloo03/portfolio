import type { Metadata } from "next";
import { about } from "@/content/about";
import { timeline } from "@/content/timeline";

export const metadata: Metadata = {
  title: "About",
  description: `Third-year Computer Science student at Leiden University. ${about.availability.sentence}`,
  openGraph: {
    title: "About — Abel Deloo",
    description: `CS at Leiden. Self-hosted homelab. ${about.availability.sentence}`,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-h1 font-semibold tracking-tight text-fg mb-3">
          About
        </h1>
        <p className="text-sm font-mono text-accent">
          {about.availability.label} · Leiden
        </p>
      </header>

      {/* Bio */}
      <section aria-labelledby="bio-heading" className="mb-16 max-w-[70ch]">
        <h2 id="bio-heading" className="text-h2 font-semibold text-fg mb-6">
          Background
        </h2>
        <div className="flex flex-col gap-4">
          {about.bio.map((paragraph, i) => (
            <p key={i} className="text-fg-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline-heading" className="mb-16">
        <h2
          id="timeline-heading"
          className="text-h2 font-semibold text-fg mb-8"
        >
          Timeline
        </h2>
        <ol className="relative flex flex-col gap-0">
          {timeline.map((entry, i) => (
            <li key={i} className="flex gap-6 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-border mt-1.5 shrink-0" />
                {i < timeline.length - 1 && (
                  <span className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="pb-0 min-w-0">
                <p className="text-xs font-mono text-fg-muted mb-1">
                  {entry.year}
                  {entry.month
                    ? ` · ${new Date(entry.year, entry.month - 1).toLocaleString("en", { month: "long" })}`
                    : ""}
                </p>
                <p className="text-sm font-medium text-fg mb-1">
                  {entry.title}
                </p>
                <p className="text-sm text-fg-muted leading-relaxed">
                  {entry.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Stack */}
      <section aria-labelledby="stack-heading" className="mb-16">
        <h2
          id="stack-heading"
          className="text-h2 font-semibold text-fg mb-8"
        >
          Stack
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Object.entries(about.stack).map(([category, items]) => (
            <div key={category}>
              <dt className="text-xs font-mono text-fg-muted uppercase tracking-widest mb-3">
                {category}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="px-2.5 py-1 rounded border border-border text-xs font-mono text-fg-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact-heading">
        <h2
          id="contact-heading"
          className="text-h2 font-semibold text-fg mb-4"
        >
          Contact
        </h2>
        <p className="text-sm text-fg-muted mb-6 max-w-[70ch]">
          {about.availability.sentence} Based in Leiden.
        </p>
        <ul className="flex flex-col gap-2">
          <li>
            <a
              href={`mailto:${about.contact.email}`}
              className="font-mono text-sm text-accent hover:text-accent-hov transition-colors"
            >
              {about.contact.email}
            </a>
          </li>
          <li>
            <a
              href={about.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-fg-muted hover:text-fg transition-colors"
            >
              {about.contact.github.replace("https://", "")}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
