// "3 min ago" / "5h ago" — for timestamps that should be minutes old.
export function formatAge(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)} days ago`;
}

// "today" / "1 day ago" / "12 days ago" — for ISO dates (YYYY-MM-DD).
export function formatDaysAgo(isoDate: string): string {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
  if (Number.isNaN(days)) return isoDate;
  if (days <= 0) return "today";
  return days === 1 ? "1 day ago" : `${days} days ago`;
}
