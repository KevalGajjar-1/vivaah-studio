"use client";

import { useMemo, useState } from "react";

function clean(value: string) {
  return value.replace(/[^A-Za-z0-9]+/g, "");
}

function hashtags(partnerA: string, partnerB: string) {
  const a = clean(partnerA);
  const b = clean(partnerB);
  if (!a && !b) return [];
  const first = a || b;
  const second = a && b ? b : "";
  const tags = new Set<string>();
  if (first && second) {
    tags.add(`#${first}Weds${second}`);
    tags.add(`#${second}Weds${first}`);
    tags.add(`#${first}And${second}`);
    tags.add(`#The${first}${second}Wedding`);
    tags.add(`#${first}Ki${second}Shaadi`);
    tags.add(`#${first}${second}Forever`);
  } else {
    tags.add(`#${first}Wedding`);
    tags.add(`#${first}Shaadi`);
  }
  return [...tags];
}

export function HashtagStudio() {
  const [partnerA, setPartnerA] = useState("");
  const [partnerB, setPartnerB] = useState("");
  const [copied, setCopied] = useState("");
  const tags = useMemo(() => hashtags(partnerA, partnerB), [partnerA, partnerB]);

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="h-a">Name 1</label>
          <input id="h-a" value={partnerA} onChange={(e) => setPartnerA(e.target.value)} placeholder="Ananya" />
        </div>
        <div className="field">
          <label htmlFor="h-b">Name 2</label>
          <input id="h-b" value={partnerB} onChange={(e) => setPartnerB(e.target.value)} placeholder="Arjun" />
        </div>
      </div>
      <ul className="mt-8 space-y-2">
        {tags.map((tag) => (
          <li key={tag} className="flex items-center justify-between rounded-xl border border-[#e8dccb] bg-white px-4 py-3">
            <span className="font-serif text-xl">{tag}</span>
            <button
              type="button"
              className="text-xs text-[#6b1d2a] hover:underline"
              onClick={async () => {
                await navigator.clipboard.writeText(tag);
                setCopied(tag);
              }}
            >
              {copied === tag ? "Copied" : "Copy"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
