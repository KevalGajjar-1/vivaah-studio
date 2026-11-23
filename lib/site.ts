export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const siteName = "Vivaah";
export const siteTagline =
  "An AI wedding planning studio for Indian weddings — invitations, a wedding website, and a guest list in one place.";
export const siteDescription =
  "Plan an Indian wedding with Vivaah: design still and video invitations, publish an animated wedding website with RSVP, manage your guest list, and write WhatsApp-ready messages in English, Hindi or Gujarati.";
