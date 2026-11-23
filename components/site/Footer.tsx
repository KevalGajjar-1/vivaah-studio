import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog/types";

export function Footer() {
  return (
    <footer className="no-print border-t border-[#e8dccb] bg-[#f3ece2]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-[#6b1d2a]">Vivaah</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#6b5a4c]">
            An Indian wedding planning studio: invitations, an animated wedding website, a guest list,
            and free wording tools in English, Hindi and Gujarati.
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
                Invitation designer
              </Link>
            </li>
            <li>
              <Link href="/tools/messages" className="hover:text-[#6b1d2a]">
                Free message writer
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[#6b1d2a]">
                Couple dashboard
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#6b1d2a]">
                Journal
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
