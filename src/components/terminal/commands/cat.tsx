import type { Command } from "./types";
import { resolvePath } from "@/lib/fs";
import { projects } from "@/content/projects";
import { about } from "@/content/about";

function resolve(cwd: string, arg: string): string {
  if (arg.startsWith("/")) return arg;
  return cwd === "/" ? "/" + arg : cwd + "/" + arg;
}

export const catCommand: Command = {
  name: "cat",
  description: "Print file contents",
  usage: "cat <path>",
  run(args, ctx) {
    if (!args[0]) {
      return {
        output: <p className="text-fg-muted">Usage: cat {"<path>"}</p>,
      };
    }

    const path = resolve(ctx.cwd, args[0]);
    const node = resolvePath(path);

    if (!node) {
      return {
        output: <p className="text-red-400">cat: {args[0]}: no such file</p>,
      };
    }

    if (node.kind === "dir") {
      return {
        output: (
          <p className="text-red-400">cat: {args[0]}: is a directory</p>
        ),
      };
    }

    if (path === "/cv.pdf") {
      return {
        output: (
          <div className="py-1 space-y-1">
            <p className="text-fg-muted">[binary file]</p>
            <a href="/cv.pdf" className="text-accent hover:underline">
              → Download: /cv.pdf
            </a>
          </div>
        ),
      };
    }

    if (path === "/about.md") {
      return {
        output: (
          <div className="py-1 space-y-1">
            <p className="text-fg font-medium">{about.name}</p>
            <p className="text-fg-muted">
              {about.role} · {about.university}
            </p>
            {about.bio.map((p, i) => (
              <p key={i} className="text-fg-muted">
                {p}
              </p>
            ))}
            <a
              href={`mailto:${about.contact.email}`}
              className="text-accent hover:underline block pt-1"
            >
              {about.contact.email}
            </a>
            <a
              href={about.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline block"
            >
              {about.contact.github.replace("https://", "")}
            </a>
          </div>
        ),
      };
    }

    const projectMatch = path.match(/^\/projects\/([^/]+)\.md$/);
    if (projectMatch) {
      const slug = projectMatch[1];
      const project = projects.find((p) => p.slug === slug);
      if (project) {
        return {
          output: (
            <div className="py-1 space-y-1">
              <p className="text-fg font-medium">{project.title}</p>
              <p className="text-fg-muted">{project.tagline}</p>
              {project.stack.length > 0 && (
                <p className="text-fg-muted">
                  Stack:{" "}
                  <span className="text-fg">{project.stack.join(", ")}</span>
                </p>
              )}
              <a
                href={`/work/${slug}`}
                className="text-accent hover:underline block pt-1"
              >
                → Case study: /work/{slug}
              </a>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline block"
                >
                  → {link.label}
                </a>
              ))}
            </div>
          ),
        };
      }
    }

    return {
      output: (
        <pre className="text-fg-muted whitespace-pre-wrap text-xs leading-relaxed">
          {node.content}
        </pre>
      ),
    };
  },
};
