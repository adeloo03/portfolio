import type { Command } from "./types";

// Rendered inside the terminal output — receives the live registry so help
// always reflects whatever commands are registered at call time.
export function HelpOutput({ commands }: { commands: Command[] }) {
  return (
    <div className="py-1">
      <p className="text-fg-muted mb-2">Available commands:</p>
      <dl>
        {commands.map((cmd) => (
          <div key={cmd.name} className="flex gap-4 leading-relaxed">
            <dt className="text-accent shrink-0 w-28">
              {cmd.name}
              {cmd.aliases?.length ? (
                <span className="text-fg-muted"> ({cmd.aliases.join(", ")})</span>
              ) : null}
            </dt>
            <dd className="text-fg-muted">{cmd.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
