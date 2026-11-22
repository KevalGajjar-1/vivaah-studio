import Link from "next/link";
import type { Metadata } from "next";
import { HomeHero } from "@/components/site/HomeHero";
import { InvitationCard } from "@/components/invites/InvitationCard";
import { sampleInvite, templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Vivaah — Wedding Invitation Studio",
  description:
    "Beautiful ready-made wedding invitation templates, an AI wording writer, live preview, PNG and PDF download, and a shareable guest link.",
};

const steps = [
  {
    n: "01",
    title: "Tell us the details",
    body: "Names, date, venue, families, language, and the feeling you want the card to carry.",
  },
  {
    n: "02",
    title: "Let the studio write",
    body: "AI composes elegant wording in English, Hindi, or Gujarati — or our studio templates step in if a model is unavailable.",
  },
  {
    n: "03",
    title: "Polish and share",
    body: "Pick a template, edit live, download a PNG or PDF, and send a guest link with WhatsApp RSVP.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">The gallery</p>
            <h2 className="font-serif mt-2 text-4xl text-[#1a1410]">Nine ready-made invitations</h2>
          </div>
          <Link href="/templates" className="hidden text-sm text-[#6b1d2a] underline-offset-4 hover:underline sm:inline">
            View all templates
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link key={template.slug} href={`/templates/${template.slug}`} className="group block">
              <InvitationCard
                data={sampleInvite(template.slug)}
                variant="thumb"
                cardId={`home-${template.slug}`}
                className="transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-24px_rgba(40,16,8,0.55)]"
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
          <h2 className="font-serif mt-2 text-4xl">From a few details to a finished card</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="border-t border-[#d4b56a]/30 pt-6">
                <p className="font-serif text-3xl text-[#d4b56a]">{step.n}</p>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#e8dccb]">{step.body}</p>
              </div>
            ))}
          </div>
          <Link href="/create" className="btn-gold mt-12 !bg-[#d4b56a] !text-[#1c0b0f] hover:!bg-[#e8c872]">
            Compose your invitation
          </Link>
        </div>
      </section>
    </>
  );
}
