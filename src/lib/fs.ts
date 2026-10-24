import { projects } from "@/content/projects";
import { about } from "@/content/about";
import { incidents } from "@/content/incidents";

export type FsNode =
  | { kind: "dir"; name: string; children: FsNode[] }
  | { kind: "file"; name: string; content: string };

function projectToMarkdown(slug: string): string {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return "";

  const sections = project.body
    .map(
      (s) =>
        `## ${s.heading}\n\n${s.paragraphs.join("\n\n")}`
    )
    .join("\n\n");

  return `# ${project.title}\n\n${project.tagline}\n\n${sections}`;
}

function aboutToMarkdown(): string {
  return [
    `# ${about.name}`,
    `${about.role} — ${about.university}`,
    "",
    ...about.bio,
    "",
    `Email: ${about.contact.email}`,
    `GitHub: ${about.contact.github}`,
  ].join("\n");
}

export function incidentsToLog(): string {
  return incidents
    .map((i) =>
      [
        `${i.date}${i.approximate ? " (approx.)" : ""}  ${i.title}`,
        `  impact  ${i.impact}`,
        `  cause   ${i.cause}`,
        `  fix     ${i.fix}`,
      ].join("\n")
    )
    .join("\n\n");
}

// Virtual filesystem derived from content. Never maintained separately.
export const virtualFs: FsNode = {
  kind: "dir",
  name: "/",
  children: [
    {
      kind: "dir",
      name: "projects",
      children: projects.map((p) => ({
        kind: "file" as const,
        name: `${p.slug}.md`,
        content: projectToMarkdown(p.slug),
      })),
    },
    {
      kind: "file",
      name: "about.md",
      content: aboutToMarkdown(),
    },
    {
      kind: "file",
      name: about.cv.replace(/^\//, ""),
      content: "[binary]",
    },
    {
      kind: "dir",
      name: "var",
      children: [
        {
          kind: "dir",
          name: "log",
          children: [
            { kind: "file", name: "incidents.log", content: incidentsToLog() },
          ],
        },
      ],
    },
  ],
};

export function resolvePath(path: string): FsNode | null {
  const parts = path.replace(/^\//, "").split("/").filter(Boolean);
  let node: FsNode = virtualFs;

  for (const part of parts) {
    if (node.kind !== "dir") return null;
    const child = node.children.find((c) => c.name === part);
    if (!child) return null;
    node = child;
  }

  return node;
}

export function listDir(path: string): FsNode[] | null {
  const node = resolvePath(path || "/");
  if (!node || node.kind !== "dir") return null;
  return node.children;
}
