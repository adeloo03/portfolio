import type { TimelineEntry } from "./types";

// Chronological, oldest first.
export const timeline: TimelineEntry[] = [
  {
    year: 2022,
    title: "Started Computer Science at Leiden University",
    description:
      "Bachelor's programme, focusing on software engineering and systems.",
  },
  {
    year: 2023,
    title: "Messaging web app — university project",
    description:
      "Built a web-based messaging platform in Python and SQL as a second-year group project. First time designing a relational schema for a real use case.",
  },
  {
    year: 2023,
    title: "Home server — first setup",
    description:
      "Repurposed an old Packard Bell laptop as a home server. Learned Docker, networking, and what happens when a service goes down at an inconvenient time.",
  },
  {
    year: 2024,
    title: "Minor: Technology-based Entrepreneurship at TU Delft",
    description:
      "Studied how technical decisions connect to business models. Built TerraceTime — a web app for real-time terrace availability — and deployed it on the home server.",
  },
  {
    year: 2024,
    title: "Smartphone lessons — volunteer work",
    description:
      "Teaching elderly residents how to use smartphones and tablets. Ongoing.",
  },
  {
    year: 2025,
    title: "Status publisher",
    description:
      "Built a C# service that pushes a sanitized snapshot of the home server to this portfolio every 15 minutes. No open ports into the home network.",
  },
  {
    year: 2026,
    month: 9,
    title: "Graduation internship",
    description: "Available from September 2026 for a six-month internship.",
  },
];
