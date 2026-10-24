import type { Project } from "./types";

// Order matches CLAUDE.md — do not reorder without discussion.
export const projects: Project[] = [
  {
    slug: "naturalis-insect-sounds",
    title: "Insect Sound Classification for Naturalis",
    tagline:
      "A classifier that listens to raw field recordings and identifies which insect is singing, so Naturalis can monitor biodiversity at a scale that manual listening never could.",
    stack: ["Python", "PyTorch", "Audio classification", "Scrum", "Documentation"],
    links: [],
    body: [
      {
        heading: "The project",
        paragraphs: [
          "Client: Naturalis Biodiversity Center. Leiden University, team of six, 2025.",
          "Naturalis records huge amounts of field audio, and their existing baseline model left room for improvement. Our team built a classifier for 459 species of grasshoppers, crickets and cicadas that outputs timestamped, confidence-scored predictions in JSON, ready to plug straight into Naturalis's ARISE platform.",
        ],
      },
      {
        heading: "How we built it",
        paragraphs: [
          "We built and compared two architectures on a learnable audio frontend (LEAF), which adapts to insect frequency ranges instead of relying on standard mel spectrograms: an EfficientNet CNN and a PaSST spectrogram transformer. They performed almost identically, which meant the CNN could match the transformer at a fraction of the compute cost.",
          "Because the dataset was heavily imbalanced (some species had more than 500 recordings, others fewer than 25), we evaluated on macro-averaged F1 instead of accuracy. Classifying at genus level (196 classes) instead of species level turned out to be far more reliable.",
        ],
      },
      {
        heading: "My role",
        paragraphs: [
          "I was the developer responsible for documentation and for keeping the project running smoothly. I kept the README, setup guide and usage instructions up to date after every pipeline change, wrote the architecture sections for both models in the final report, documented why we dropped an alternative model (animal2vec), and added docstrings across the preprocessing, data loading and inference code.",
          "On the code side I built the configuration file for our model hyperparameters and fixed a memory leak in the PyTorch training loop. We worked in Scrum with two-week sprints.",
          "The code is Naturalis's intellectual property, so it is not public.",
        ],
      },
    ],
  },
  {
    slug: "homelab",
    title: "Self-Hosted Homelab",
    tagline:
      "My own server at home, built from second-hand hardware, where I run and secure my own services and learn infrastructure by actually doing it.",
    stack: ["Linux", "Proxmox", "Docker", "Nginx", "Networking", "Security"],
    links: [],
    body: [
      {
        heading: "From an old laptop to a hypervisor",
        paragraphs: [
          "Personal project, 2024 to present.",
          "It started as Ubuntu Server on an old laptop. I later bought a second-hand Lenovo ThinkCentre M910q Tiny for 75 euros, fitted my own NVMe SSD, and turned it into a Proxmox VE hypervisor. An Ubuntu Server VM runs my Docker stack, with Nginx Proxy Manager in front and Portainer to manage the containers.",
        ],
      },
      {
        heading: "Set up and secured by me",
        paragraphs: [
          "I set up everything myself: SSH hardening, a UFW firewall, Fail2ban, a WireGuard VPN for remote access, and DNS and SSL for my own domain, abeldeloo.dev, through Cloudflare.",
          "This is where most of my Linux, networking and container knowledge comes from, and where I find out what actually breaks once something has to keep running without anyone watching it.",
        ],
      },
    ],
  },
  {
    slug: "status-publisher",
    title: "Status Publisher",
    tagline:
      "A C# service that tells this site whether the home server is up, without opening a single inbound port.",
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
          "The portfolio claims the home server keeps running. That claim is either backed by live data or it isn't. The obvious approach, an endpoint on the server that the site calls, requires a public IP, port-forwarding on the router, and a service on the home network reachable from the internet. That is a larger attack surface than the information is worth.",
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
          "No hostnames. No IP addresses. No container names. No file paths. No service versions. An attacker reading the snapshot learns that some number of containers are running on some machine somewhere. They learn nothing that helps them find or reach that machine. The sanitization is not cosmetic: it is the security model.",
        ],
      },
      {
        heading: "Docker access without the keys to the server",
        paragraphs: [
          "Counting containers needs the Docker API. The usual shortcut is mounting the Docker socket read-only. That :ro protects the socket file, not what you can do through it: any process holding the socket can start a privileged container, which is root on the host.",
          "So the publisher never sees the socket. It talks to a small proxy on an internal network with no route to the internet. The proxy allows exactly one request, GET /containers/json, and only from the publisher. I tested that list instead of trusting it: the container list returns 200; inspecting a container (which would expose other services' environment variables, and with them their passwords), reading logs, listing images and creating containers all return 403 or 405, and so does the allowed request from any other container.",
        ],
      },
      {
        heading: "Why push, not pull",
        paragraphs: [
          "The server already serves a few things to the internet through a reverse proxy with TLS, each one a deliberate choice, kept patched and behind authentication. A status endpoint would be one more of those, for data that does not need it.",
          "Push adds nothing to that surface. The publisher makes one outbound HTTPS call to a known host and accepts no connections at all.",
          "If the publisher crashes or the server goes offline, the portfolio displays the last known snapshot with a 'last updated' timestamp. A stale widget, not a broken one.",
        ],
      },
      {
        heading: "What I would do differently",
        paragraphs: [
          "The GitHub token has gist scope only, which limits blast radius if it leaks. What it does not do is alert me if it does leak. I would add token rotation on a schedule and a check that the published content has not been tampered with: a hash of the expected shape signed with a key that never leaves the server.",
        ],
      },
    ],
  },
  {
    slug: "messaging-app",
    title: "Messaging Web Application",
    tagline:
      "A messaging web app with a Python back end and a SQL database, and the project that made me fall for Python.",
    stack: ["Python", "SQL", "HTML"],
    links: [],
    body: [
      {
        heading: "The project",
        paragraphs: [
          "Leiden University, second-year project, 2024.",
          "This university project stuck with me more than any other. I built the back end in Python and connected it to a SQL database, with a small HTML front end on top.",
          "It was the first time I saw a full application come together from the data layer all the way to what the user sees, and it is the reason Python became my main language.",
        ],
      },
    ],
  },
];
