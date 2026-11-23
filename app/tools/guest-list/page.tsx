import type { Metadata } from "next";
import Link from "next/link";
import { GuestListTemplate } from "@/components/tools/GuestListTemplate";

export const metadata: Metadata = {
  title: "Wedding guest list template",
  description: "Download a CSV guest list template for Indian weddings, with columns for both families, groups and party size.",
};

export default function GuestListToolPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">Free tool</p>
      <h1 className="font-serif mt-2 text-4xl">Guest list CSV template</h1>
      <p className="mt-3 text-[#6b5a4c]">
        A starter sheet for mummy’s list, papa’s list and the other family. Import it later into your Vivaah dashboard.
      </p>
      <GuestListTemplate />
      <p className="mt-8 text-sm text-[#6b5a4c]">
        Already have an account?{" "}
        <Link href="/dashboard/guests" className="text-[#6b1d2a] hover:underline">
          Open the guest list manager
        </Link>
        .
      </p>
    </div>
  );
}
