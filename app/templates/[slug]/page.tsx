import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InvitationView } from "@/components/render/InvitationView";
import { fileTemplates, getFileTemplate } from "@/lib/catalog";
import { rupees } from "@/lib/slug";
import { getSiteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return fileTemplates.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getFileTemplate(slug);
  if (!template) return { title: "Template" };
  const url = `${getSiteUrl()}/templates/${template.id}`;
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
  const template = getFileTemplate(slug);
  if (!template) notFound();
  const others = fileTemplates.filter((t) => t.id !== slug && t.category === template.category).slice(0, 4);

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
        <div className={`mx-auto w-full ${template.kind === "video" ? "max-w-[360px]" : "max-w-[520px]"}`}>
          <InvitationView template={template} fields={template.sample} playing />
        </div>
        <aside className="lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f0e6d6] px-2 py-0.5 text-[10px] tracking-wide uppercase text-[#6b1d2a]">
              {template.kind === "video" ? "Video" : "Still card"}
            </span>
            <span className="text-[11px] tracking-wide uppercase text-[#8a7a6a]">{template.category.replace("-", " ")}</span>
          </div>
          <h1 className="font-serif mt-3 text-4xl">{template.name}</h1>
          <p className="mt-2 text-[#8a7a6a]">{template.tagline}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#4a3d34]">{template.description}</p>
          <p className="mt-4 text-sm text-[#6b5a4c]">
            Clean download from {rupees(template.pricePaise)}. Preview and watermarked export are free.
            Payments will be added later; an admin can unlock a design by hand for now.
          </p>
          {template.video ? (
            <p className="mt-3 text-xs leading-relaxed text-[#8a7a6a]">
              Background clip: {template.video.credit}. License: {template.video.license}. See{" "}
              <Link href="/legal/credits" className="underline">
                credits
              </Link>
              .
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3">
            <Link href={`/editor?template=${template.id}`} className="btn-gold">
              Use this template
            </Link>
            <Link href="/templates" className="btn-outline">
              Back to the library
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <Link
                key={tag}
                href={`/templates?tag=${tag}`}
                className="rounded-full border border-[#e0d4c6] px-2.5 py-0.5 text-[11px] text-[#6b5a4c]"
              >
                {tag}
              </Link>
            ))}
          </div>
          {others.length ? (
            <div className="mt-12">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">More in this event</p>
              <ul className="mt-3 space-y-2">
                {others.map((t) => (
                  <li key={t.id}>
                    <Link href={`/templates/${t.id}`} className="text-sm hover:text-[#6b1d2a]">
                      {t.name} — {t.tagline}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
