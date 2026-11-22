import type { InviteData } from "@/lib/types";

export function fieldsFromInvite(data: Partial<InviteData> | Record<string, string>): Record<string, string> {
  const rec = data as Record<string, string>;
  return {
    heading: rec.heading || "",
    hostLine: rec.hostLine || "",
    partnerA: rec.partnerA || "",
    partnerB: rec.partnerB || "",
    wording: rec.wording || "",
    date: rec.date || "",
    time: rec.time || "",
    venue: rec.venue || "",
    venueAddress: rec.venueAddress || "",
    language: rec.language || "en",
    familyA: rec.familyA || "",
    familyB: rec.familyB || "",
    rsvpPhone: rec.rsvpPhone || "",
    rsvpName: rec.rsvpName || "",
    photo: rec.photo || "",
  };
}

export function inviteFromFields(template: string, fields: Record<string, string>): InviteData {
  const language = fields.language === "hi" || fields.language === "gu" ? fields.language : "en";
  return {
    template,
    partnerA: fields.partnerA || "",
    partnerB: fields.partnerB || "",
    date: fields.date || "",
    time: fields.time || "",
    venue: fields.venue || "",
    venueAddress: fields.venueAddress || "",
    heading: fields.heading || "",
    wording: fields.wording || "",
    hostLine: fields.hostLine || "",
    familyA: fields.familyA || "",
    familyB: fields.familyB || "",
    language,
    rsvpPhone: fields.rsvpPhone || "",
    rsvpName: fields.rsvpName || "",
  };
}

export function designTitle(fields: Record<string, string>, fallback = "Untitled invitation") {
  const a = (fields.partnerA || "").trim();
  const b = (fields.partnerB || "").trim();
  if (a && b) return `${a} & ${b}`;
  if (a || b) return a || b;
  return fallback;
}
