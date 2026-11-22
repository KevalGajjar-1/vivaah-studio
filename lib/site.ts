export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const siteName = "Vivaah";
export const siteTagline = "A library of ready-made wedding invitations — still cards and video, yours to personalise.";
export const siteDescription =
  "Browse a large library of ready-made wedding invitation templates. Change the wording, names, date and venue, preview still cards or video invites, and download a watermarked preview. Clean downloads unlock later.";
