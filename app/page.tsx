import Link from "next/link";
import type { Metadata } from "next";
import { HomeHero } from "@/components/site/HomeHero";
import { TemplateThumb } from "@/components/render/TemplateThumb";
import { fileTemplates } from "@/lib/catalog";
import { rupees } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Vivaah — Wedding Invitation Studio",
  description:
    "A Canva-style library of ready-made wedding invitations. Change the wording on still cards and video templates for wedding, engagement, haldi, mehendi, sangeet, reception and save-the-date.",
};

const steps = [
  {
    n: "01",
    title: "Pick a finished design",
    body: "Browse still cards and video invitations by event and style. The layout, typography and ornaments stay as they are.",
  },
  {
    n: "02",
    title: "Change the wording",
    body: "Edit names, date, venue and invitation text — in English, Hindi or Gujarati. Rewrite with the studio writer when you want a fresh draft.",
  },
  {
    n: "03",
    title: "Preview, save, unlock",
    body: "Download a watermarked preview for free. Save to My designs, then unlock a clean file and guest link when payments (or an admin grant) are ready.",
  },
];

const featured = fileTemplates.filter((t) =>
  [
    "classic-floral",
    "royal-mandala",
    "video-rose-gold",
    "marigold-haldi",
    "henna-mehendi",
    "night-sangeet",
    "nikah-elegant",
    "south-indian-temple",
    "video-fireworks",
  ].includes(t.id),
);

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">The library</p>
            <h2 className="font-serif mt-2 text-4xl text-[#1a1410]">
              {fileTemplates.filter((t) => t.kind === "image").length} still cards and{" "}
              {fileTemplates.filter((t) => t.kind === "video").length} video invites
            </h2>
          </div>
          <Link href="/templates" className="hidden text-sm text-[#6b1d2a] underline-offset-4 hover:underline sm:inline">
            View all templates
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((template) => (
            <Link key={template.id} href={`/templates/${template.id}`} className="group block">
              <TemplateThumb
                template={template}
                className="rounded-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-24px_rgba(40,16,8,0.55)]"
              />
              <div className="mt-4">
                <h3 className="font-serif text-xl text-[#1a1410]">{template.name}</h3>
                <p className="text-sm text-[#6b5a4c]">{template.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-[#1c0b0f] py-20 text-[#f7f1e8]">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#d4b56a]">How it works</p>
          <h2 className="font-serif mt-2 text-4xl">From a finished template to your invitation</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="border-t border-[#d4b56a]/30 pt-6">
                <p className="font-serif text-3xl text-[#d4b56a]">{step.n}</p>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#e8dccb]">{step.body}</p>
              </div>
            ))}
          </div>
          <Link href="/templates" className="btn-gold mt-12 !bg-[#d4b56a] !text-[#1c0b0f] hover:!bg-[#e8c872]">
            Browse the library
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Pricing</p>
        <h2 className="font-serif mt-2 text-4xl">Start free, unlock a clean file later</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e8dccb] bg-white p-8">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#8a7a6a]">Preview</p>
            <p className="font-serif mt-2 text-4xl">Free</p>
            <ul className="mt-4 space-y-2 text-sm text-[#6b5a4c]">
              <li>Browse the full library</li>
              <li>Change wording, names, date and venue</li>
              <li>Watermarked PNG, PDF or video export</li>
              <li>Save designs to your account</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[#6b1d2a]/30 bg-[#fbf6ee] p-8">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#6b1d2a]">Clean download</p>
            <p className="font-serif mt-2 text-4xl">From {rupees(49900)}</p>
            <ul className="mt-4 space-y-2 text-sm text-[#6b5a4c]">
              <li>Still cards from {rupees(49900)}</li>
              <li>Video invitations from {rupees(69900)}</li>
              <li>No watermark, plus a public guest link</li>
              <li>Payments come last — an admin can unlock by hand for now</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
