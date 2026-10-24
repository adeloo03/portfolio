import type { About } from "./types";

export const about: About = {
  name: "Abel Deloo",
  role: "Fourth-year Computer Science student",
  university: "Leiden University",
  graduating: "2027",
  cv: "/Abel_Deloo_CV.pdf",
  availability: {
    label: "Available Q4 2026 or Q1 2027",
    sentence:
      "Available for a six-month graduation internship, start date flexible: Q4 2026 or Q1 2027.",
  },
  bio: [
    "I am looking for a six-month graduation internship at a company where the software has to keep working. Start date is flexible: Q4 2026 or Q1 2027. In September 2027 I start the MSc Data Science and Artificial Intelligence Technology.",
    "Most recently I worked in a team of six on a model for Naturalis Biodiversity Center that identifies insect species from raw field recordings, delivered in a format their platform reads directly.",
    "My background is unusual for a student: I run a Proxmox home server with over a dozen self-hosted services that my household and I rely on, and I fix them when they break. That is where most of what I know about operating software actually comes from.",
    "At TU Delft I completed a minor in Technology-based Entrepreneurship with an average grade of 8. Our team built TerraceTime, a real-time seat availability app, and validated it through 26 interviews and user tests. The lesson I kept: find out what people need before building it.",
    "I worked two years in hospitality, at Van der Valk among others — long shifts, high pressure, no room for mistakes that affect other people. I carry that into how I approach any system that has users.",
    "I have tutored secondary school students in mathematics and physics, and taught older adults how to use their smartphones. Explaining technology to someone who has never used a touchscreen teaches you more about clarity than any course.",
  ],
  stack: {
    Languages: ["Python", "C#", "C++", "TypeScript", "SQL"],
    "Machine learning": ["Audio classification", "CNNs", "Transformers"],
    Infrastructure: ["Proxmox", "Docker", "Linux", "Nginx", "WireGuard"],
    Tools: [".NET", "PostgreSQL", "Git", "Prometheus", "Grafana", "Scrum"],
  },
  contact: {
    email: "abel.deloo@gmail.com",
    github: "https://github.com/adeloo03",
    linkedin: "https://linkedin.com/in/abel-deloo",
  },
};
