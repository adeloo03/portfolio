import type { Incident } from "@/content/types";

export function IncidentLog({ incidents }: { incidents: Incident[] }) {
  return (
    <section
      id="incidents"
      aria-labelledby="incidents-heading"
      className="mb-10 scroll-mt-20"
    >
      <h2 id="incidents-heading" className="text-h2 font-semibold text-fg mb-4">
        Incident log
      </h2>
      <ol className="flex flex-col gap-6">
        {incidents.map((incident) => (
          <li
            key={`${incident.date}-${incident.title}`}
            className="border-l-2 border-border pl-4"
          >
            <p className="text-sm font-mono text-fg-muted mb-1">
              <time dateTime={incident.date}>{incident.date}</time>
              {incident.approximate && " · date approximate"}
            </p>
            <h3 className="text-fg font-medium mb-2">{incident.title}</h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm leading-relaxed">
              <dt className="font-mono text-fg-muted">impact</dt>
              <dd className="text-fg-muted">{incident.impact}</dd>
              <dt className="font-mono text-fg-muted">cause</dt>
              <dd className="text-fg-muted">{incident.cause}</dd>
              <dt className="font-mono text-fg-muted">fix</dt>
              <dd className="text-fg-muted">{incident.fix}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
