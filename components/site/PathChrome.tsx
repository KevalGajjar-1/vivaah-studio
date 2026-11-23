"use client";

import { usePathname } from "next/navigation";

export function PathChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "";
  if (path.startsWith("/w/")) return null;
  return <>{children}</>;
}
