import type { TimelineEntry } from "./types";

// Chronological, oldest first. Dates follow the CV.
export const timeline: TimelineEntry[] = [
  {
    year: 2022,
    title: "Smartphone lessons for older adults",
    description:
      "Taught older adults how to use their phones. Explaining technology to someone who has never used a touchscreen is an exercise in clarity.",
  },
  {
    year: 2023,
    title: "Started Computer Science at Leiden University",
    description: "Bachelor's programme. Expected graduation 2027.",
  },
  {
    year: 2024,
    title: "Home server, first setup",
    description:
      "Repurposed an old Packard Bell laptop as a home server. Learned Docker, networking, and what happens when a service goes down at an inconvenient time.",
  },
  {
    year: 2024,
    title: "Messaging web app, university project",
    description:
      "Built a web-based messaging platform in Python and SQL as a second-year group project.",
  },
  {
    year: 2025,
    title: "Insect sound classifier for Naturalis",
    description:
      "Team of six, external client: a model that identifies 459 insect species from raw field recordings, delivered as JSON their platform reads directly.",
  },
  {
    year: 2025,
    title: "Minor: Technology-based Entrepreneurship at TU Delft",
    description:
      "Completed with an average grade of 8. Built TerraceTime, a real-time seat availability app, validated through 26 interviews and user tests.",
  },
  {
    year: 2025,
    title: "Tutoring mathematics and physics",
    description: "Secondary school students, 2025–2026.",
  },
  {
    year: 2026,
    title: "Home lab rebuilt on Proxmox",
    description:
      "Moved from the laptop to a mini PC running Proxmox: one Compose stack per concern in git, nightly snapshot backups with Proxmox Backup Server, Prometheus and Grafana for monitoring.",
  },
  {
    year: 2026,
    title: "Status publisher",
    description:
      "A C# service that pushes a sanitized snapshot of the home server to this portfolio every 15 minutes. It accepts no connections, and its Docker access is limited to one read-only API call.",
  },
  {
    year: 2026,
    title: "Graduation internship",
    description:
      "Available for six months from February 2027. MSc Data Science and AI Technology from September 2027.",
  },
];
