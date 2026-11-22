import { formatDate, formatTime } from "@/lib/format";
import type { CatalogTemplate } from "@/lib/catalog/types";
import { OrnamentLayer } from "./OrnamentLayer";
import { Watermark } from "./Watermark";

function val(fields: Record<string, string>, key: string, fallback = "") {
  return (fields[key] || "").trim() || fallback;
}

export function FixedInvite({
  template,
  fields,
  watermark = false,
  photoUrl,
  className = "",
}: {
  template: CatalogTemplate;
  fields: Record<string, string>;
  watermark?: boolean;
  photoUrl?: string | null;
  className?: string;
}) {
  const t = template.theme;
  const lang = (fields.language === "hi" || fields.language === "gu" ? fields.language : "en") as "en" | "hi" | "gu";
  const heading = val(fields, "heading", template.sample.heading);
  const host = val(fields, "hostLine");
  const a = val(fields, "partnerA", "Your Name");
  const b = val(fields, "partnerB", "Their Name");
  const wording = val(fields, "wording");
  const date = formatDate(fields.date, lang);
  const time = formatTime(fields.time, lang);
  const venue = val(fields, "venue");
  const address = val(fields, "venueAddress");
  const photo = photoUrl || fields.photo || "";

  return (
    <article
      data-invite-card
      data-skin={t.skin}
      data-lang={lang}
      className={`invite-card relative aspect-[5/7] w-full overflow-hidden shadow-[0_20px_50px_-24px_rgba(40,16,8,0.45)] ${className}`}
      style={{ background: t.background, color: t.color }}
    >
      <div className={`fixed-invite ${t.skin} relative flex h-full flex-col items-center justify-between px-[10%] py-[8%] text-center`}>
        <div className="absolute inset-[3.4%] border opacity-50" style={{ borderColor: t.accent }} />
        <div className="absolute inset-[4.6%] border opacity-30" style={{ borderColor: t.accent }} />
        <OrnamentLayer ornament={t.ornament} color={t.ornamentColor || t.accent} skin={t.skin} uid={template.id} />
        <header className="relative z-10 mt-[8%]">
          {host ? <p className="host">{host}</p> : null}
          <p className="kicker" style={{ color: t.accent }}>{heading}</p>
        </header>
        <div className="relative z-10 my-[2%] flex w-full flex-col items-center">
          {template.hasPhoto && photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="mb-[0.8em] h-[22%] max-h-[9em] w-[22%] max-w-[9em] rounded-full object-cover ring-2" style={{ outlineColor: t.accent, border: `2px solid ${t.accent}` }} />
          ) : null}
          <h1 className="names">
            <span className="block">{a}</span>
            <span className="amp">&</span>
            <span className="block">{b}</span>
          </h1>
        </div>
        <div className="relative z-10 mb-[7%] flex flex-col items-center gap-[0.55em]">
          {wording ? <p className="body wording">{wording}</p> : null}
          <div className="meta" style={{ color: t.accent }}>
            {date ? <p>{date}</p> : null}
            {time ? <p>{time}</p> : null}
            {venue ? <p>{venue}</p> : null}
            {address ? <p>{address}</p> : null}
          </div>
        </div>
      </div>
      <Watermark show={watermark} />
    </article>
  );
}
