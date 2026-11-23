import type { PlannedEvent } from "./types";

export const DEFAULT_EVENT_TEMPLATES: Omit<PlannedEvent, "enabled">[] = [
  { key: "haldi", title: "Haldi" },
  { key: "mehendi", title: "Mehendi" },
  { key: "sangeet", title: "Sangeet" },
  { key: "wedding", title: "Wedding" },
  { key: "reception", title: "Reception" },
];

export function defaultPlannedEvents(): PlannedEvent[] {
  return DEFAULT_EVENT_TEMPLATES.map((event) => ({
    ...event,
    enabled: event.key === "wedding",
  }));
}

export function mapsSearchUrl(venue?: string | null, address?: string | null): string | null {
  const q = [venue, address].filter(Boolean).join(", ");
  if (!q) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function enabledEvents(events: PlannedEvent[]): PlannedEvent[] {
  return events.filter((event) => event.enabled && event.title.trim());
}
