import Link from "next/link";
import { templates } from "@/lib/templates";

export function Footer() {
  return (
    <footer className="no-print border-t border-[#e8dccb] bg-[#f3ece2]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-[#6b1d2a]">Vivaah</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#6b5a4c]">
            A studio for beautiful wedding invitations — nine ready-made designs, AI wording, and a
            shareable card for your guests.
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Templates</p>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 text-sm">
            {templates.map((t) => (
              <li key={t.slug}>
                <Link href={`/templates/${t.slug}`} className="text-[#4a3d34] hover:text-[#6b1d2a]">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a7a6a]">Create</p>
          <ul className="mt-3 space-y-1.5 text-sm text-[#4a3d34]">
            <li>
              <Link href="/create" className="hover:text-[#6b1d2a]">
                AI invitation writer
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-[#6b1d2a]">
                Browse the gallery
              </Link>
            </li>
            <li>
              <Link href="/editor" className="hover:text-[#6b1d2a]">
                Open the editor
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
