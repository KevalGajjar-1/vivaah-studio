import Link from "next/link";

export function Nav() {
  return (
    <header className="site-nav no-print sticky top-0 z-40 border-b border-[#e8dccb]/80 bg-[#f7f1e8]/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl tracking-tight text-[#6b1d2a]">Vivaah</span>
          <span className="hidden text-[10px] tracking-[0.22em] uppercase text-[#8a7a6a] sm:inline">
            Studio
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/templates" className="text-[#4a3d34] transition hover:text-[#6b1d2a]">
            Templates
          </Link>
          <Link href="/create" className="text-[#4a3d34] transition hover:text-[#6b1d2a]">
            Create
          </Link>
          <Link href="/create" className="btn-gold !px-4 !py-1.5 text-[13px]">
            Make an invite
          </Link>
        </nav>
      </div>
    </header>
  );
}
