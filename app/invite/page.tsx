import type { Metadata } from "next";
import Link from "next/link";
import { InvitationCard } from "@/components/invites/InvitationCard";
import { GuestActions } from "@/components/editor/GuestActions";
import { decodeInvite, inviteSearchParam } from "@/lib/codec";
import { formatDate, formatTime } from "@/lib/format";
import { getSiteUrl } from "@/lib/site";
import { sampleInvite } from "@/lib/templates";

type Props = { searchParams: Promise<{ d?: string; demo?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { d, demo } = await searchParams;
  const data = decodeInvite(d) || (demo ? sampleInvite(demo) : null);
  const names = data ? [data.partnerA, data.partnerB].filter(Boolean).join(" & ") : "Wedding invitation";
  const title = names ? `${names} — Wedding invitation` : "Wedding invitation";
  const description = data?.wording || "You are invited.";
  const ogPath = data
    ? d
      ? `/api/og?d=${encodeURIComponent(d)}`
      : `/api/og?demo=${demo}`
    : "/opengraph-image";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogPath, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogPath],
    },
    alternates: {
      canonical: data ? `${getSiteUrl()}/invite?${d ? `d=${encodeURIComponent(d)}` : `demo=${demo}`}` : undefined,
    },
  };
}

export default async function InvitePage({ searchParams }: Props) {
  const { d, demo } = await searchParams;
  const data = decodeInvite(d) || (demo ? sampleInvite(demo) : null);

  if (!data) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-serif text-4xl">Invitation not found</h1>
        <p className="mt-3 text-[#6b5a4c]">This link does not contain invitation details.</p>
        <Link href="/templates" className="btn-gold mt-6">
          Browse templates
        </Link>
      </div>
    );
  }

  const when = [formatDate(data.date, data.language), formatTime(data.time, data.language)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="bg-[#f3ece2] py-10">
      <div className="mx-auto max-w-3xl px-5">
        <p className="text-center text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">
          You are invited
        </p>
        <h1 className="font-serif mt-2 text-center text-3xl sm:text-4xl">
          {data.partnerA} & {data.partnerB}
        </h1>
        {when ? <p className="mt-2 text-center text-sm text-[#6b5a4c]">{when}</p> : null}
        <div className="mx-auto mt-8 w-full max-w-[520px]" data-print-root>
          <InvitationCard data={data} variant="full" cardId="guest-card" />
        </div>
        <div className="mx-auto mt-8 max-w-[520px]">
          <GuestActions data={data} />
          <p className="mt-6 text-center text-xs text-[#8a7a6a]">
            Want a card like this?{" "}
            <Link href={`/create?template=${data.template}`} className="text-[#6b1d2a] underline">
              Create yours on Vivaah
            </Link>
            {" · "}
            <Link href={`/editor?${inviteSearchParam(data)}`} className="text-[#6b1d2a] underline">
              Edit this card
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
