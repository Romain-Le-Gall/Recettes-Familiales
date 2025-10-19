"use client";

import { usePathname } from "next/navigation";

export default function RouteScopedMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isConnexion = pathname?.startsWith("/connexion") || pathname?.startsWith("/login");
  const mainClass = isHome || isConnexion
    ? "flex-1 h-[calc(100svh-3.5rem)] overflow-hidden"
    : "flex-1 overflow-auto bg-[#e9faff]";
  return <main className={mainClass}>{children}</main>;
}