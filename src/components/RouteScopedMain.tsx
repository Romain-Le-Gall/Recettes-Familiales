"use client";

import { usePathname } from "next/navigation";

export default function RouteScopedMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isConnexion = pathname?.startsWith("/connexion") || pathname?.startsWith("/login");
  const mainClass = isHome
    ? "relative flex-1 h-[100svh] overflow-auto"
    : isConnexion
    ? "relative flex-1 h-[calc(100svh-3.5rem)] overflow-hidden"
    : "relative flex-1 overflow-auto"; // remove blue background, use global gradient
  return <main className={mainClass}>{children}</main>;
}