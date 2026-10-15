import type { Command } from "./types";
import { projects } from "@/content/projects";
import { about } from "@/content/about";

const aliases: Record<string, string> = {
  about: "/about",
  contact: "/#contact",
  cv: "/cv.pdf",
  github: about.contact.github,
};

export const openCommand: Command = {
  name: "open",
  description: "Open a project or page",
  usage: "open <project|about|contact|cv|github>",
  run(args, ctx) {
    const target = args[0];

    if (!target) {
      return {
        output: (
          <p className="text-fg-muted">
            Usage: open{" "}
            {"<project|about|contact|cv|github>"}
          </p>
        ),
      };
    }

    const project = projects.find((p) => p.slug === target);
    if (project) {
      ctx.navigate(`/work/${target}`);
      return {
        output: (
          <p className="text-fg-muted">Opening {project.title}…</p>
        ),
      };
    }

    const href = aliases[target];
    if (href) {
      ctx.navigate(href);
      return {};
    }

    return {
      output: (
        <p className="text-red-400">
          open: {target}: not found. Try a project slug or: about, contact,
          cv, github.
        </p>
      ),
    };
  },
};
