import type { Metadata } from "next";
import Link from "next/link";
import { videoTemplates } from "@/lib/catalog";

export const metadata: Metadata = { title: "Stock video credits" };

export default function CreditsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 text-[15px] leading-relaxed text-[#4a3d34]">
      <h1 className="font-serif text-4xl text-[#1a1410]">Stock video credits</h1>
      <p className="mt-6">
        Video invitation backgrounds are free-licensed stock clips. They were not copied from paid
        template marketplaces. Each clip is trimmed and recompressed for the web. Source URL and licence
        are also stored on the template.
      </p>
      <p className="mt-4">
        Provider:{" "}
        <a href="https://mixkit.co" className="underline">
          Mixkit
        </a>
        . Licence:{" "}
        <a href="https://mixkit.co/license/" className="underline">
          Mixkit Stock Video Free License
        </a>
        . Commercial use is permitted. Attribution is not required; it is recorded here for transparency.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        {videoTemplates.map((t) =>
          t.video ? (
            <li key={t.id} className="border-b border-[#f0e6d6] pb-3">
              <span className="font-medium text-[#1a1410]">{t.name}</span>
              {" — "}
              {t.video.credit}.{" "}
              <a href={t.video.sourceUrl} className="underline" target="_blank" rel="noreferrer">
                Source
              </a>
              {" · "}
              <a href={t.video.licenseUrl} className="underline" target="_blank" rel="noreferrer">
                Licence
              </a>
            </li>
          ) : null,
        )}
      </ul>
      <p className="mt-8 text-sm">
        <Link href="/templates" className="underline">
          Back to templates
        </Link>
      </p>
    </article>
  );
}
