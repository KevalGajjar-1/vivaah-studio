import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#8a7a6a]">404</p>
      <h1 className="font-serif mt-2 text-4xl">This page was not in the album</h1>
      <p className="mt-3 text-[#6b5a4c]">The invitation you are looking for may have a mistyped address.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-gold">
          Home
        </Link>
        <Link href="/templates" className="btn-outline">
          Templates
        </Link>
      </div>
    </div>
  );
}
