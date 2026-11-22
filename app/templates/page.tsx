import type { Metadata } from "next";
import Link from "next/link";
import { InvitationCard } from "@/components/invites/InvitationCard";
import { sampleInvite, templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Invitation templates",
  description:
    "Browse nine beautiful wedding invitation templates: classic floral, royal mandala, minimalist, boho, art deco, rustic, church, nikah, and South Indian temple.",
};

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">The collection</p>
      <h1 className="font-serif mt-2 text-4xl sm:text-5xl">Ready-made invitations</h1>
      <p className="mt-4 max-w-2xl text-[#6b5a4c]">
        Every design is original to the studio — typography, ornaments, and colour, ready to fill
        with your names. Open a card to see a finished example, or start creating from any template.
      </p>
      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <article key={template.slug} className="group">
            <Link href={`/templates/${template.slug}`} className="block">
              <InvitationCard
                data={sampleInvite(template.slug)}
                variant="thumb"
                cardId={`gallery-${template.slug}`}
                className="transition duration-300 group-hover:-translate-y-1"
              />
            </Link>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl">
                  <Link href={`/templates/${template.slug}`} className="hover:text-[#6b1d2a]">
                    {template.name}
                  </Link>
                </h2>
                <p className="text-sm text-[#6b5a4c]">{template.tagline}</p>
              </div>
              <Link
                href={`/create?template=${template.slug}`}
                className="shrink-0 text-xs tracking-wide text-[#6b1d2a] uppercase hover:underline"
              >
                Use this
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
