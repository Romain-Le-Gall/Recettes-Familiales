"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";

export default function HeaderVisible() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isHome = pathname === "/";
  const hideHeader = isHome && !user; // hide only on home when logged out
  return hideHeader ? null : <Header />;
}