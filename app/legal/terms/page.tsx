import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of use" };
export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 text-[15px] leading-relaxed text-[#4a3d34]">
      <h1 className="font-serif text-4xl text-[#1a1410]">Terms of use</h1>
      <p className="mt-6">
        Vivaah Studio lets you personalise ready-made invitation templates and, when payments are connected,
        purchase a clean download. You may use a purchased invitation for your own event. You may not resell
        the templates, remove another couple&apos;s content and reissue a design as your own product, or scrape
        the library.
      </p>
      <p className="mt-4">
        Preview downloads include a watermark. Clean, unwatermarked files and public guest links are available
        after a design is unlocked. Until a payment gateway is added, unlocks may be granted by the studio.
      </p>
      <p className="mt-4">
        Video backgrounds are licensed stock clips. Credits and licence links are listed on the Credits page.
        You must keep those attributions if a licence requires them.
      </p>
    </article>
  );
}
