import type { Project } from "./types";

// Order matches CLAUDE.md — do not reorder without discussion.
export const projects: Project[] = [
  {
    slug: "homelab",
    title: "Home Lab",
    tagline:
      "A 2013 Packard Bell laptop, repurposed into a server running four services for real daily use.",
    stack: ["Docker", "Linux", "Pi-hole", "WireGuard", "Glances"],
    links: [],
    body: [
      {
        heading: "What runs and why",
        paragraphs: [
          "The hardware was not chosen — it was available: AMD E1-2500, 4 GB RAM, 320 GB HDD. That constraint shaped every decision.",
          "Pi-hole acts as the network-wide DNS resolver. The router points to it, so every device on the network benefits. Ad and tracking requests are dropped before they leave the house.",
          "WireGuard runs as a VPN back into the home network, on host networking so it has direct access to the router. Used from outside when I need to reach local services.",
          "Glances gives me system monitoring from any terminal. No web dashboard, no persistent login — one command and I see what the machine is doing.",
          "TerraceTime, a web app built during my entrepreneurship minor at TU Delft, is deployed here rather than left running on a dev machine.",
          "All containers use --restart unless-stopped. After a power cut, the machine boots and Docker restores them without intervention.",
        ],
      },
      {
        heading: "What broke and what I did about it",
        paragraphs: [
          "The server started on WiFi. Services dropped unpredictably, and the physical position of the machine in the house made it worse. I spent time adjusting Docker configuration before accepting that no software fix closes an unreliable radio link. I ran an Ethernet cable. The problem stopped.",
          "Some failures are not debugging problems.",
        ],
      },
      {
        heading: "What I would do differently",
        paragraphs: [
          "I start containers with docker run commands, which works until the disk dies and I am rebuilding from memory. The correct approach is Docker Compose files in a private repository — reproducible, version-controlled, recoverable.",
          "I would also run automated backups of Pi-hole's configuration and the WireGuard keys, and periodically test that they actually restore. A backup no one has tested is not a backup.",
        ],
      },
    ],
  },
  {
    slug: "status-publisher",
    title: "Status Publisher",
    tagline:
      "A C# service that tells this site whether the home server is up — without opening a single inbound port.",
    stack: ["C#", ".NET 9", "Docker", "GitHub Gist API"],
    links: [
      {
        label: "Source code",
        href: "https://github.com/abeldl/portfolio/tree/main/status-publisher",
      },
    ],
    body: [
      {
        heading: "The problem",
        paragraphs: [
          "The portfolio claims the home server keeps running. That claim is either backed by live data or it isn't. The obvious approach — an endpoint on the server that the site calls — requires a public IP, port-forwarding on the router, and a service on the home network reachable from the internet. That is a larger attack surface than the information is worth.",
        ],
      },
      {
        heading: "The design",
        paragraphs: [
          "The publisher runs as a Docker container on the server. Every 15 minutes it reads two things locally: host uptime from /proc/uptime and container counts from the Docker socket. It then makes one outbound HTTPS call to the GitHub Gist API and overwrites a single JSON file.",
          "The portfolio fetches that file. The connection goes in one direction only: server → GitHub → site. The home network never receives an inbound connection from anything.",
        ],
      },
      {
        heading: "What is deliberately not published",
        paragraphs: [
          "The JSON contains six fields: a timestamp, uptime in days, how many containers are running, how many exist in total, and two optional incident dates. That is all.",
          "No hostnames. No IP addresses. No container names. No file paths. No service versions. An attacker reading the snapshot learns that some number of containers are running on some machine somewhere. They learn nothing that helps them find or reach that machine. The sanitization is not cosmetic — it is the security model.",
        ],
      },
      {
        heading: "Why push, not pull",
        paragraphs: [
          "A pull-based design requires the server to accept inbound connections. That means a public IP or dynamic DNS pointing at the home router, a port-forwarding rule exposing a service to the internet, and that service kept patched and authenticated indefinitely. Each of those is a failure mode.",
          "Push removes the exposure entirely. The server initiates outbound HTTPS to a known host (GitHub). Outbound HTTPS on port 443 is traffic the router already allows for software updates and everything else. No new rules, no new exposure.",
          "If the publisher crashes or the server goes offline, the portfolio displays the last known snapshot with a 'last updated' timestamp. A stale widget, not a broken one — and not an open socket.",
        ],
      },
      {
        heading: "What I would do differently",
        paragraphs: [
          "The GitHub token has gist scope only, which limits blast radius if it leaks. What it does not do is alert me if it does leak. I would add token rotation on a schedule and a check that the published content has not been tampered with — a hash of the expected shape signed with a key that never leaves the server.",
        ],
      },
    ],
  },
  {
    slug: "messaging-app",
    title: "Messaging Web App",
    tagline:
      "A second-year university project: a web-based messaging platform built in Python and SQL from scratch.",
    stack: ["Python", "SQL", "HTML", "CSS"],
    links: [],
    body: [
      {
        heading: "What it was",
        paragraphs: [
          "A group project at Leiden University. The assignment was to design and build a working messaging application — database schema, backend, and a functional front end. We used Python for the server and raw SQL for every query; no ORM.",
          "Users could register, log in, send messages to each other, and see their conversation history. The data model had to handle users, conversations, and messages with correct ordering and ownership.",
        ],
      },
      {
        heading: "What I learned",
        paragraphs: [
          "Writing SQL by hand forces you to think about what the database is actually doing. A query that looks simple in an ORM can turn into a full table scan; writing it yourself makes that visible.",
          "The bigger lesson was about scope. We spent the first half of the project arguing about features and the second half cutting them to get anything working on time. Every project since, I scope down first.",
        ],
      },
      {
        heading: "Honest retrospective",
        paragraphs: [
          "This was coursework. It ran locally, had no authentication worth the name, and was never deployed anywhere a real user would reach it. I am listing it because the SQL and data modelling work was real, not because the product was.",
          "If I built it today I would write integration tests against an actual database from the start, not mocks. The mocked tests passed. A real database would have caught the schema assumptions we got wrong.",
        ],
      },
    ],
  },
];
