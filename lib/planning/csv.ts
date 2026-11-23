import type { GuestSide, RsvpStatus, WeddingEventRow } from "./types";

export const GUEST_CSV_HEADERS = [
  "name",
  "phone",
  "email",
  "side",
  "group",
  "party_size",
  "notes",
] as const;

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      out.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current.trim());
  return out;
}

export type ImportedGuest = {
  name: string;
  phone: string;
  email: string;
  side: GuestSide;
  group_name: string;
  party_size: number;
  notes: string;
};

function asSide(value?: string): GuestSide {
  const v = (value || "").trim().toLowerCase();
  if (["bride", "bride's", "brides", "vadhu", "girl", "her"].includes(v)) return "bride";
  if (["groom", "groom's", "grooms", "var", "boy", "his"].includes(v)) return "groom";
  return "other";
}

export function parseGuestCsv(text: string): { guests: ImportedGuest[]; errors: string[] } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const errors: string[] = [];
  if (!lines.length) return { guests: [], errors: ["The file is empty."] };
  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const nameIdx = header.findIndex((h) => h === "name" || h === "guest" || h === "guest_name");
  if (nameIdx < 0 && header[0] !== "name") {
    // allow headerless files if the first cell looks like a name
  }
  const hasHeader = nameIdx >= 0 || header.includes("phone") || header.includes("email") || header.includes("side");
  const start = hasHeader ? 1 : 0;
  const col = (row: string[], key: string, fallback: number) => {
    const idx = header.indexOf(key);
    return row[idx >= 0 ? idx : fallback] || "";
  };
  const guests: ImportedGuest[] = [];
  for (let i = start; i < lines.length; i += 1) {
    const row = splitCsvLine(lines[i]);
    const name = (hasHeader ? col(row, "name", 0) || col(row, "guest", 0) || col(row, "guest_name", 0) : row[0] || "").trim();
    if (!name) {
      errors.push(`Row ${i + 1}: missing name`);
      continue;
    }
    const partyRaw = hasHeader ? col(row, "party_size", 5) : row[5] || "1";
    const party = Math.min(30, Math.max(1, Number.parseInt(partyRaw, 10) || 1));
    guests.push({
      name: name.slice(0, 120),
      phone: (hasHeader ? col(row, "phone", 1) : row[1] || "").slice(0, 24),
      email: (hasHeader ? col(row, "email", 2) : row[2] || "").slice(0, 160),
      side: asSide(hasHeader ? col(row, "side", 3) : row[3]),
      group_name: (hasHeader ? col(row, "group", 4) || col(row, "group_name", 4) : row[4] || "").slice(0, 80),
      party_size: party,
      notes: (hasHeader ? col(row, "notes", 6) : row[6] || "").slice(0, 500),
    });
  }
  return { guests, errors };
}

function csvCell(value?: string | number | null): string {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function guestsToCsv(
  guests: Array<{
    name: string;
    phone?: string | null;
    email?: string | null;
    side?: string | null;
    group_name?: string | null;
    party_size?: number | null;
    notes?: string | null;
  }>,
  events: WeddingEventRow[],
  rsvps: Array<{ guest_id: string; event_id: string; status: RsvpStatus; party_size?: number | null }>,
  guestIds?: string[],
): string {
  const eventHeaders = events.map((event) => `${event.title} RSVP`);
  const lines = [
    [...GUEST_CSV_HEADERS, ...eventHeaders].join(","),
  ];
  guests.forEach((guest, index) => {
    const id = guestIds?.[index];
    const base = [
      csvCell(guest.name),
      csvCell(guest.phone),
      csvCell(guest.email),
      csvCell(guest.side),
      csvCell(guest.group_name),
      csvCell(guest.party_size ?? 1),
      csvCell(guest.notes),
    ];
    const eventCells = events.map((event) => {
      const row = id ? rsvps.find((r) => r.guest_id === id && r.event_id === event.id) : undefined;
      return csvCell(row?.status || "pending");
    });
    lines.push([...base, ...eventCells].join(","));
  });
  return `${lines.join("\n")}\n`;
}

export const SAMPLE_GUEST_CSV = `name,phone,email,side,group,party_size,notes
Meera Sharma,919800000001,meera@example.com,bride,Mama's family,2,
Rohan Mehta,919800000002,,groom,College friends,1,Vegetarian
Asha Ben,,,bride,Ahmedabad,3,
`;
