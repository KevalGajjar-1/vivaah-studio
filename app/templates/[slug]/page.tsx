import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvitationCard } from "@/components/invites/InvitationCard";
import { getSiteUrl } from "@/lib/site";
import { getTemplate, sampleInvite, templates } from "@/lib/templates";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = templates.find((t) => t.slug === slug);
  if (!template) return { title: "Template" };
  const url = `${getSiteUrl()}/templates/${template.slug}`;
  return {
    title: `${template.name} invitation`,
    description: template.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${template.name} — Vivaah`,
      description: template.description,
      url,
    },
  };
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const exists = templates.some((t) => t.slug === slug);
  if (!exists) notFound();
  const template = getTemplate(slug);
  const data = sampleInvite(slug);
  const others = templates.filter((t) => t.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">
        <Link href="/templates" className="hover:text-[#6b1d2a]">
          Templates
        </Link>
        <span className="mx-2">/</span>
        {template.name}
      </p>
      <div className="mt-6 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="mx-auto w-full max-w-[520px]">
          <InvitationCard data={data} variant="full" cardId={`page-${slug}`} />
        </div>
        <aside className="lg:sticky lg:top-24">
          <h1 className="font-serif text-4xl">{template.name}</h1>
          <p className="mt-2 text-[#8a7a6a]">{template.tagline}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#4a3d34]">{template.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {template.palette.map((color) => (
              <span
                key={color}
                className="h-7 w-7 rounded-full border border-black/10"
                style={{ background: color }}
                title={color}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Link href={`/create?template=${template.slug}`} className="btn-gold">
              Use this template
            </Link>
            <Link href={`/invite?demo=${template.slug}`} className="btn-outline">
              Open guest preview
            </Link>
          </div>
          <div className="mt-12">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">More designs</p>
            <ul className="mt-3 space-y-2">
              {others.map((t) => (
                <li key={t.slug}>
                  <Link href={`/templates/${t.slug}`} className="text-sm hover:text-[#6b1d2a]">
                    {t.name} — {t.tagline}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
