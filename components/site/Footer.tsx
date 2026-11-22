import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog/types";

export function Footer() {
  return (
    <footer className="no-print border-t border-[#e8dccb] bg-[#f3ece2]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-[#6b1d2a]">Vivaah</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#6b5a4c]">
            A studio of ready-made wedding invitations. Pick a finished layout, change the wording, and
            share a still card or a video invite.
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Library</p>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 text-sm">
            {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
              <li key={c.id}>
                <Link href="/templates" className="text-[#4a3d34] hover:text-[#6b1d2a]">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Studio</p>
          <ul className="mt-3 space-y-1.5 text-sm text-[#4a3d34]">
            <li>
              <Link href="/templates" className="hover:text-[#6b1d2a]">
                Browse templates
              </Link>
            </li>
            <li>
              <Link href="/create" className="hover:text-[#6b1d2a]">
                AI invitation writer
              </Link>
            </li>
            <li>
              <Link href="/designs" className="hover:text-[#6b1d2a]">
                My designs
              </Link>
            </li>
            <li>
              <Link href="/legal/credits" className="hover:text-[#6b1d2a]">
                Video credits
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-[#6b1d2a]">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-[#6b1d2a]">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/refund" className="hover:text-[#6b1d2a]">
                Refunds
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#e8dccb] py-4 text-center text-xs text-[#8a7a6a]">
        Made with care · 2026 Vivaah Studio
      </div>
    </footer>
  );
}
