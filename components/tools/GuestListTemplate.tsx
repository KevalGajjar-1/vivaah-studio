"use client";

import { SAMPLE_GUEST_CSV } from "@/lib/planning/csv";

export function GuestListTemplate() {
  function download() {
    const blob = new Blob([SAMPLE_GUEST_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vivaah-guest-list-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8 rounded-2xl border border-[#e8dccb] bg-white p-6">
      <pre className="overflow-x-auto text-xs leading-relaxed text-[#4a3d34]">{SAMPLE_GUEST_CSV}</pre>
      <button type="button" className="btn-gold mt-5" onClick={download}>
        Download CSV
      </button>
    </div>
  );
}
