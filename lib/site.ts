export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const siteName = "Vivaah";
export const siteTagline = "Beautiful wedding invitations, composed with care.";
export const siteDescription =
  "Design a wedding invitation in minutes. Choose from nine ready-made templates, let AI write the wording in English, Hindi, or Gujarati, then share a link or download a print-ready card.";
