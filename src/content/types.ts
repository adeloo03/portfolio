export type Project = {
  slug: string;
  title: string;
  tagline: string;
  body: Section[];
  stack: string[];
  links: { label: string; href: string }[];
};

export type Section = {
  heading: string;
  paragraphs: string[];
};

export type TimelineEntry = {
  year: number;
  month?: number;
  title: string;
  description: string;
};

export type About = {
  name: string;
  role: string;
  university: string;
  graduating: string;
  availability: {
    label: string; // short, for badges: "Available now"
    sentence: string; // full sentence for body copy and metadata
  };
  bio: string[];
  stack: Record<string, string[]>;
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
};

// Contract defined in CLAUDE.md — do not change field names or types.
export type Status = {
  updatedAt: string;
  uptimeDays: number;
  servicesUp: number;
  servicesTotal: number;
  lastIncident: string | null;
  lastRestoreTest: string | null;
};
