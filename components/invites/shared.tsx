import { formatDate, formatTime } from "@/lib/format";
import type { InviteData } from "@/lib/types";

export function Names({
  data,
  className,
  andClassName = "amp",
  stacked = true,
}: {
  data: InviteData;
  className?: string;
  andClassName?: string;
  stacked?: boolean;
}) {
  const a = data.partnerA.trim() || "Your Name";
  const b = data.partnerB.trim() || "Their Name";
  if (!stacked) {
    return (
      <h1 className={className}>
        {a} <span className={andClassName}>and</span> {b}
      </h1>
    );
  }
  return (
    <h1 className={className}>
      <span className="block">{a}</span>
      <span className={andClassName}>&</span>
      <span className="block">{b}</span>
    </h1>
  );
}

export function WhenWhere({
  data,
  className,
  dateClassName,
  venueClassName,
}: {
  data: InviteData;
  className?: string;
  dateClassName?: string;
  venueClassName?: string;
}) {
  const date = formatDate(data.date, data.language);
  const time = formatTime(data.time, data.language);
  return (
    <div className={className}>
      {date ? <p className={dateClassName}>{date}</p> : null}
      {time ? <p className={dateClassName}>{time}</p> : null}
      {data.venue ? <p className={venueClassName || dateClassName}>{data.venue}</p> : null}
      {data.venueAddress ? <p className={venueClassName || dateClassName}>{data.venueAddress}</p> : null}
    </div>
  );
}

export function EventsList({
  data,
  className,
  itemClassName,
}: {
  data: InviteData;
  className?: string;
  itemClassName?: string;
}) {
  const events = (data.events || []).filter((e) => e.title?.trim());
  if (!events.length) return null;
  return (
    <ul className={className}>
      {events.map((event) => (
        <li key={`${event.title}-${event.date}-${event.time}`} className={itemClassName}>
          <strong>{event.title}</strong>
          {(() => {
            const details = [formatDate(event.date, data.language), formatTime(event.time, data.language), event.venue]
              .filter(Boolean)
              .join(" · ");
            return details ? ` ${details}` : null;
          })()}
        </li>
      ))}
    </ul>
  );
}

export function Wording({ data, className }: { data: InviteData; className?: string }) {
  const text = data.wording?.trim();
  if (!text) return null;
  return <p className={`wording ${className || ""}`}>{text}</p>;
}
