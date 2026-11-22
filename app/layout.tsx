import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { getSiteUrl, siteDescription, siteName, siteTagline } from "@/lib/site";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Wedding Invitation Studio`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "wedding invitation",
    "invitation templates",
    "Hindu wedding card",
    "Nikah invitation",
    "AI wedding wording",
    "Gujarati invitation",
    "South Indian kalyanam",
  ],
  authors: [{ name: "Keval Gajjar" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName,
    title: `${siteName} — Wedding Invitation Studio`,
    description: siteTagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Wedding Invitation Studio`,
    description: siteTagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
