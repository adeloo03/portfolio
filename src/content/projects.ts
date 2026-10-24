import type { Project } from "./types";

// Order matches CLAUDE.md — do not reorder without discussion.
export const projects: Project[] = [
  {
    slug: "naturalis-insect-sounds",
    title: "Insect Sound Classifier",
    tagline:
      "A model that identifies 459 insect species from raw field recordings, built for Naturalis Biodiversity Center to plug straight into their monitoring platform.",
    stack: ["Python", "EfficientNet", "PaSST", "Audio ML", "Scrum"],
    links: [],
    body: [
      {
        heading: "The problem",
        paragraphs: [
          "Naturalis monitors biodiversity with microphones in the field. That produces far more audio than anyone can listen to. They needed a model that hears an insect and says which species it is, in a form their ARISE platform can take in without someone converting it by hand.",
          "A university project for an external client, 2025, in a team of six, working in two-week Scrum sprints.",
        ],
      },
      {
        heading: "Two models, and choosing the cheaper one",
        paragraphs: [
          "We built the classifier on a learnable audio frontend and compared two architectures on it: a CNN (EfficientNet) and a spectrogram transformer (PaSST).",
          "Their results were nearly identical. The CNN needed a fraction of the compute. For a model that has to run over large volumes of field audio, that settles it: the cheaper model is the better one when it is not worse.",
        ],
      },
      {
        heading: "Measuring it honestly",
        paragraphs: [
          "The data was heavily imbalanced: a few common species and a long tail of rare ones. Plain accuracy rewards a model for getting the common species right and ignoring the rest, so we evaluated with macro-averaged F1, where every species counts equally.",
          "Classifying at genus level (196 classes) instead of species level (459) gave up some resolution for markedly better reliability.",
        ],
      },
      {
        heading: "Delivered to be used",
        paragraphs: [
          "The output is timestamped, confidence-scored JSON that the ARISE platform reads directly. A model that scores well in a notebook is not the deliverable; one that slots into the pipeline someone else runs is.",
        ],
      },
    ],
  },
  {
    slug: "homelab",
    title: "Home Lab",
    tagline:
      "A Proxmox host running over a dozen self-hosted services: configuration in git, nightly snapshot backups, monitoring on everything.",
    stack: [
      "Proxmox VE",
      "Proxmox Backup Server",
      "Docker Compose",
      "Prometheus",
      "Grafana",
      "WireGuard",
    ],
    links: [
      {
        label: "Restore runbook",
        href: "https://github.com/adeloo03/portfolio/blob/main/homelab/RUNBOOK.md",
      },
    ],
    body: [
      {
        heading: "Where it started",
        paragraphs: [
          "A 2013 Packard Bell laptop with an AMD E1-2500 and 4 GB of RAM, running four containers started with docker run. It worked, and it taught me what happens when a service goes down at an inconvenient time — see the incident log below.",
          "It also had a problem I could not see while it was running: everything lived in my head. Had the disk died, I would have been rebuilding from memory.",
        ],
      },
      {
        heading: "What it is now",
        paragraphs: [
          "A mini PC running Proxmox VE. One VM runs every container; Jellyfin runs separately in an LXC container with hardware transcoding.",
          "The containers are grouped into one Docker Compose stack per concern: reverse proxy, VPN, monitoring, a shared platform layer (Postgres, notifications, uptime checks) and the services themselves — Nextcloud, Vaultwarden, Gitea. All of it is in a git repository on that same Gitea. Secrets live in .env files that git ignores.",
          "Monitoring is Prometheus with node-exporter and cAdvisor, dashboards in Grafana, and Uptime Kuma for whether each service actually answers.",
        ],
      },
      {
        heading: "Backups",
        paragraphs: [
          "Proxmox Backup Server runs as its own VM with a dedicated SSD. Every night it takes a snapshot of the Docker VM. Retention keeps the last 3, then 7 daily, 4 weekly and 3 monthly; pruning and garbage collection run on a schedule. How to rebuild the backup server itself is written down.",
        ],
      },
      {
        heading: "What is not done yet",
        paragraphs: [
          "No restore has been tested. Until one has, the backups are a hypothesis. The procedure is written: restore the newest snapshot as a new VM with its network link cut — it is a byte-for-byte copy, and on the LAN it would clash with the real machine — check every container and database from the console, then destroy it. The date of the last successful test is shown in the status bar on this site.",
          "The backups sit on the same physical machine as what they protect. A separate SSD survives a broken VM, not a broken or stolen mini PC. An off-site copy is the next step.",
          "About ten containers run on :latest image tags. That makes every restart a possible upgrade nobody chose. Pinning versions and updating deliberately is on the list.",
        ],
      },
    ],
  },
  {
    slug: "status-publisher",
    title: "Status Publisher",
    tagline:
      "A C# service that tells this site whether the home server is up — without opening a single inbound port.",
    stack: ["C#", ".NET 9", "Docker", "socket-proxy", "GitHub Gist API"],
    links: [
      {
        label: "Source code",
        href: "https://github.com/adeloo03/portfolio/tree/main/status-publisher",
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
          "The publisher runs as a Docker container on the server. Every 15 minutes it reads two things locally: uptime from /proc/uptime and container counts from Docker. It then makes one outbound HTTPS call to the GitHub Gist API and overwrites a single JSON file.",
          "The portfolio fetches that file. The data goes in one direction only: server → GitHub → site. The publisher never accepts a connection; it only makes them.",
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
        heading: "Docker access without the keys to the server",
        paragraphs: [
          "Counting containers needs the Docker API. The usual shortcut is mounting the Docker socket read-only. That :ro protects the socket file, not what you can do through it: any process holding the socket can start a privileged container, which is root on the host.",
          "So the publisher never sees the socket. It talks to a small proxy on an internal network with no route to the internet. The proxy allows exactly one request — GET /containers/json — and only from the publisher. I tested that list instead of trusting it: the container list returns 200; inspecting a container (which would expose other services' environment variables, and with them their passwords), reading logs, listing images and creating containers all return 403 or 405, and so does the allowed request from any other container.",
        ],
      },
      {
        heading: "Why push, not pull",
        paragraphs: [
          "The server already serves a few things to the internet through a reverse proxy with TLS — each one a deliberate choice, kept patched and behind authentication. A status endpoint would be one more of those, for data that does not need it.",
          "Push adds nothing to that surface. The publisher makes one outbound HTTPS call to a known host and accepts no connections at all.",
          "If the publisher crashes or the server goes offline, the portfolio displays the last known snapshot with a 'last updated' timestamp. A stale widget, not a broken one.",
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
