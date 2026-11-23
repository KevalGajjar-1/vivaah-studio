import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function Nav() {
  let email: string | null = null;
  let isAdmin = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? null;
      if (data.user) {
        const { data: admin } = await supabase.rpc("is_admin");
        isAdmin = Boolean(admin);
      }
    } catch {
      email = null;
    }
  }

  return (
    <header className="site-nav no-print sticky top-0 z-40 border-b border-[#e8dccb]/80 bg-[#f7f1e8]/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl tracking-tight text-[#6b1d2a]">Vivaah</span>
          <span className="hidden text-[10px] tracking-[0.22em] uppercase text-[#8a7a6a] sm:inline">
            Studio
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-5">
          <Link href="/templates" className="hidden text-[#4a3d34] transition hover:text-[#6b1d2a] sm:inline">
            Templates
          </Link>
          <Link href="/create" className="hidden text-[#4a3d34] transition hover:text-[#6b1d2a] md:inline">
            Designer
          </Link>
          <Link href="/tools" className="hidden text-[#4a3d34] transition hover:text-[#6b1d2a] sm:inline">
            Tools
          </Link>
          <Link href="/blog" className="hidden text-[#4a3d34] transition hover:text-[#6b1d2a] md:inline">
            Journal
          </Link>
          {email ? (
            <Link href="/dashboard" className="text-[#4a3d34] transition hover:text-[#6b1d2a]">
              Dashboard
            </Link>
          ) : null}
          {isAdmin ? (
            <Link href="/admin" className="text-[#4a3d34] transition hover:text-[#6b1d2a]">
              Admin
            </Link>
          ) : null}
          {email ? (
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-[#4a3d34] transition hover:text-[#6b1d2a]">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-[#4a3d34] transition hover:text-[#6b1d2a]">
              Sign in
            </Link>
          )}
          <Link href="/create" className="btn-gold !px-4 !py-1.5 text-[13px]">
            Start planning
          </Link>
        </nav>
      </div>
    </header>
  );
}
