import Link from "next/link";
import type { Metadata } from "next";
import { HomeHero } from "@/components/site/HomeHero";
import { TemplateThumb } from "@/components/render/TemplateThumb";
import { fileTemplates } from "@/lib/catalog";
import { rupees } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Vivaah — Indian Wedding Planning Studio",
  description:
    "Design wedding invitations, publish an animated wedding website, manage your guest list, and write messages in English, Hindi or Gujarati.",
};

const features = [
  {
    n: "01",
    title: "AI invitation designer",
    body: "Answer a few questions — names, events, venue, language and vibe — and get a designed still or video invitation you can edit and download.",
    href: "/create",
  },
  {
    n: "02",
    title: "Wedding website",
    body: "A mobile-first page for your story, schedule, maps and a countdown. Guests RSVP for Haldi, Mehendi, Sangeet, the wedding and the reception.",
    href: "/dashboard/wedding",
  },
  {
    n: "03",
    title: "Guest list & headcount",
    body: "Add or import guests, group them by side and family, track RSVPs per event, and export a clean sheet for the caterer.",
    href: "/dashboard/guests",
  },
  {
    n: "04",
    title: "Free message writer",
    body: "No account needed. Formal, Hinglish, shayari or traditional wording in English, Hindi or Gujarati — ready to copy.",
    href: "/tools/messages",
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
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">The studio</p>
        <h2 className="font-serif mt-2 max-w-2xl text-4xl text-[#1a1410]">
          Everything a couple needs before the first function.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <Link
              key={feature.n}
              href={feature.href}
              className="group border-t border-[#e8dccb] pt-6 transition hover:border-[#b8952a]"
            >
              <p className="font-serif text-3xl text-[#6b1d2a]">{feature.n}</p>
              <h3 className="mt-3 text-xl">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b5a4c]">{feature.body}</p>
              <span className="mt-4 inline-block text-sm text-[#6b1d2a] underline-offset-4 group-hover:underline">
                Open
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
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
          <h2 className="font-serif mt-2 text-4xl">Start with the invite, finish with the list</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Tell us the shaadi",
                body: "Names, Haldi to reception, venue, language and vibe. We write the wording and suggest a finished template.",
              },
              {
                n: "02",
                title: "Publish a page guests can open",
                body: "Your story, schedule and maps live on a beautiful link. Guests RSVP for each function in one form.",
              },
              {
                n: "03",
                title: "Keep the headcount honest",
                body: "Both sides add guests, RSVPs land in one list, and you export numbers the caterer can trust.",
              },
            ].map((step) => (
              <div key={step.n} className="border-t border-[#d4b56a]/30 pt-6">
                <p className="font-serif text-3xl text-[#d4b56a]">{step.n}</p>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#e8dccb]">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/create" className="btn-gold !bg-[#d4b56a] !text-[#1c0b0f] hover:!bg-[#e8c872]">
              Design an invitation
            </Link>
            <Link href="/signup" className="btn-outline !border-[#d4b56a66] !text-[#f7f1e8] hover:!border-[#d4b56a]">
              Create a free account
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Pricing</p>
        <h2 className="font-serif mt-2 text-4xl">Plan free, unlock a clean file later</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e8dccb] bg-white p-8">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#8a7a6a]">Planning</p>
            <p className="font-serif mt-2 text-4xl">Free</p>
            <ul className="mt-4 space-y-2 text-sm text-[#6b5a4c]">
              <li>Invitation designer and watermarked previews</li>
              <li>Wedding website with RSVP</li>
              <li>Guest list, CSV import and export</li>
              <li>Free message writer, no account needed</li>
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
