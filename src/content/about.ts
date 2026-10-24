import type { About } from "./types";

export const about: About = {
  name: "Abel Deloo",
  role: "Third-year Computer Science student",
  university: "Leiden University",
  graduating: "2027",
  availability: {
    label: "Available now",
    sentence: "Available now for a six-month graduation internship.",
  },
  bio: [
    "I am looking for a six-month graduation internship, starting as soon as possible, at a company where the software has to keep working.",
    "My background is unusual for a student: I run a Proxmox home server with over a dozen self-hosted services that my household and I rely on, and I fix them when they break. That is where most of what I know about operating software actually comes from.",
    "Before university I worked two years in hospitality — long shifts, high pressure, no room for mistakes that affect other people. I carry that into how I approach any system that has users.",
    "I also volunteer teaching smartphone skills to elderly people in my area. Explaining technology to someone who has never used a touchscreen teaches you more about clarity than any course.",
    "At TU Delft I completed a minor in Technology-based Entrepreneurship. I understand how a business model connects to a technical decision, which changes which problems I think are worth solving.",
  ],
  stack: {
    Languages: ["TypeScript", "C#", "Python", "SQL"],
    Infrastructure: ["Proxmox", "Docker", "Linux", "WireGuard"],
    Web: ["Next.js", "React", "Tailwind CSS"],
    Tools: [".NET", "Git", "Prometheus", "Grafana"],
  },
  contact: {
    email: "abel.deloo@gmail.com",
    github: "https://github.com/adeloo03",
    linkedin: "https://linkedin.com/in/abel-deloo",
  },
};
