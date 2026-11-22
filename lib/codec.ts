import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import type { InviteData } from "./types";

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodeInvite(data: InviteData): string {
  const json = JSON.stringify(data);
  const compressed = zlibSync(strToU8(json), { level: 9 });
  return toBase64Url(compressed);
}

export function decodeInvite(value?: string | null): InviteData | null {
  if (!value) return null;
  try {
    const bytes = fromBase64Url(value);
    let json: string;
    try {
      json = strFromU8(unzlibSync(bytes));
    } catch {
      json = new TextDecoder().decode(bytes);
    }
    const parsed = JSON.parse(json) as InviteData;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      template: parsed.template || "classic-floral",
      partnerA: parsed.partnerA || "",
      partnerB: parsed.partnerB || "",
      date: parsed.date || "",
      time: parsed.time || "",
      venue: parsed.venue || "",
      venueAddress: parsed.venueAddress || "",
      heading: parsed.heading || "",
      wording: parsed.wording || "",
      hostLine: parsed.hostLine || "",
      familyA: parsed.familyA || "",
      familyB: parsed.familyB || "",
      language: parsed.language || "en",
      tone: parsed.tone,
      style: parsed.style,
      rsvpPhone: parsed.rsvpPhone || "",
      rsvpName: parsed.rsvpName || "",
      events: Array.isArray(parsed.events) ? parsed.events : [],
    };
  } catch {
    return null;
  }
}

export function inviteSearchParam(data: InviteData): string {
  return `d=${encodeURIComponent(encodeInvite(data))}`;
}
