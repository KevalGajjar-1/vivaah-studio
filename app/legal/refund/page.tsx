import type { Metadata } from "next";
export const metadata: Metadata = { title: "Refunds" };
export default function RefundPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 text-[15px] leading-relaxed text-[#4a3d34]">
      <h1 className="font-serif text-4xl text-[#1a1410]">Refunds</h1>
      <p className="mt-6">
        Payments are not connected yet. When checkout is added, clean-download purchases will generally be
        refundable if a technical issue prevented you from receiving the file, and considered on a case-by-case
        basis otherwise because invitation files can be copied after download.
      </p>
      <p className="mt-4">
        Watermarked previews remain free. An unlock granted by the studio before payments go live is
        complimentary and is not a paid order.
      </p>
    </article>
  );
}
