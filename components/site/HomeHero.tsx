"use client";

import Link from "next/link";
import { InvitationCard } from "@/components/invites/InvitationCard";
import { sampleInvite } from "@/lib/templates";

const featured = ["royal-mandala", "classic-floral", "art-deco"] as const;

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#1c0b0f] text-[#f7f1e8]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, #6b1d2a 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, #b8952a33 0%, transparent 40%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="hero-kicker text-[11px] tracking-[0.32em] uppercase text-[#d4b56a]">
            Indian wedding planning
          </p>
          <h1 className="hero-title font-serif mt-4 text-5xl leading-[1.05] text-[#f7f1e8] sm:text-6xl lg:text-7xl">
            From the first invite to the last RSVP.
          </h1>
          <p className="hero-copy mt-6 max-w-md text-base leading-relaxed text-[#e8dccb] sm:text-lg">
            Design still and video invitations, publish a wedding website your family can open,
            and keep Haldi, Mehendi, Sangeet, the wedding and the reception in one guest list —
            in English, Hindi or Gujarati.
          </p>
          <div className="hero-cta mt-8 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="btn-gold !bg-[#d4b56a] !text-[#1c0b0f] hover:!bg-[#e8c872]"
            >
              Design an invitation
            </Link>
            <Link
              href="/tools/messages"
              className="btn-outline !border-[#d4b56a66] !text-[#f7f1e8] hover:!border-[#d4b56a]"
            >
              Free message writer
            </Link>
          </div>
        </div>
        <div className="relative mx-auto h-[420px] w-full max-w-[420px] sm:h-[480px]">
          {featured.map((slug, i) => (
            <Link
              key={slug}
              href={`/templates/${slug}`}
              className="hero-card absolute w-[58%] transition hover:-translate-y-1"
              style={{
                left: `${i * 18}%`,
                top: `${12 + (i - 1) * 8}%`,
                zIndex: i === 1 ? 3 : 1,
                rotate: `${(i - 1) * 7}deg`,
                animationDelay: `${0.25 + i * 0.12}s`,
              }}
            >
              <InvitationCard data={sampleInvite(slug)} variant="thumb" cardId={`hero-${slug}`} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
