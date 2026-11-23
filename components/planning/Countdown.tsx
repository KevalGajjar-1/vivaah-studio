"use client";

import { useEffect, useMemo, useState } from "react";

function partsUntil(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

export function Countdown({ date, time }: { date?: string | null; time?: string | null }) {
  const target = useMemo(() => {
    if (!date) return null;
    const stamp = time ? `${date}T${timeValue(time)}` : `${date}T00:00:00`;
    const parsed = new Date(stamp);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [date, time]);
  const [parts, setParts] = useState(() => (target ? partsUntil(target) : null));

  useEffect(() => {
    if (!target) return;
    setParts(partsUntil(target));
    const id = window.setInterval(() => setParts(partsUntil(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!target || !parts) return null;
  if (parts.done) {
    return <p className="text-sm tracking-[0.18em] uppercase opacity-80">The celebrations have begun</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {[
        ["Days", parts.days],
        ["Hours", parts.hours],
        ["Minutes", parts.minutes],
        ["Seconds", parts.seconds],
      ].map(([label, value]) => (
        <div key={String(label)} className="min-w-[72px] text-center">
          <p className="font-serif text-4xl">{value}</p>
          <p className="mt-1 text-[10px] tracking-[0.2em] uppercase opacity-70">{label}</p>
        </div>
      ))}
    </div>
  );
}

function timeValue(value: string) {
  const match = value.match(/^(\d{2}:\d{2})/);
  return match ? `${match[1]}:00` : "00:00:00";
}
