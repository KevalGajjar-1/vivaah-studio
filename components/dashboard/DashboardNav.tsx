"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/designs", label: "Invitations" },
  { href: "/dashboard/wedding", label: "Wedding page" },
  { href: "/dashboard/guests", label: "Guest list" },
];

export function DashboardNav() {
  const path = usePathname();
  return (
    <nav className="mt-6 flex flex-wrap gap-2">
      {links.map((link) => {
        const active = path === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              active
                ? "border-[#6b1d2a] bg-[#6b1d2a] text-[#f7f1e8]"
                : "border-[#e0d4c6] bg-white text-[#4a3d34] hover:border-[#b8952a]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
