export function normalizePhone(input?: string): string {
  if (!input) return "";
  const digits = input.replace(/[^\d]/g, "");
  return digits;
}

export function whatsappRsvpUrl(phone?: string, message?: string): string | null {
  const digits = normalizePhone(phone);
  if (!digits || digits.length < 8) return null;
  const text = encodeURIComponent(message || "We would be honoured to attend.");
  return `https://wa.me/${digits}?text=${text}`;
}

export function defaultRsvpMessage(partnerA: string, partnerB: string, rsvpName?: string): string {
  const who = rsvpName?.trim() ? `${rsvpName.trim()} here. ` : "";
  return `${who}With joy, we accept the invitation to the wedding of ${partnerA} & ${partnerB} and look forward to celebrating with you.`;
}
