import { Fragment } from "react";

// How status data reaches this site. HTML rather than SVG so the labels stay
// readable on a phone: the row stacks vertically below the sm breakpoint.
const nodes = [
  { title: "Home server", detail: "status-publisher reads uptime and container counts" },
  { title: "GitHub Gist", detail: "one public JSON file, six fields" },
  { title: "This site", detail: "reads the file, shows the last known values" },
];

const hops = ["HTTPS PATCH · every 15 min", "HTTPS GET · every 60 s"];

export function PushDiagram() {
  return (
    <figure className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {nodes.map((node, i) => (
          <Fragment key={node.title}>
            <div className="flex-1 rounded border border-border bg-bg-raised px-4 py-3">
              <p className="text-sm font-medium text-fg">{node.title}</p>
              <p className="text-xs text-fg-muted leading-relaxed mt-1">{node.detail}</p>
            </div>
            {i < hops.length && (
              <div className="flex sm:flex-col items-center justify-center gap-2 py-2 sm:py-0 sm:px-2 sm:max-w-28 text-xs font-mono text-fg-muted text-center">
                <span aria-hidden="true" className="text-accent sm:hidden">↓</span>
                <span aria-hidden="true" className="text-accent hidden sm:inline">→</span>
                <span>{hops[i]}</span>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <figcaption className="mt-3 text-sm text-fg-muted">
        Data flows one way: out of the home network, never in. Connections
        into the home network: <span className="text-fg font-mono">none</span>.
      </figcaption>
    </figure>
  );
}
