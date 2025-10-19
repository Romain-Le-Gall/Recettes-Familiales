"use client";
import { useEffect } from "react";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { initSampleData, listModifications } from "@/lib/store";

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    initSampleData();
  }, []);

  const mods = user ? listModifications(3) : [];

  return (
    <div className="radial-blue-bg h-full overflow-hidden">
      {!user && <LoginModal />}
      <div className="mx-auto max-w-5xl h-full px-4 pb-0 grid grid-rows-[calc((100vh-3.5rem)*0.35)_1fr] gap-0">
        <div className="flex items-start justify-center">
          <img
            src="/Blason_noborder.png"
            alt="Blason familial"
            className="h-full w-auto max-h-[calc((100vh-3.5rem)*0.35)] drop-shadow-lg"
          />
        </div>
        <div className="flex flex-col items-center text-center overflow-hidden gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Recettes Familiales
          </h1>
          <p className="text-neutral-700">Nos traditions culinaires</p>

          {user ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 max-w-3xl mx-auto">
                {[
                  {
                    label: "Entrée",
                    href: "/categorie/Entree",
                    icon: "🥗",
                    badgeClass: "bg-indigo-100 text-indigo-700",
                  },
                  {
                    label: "Plat",
                    href: "/categorie/Plat",
                    icon: "🍲",
                    badgeClass: "bg-emerald-100 text-emerald-700",
                  },
                  {
                    label: "Dessert",
                    href: "/categorie/Dessert",
                    icon: "🍰",
                    badgeClass: "bg-rose-100 text-rose-700",
                  },
                ].map((c) => (
                  <Link
                    key={c.label}
                    href={c.href}
                    className="flex flex-col items-center justify-center h-28 rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm hover:shadow-md transition hover:border-sky-300"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${c.badgeClass}`}
                    >
                      <span className="text-xl">{c.icon}</span>
                    </div>
                    <div className="text-lg font-medium">{c.label}</div>
                  </Link>
                ))}
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-medium mb-2">
                  Dernières modifications
                </h2>
                {mods.length === 0 ? (
                  <p className="text-sm text-neutral-600">
                    Aucune modification récente.
                  </p>
                ) : (
                  <ul className="space-y-2 max-w-md mx-auto">
                    {mods.map((m) => (
                      <li
                        key={m.id}
                        className="rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-sm text-center"
                      >
                        <span className="font-medium">{m.author}</span> ·{" "}
                        {m.type} · {m.recipeTitle}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <p className="text-neutral-600">
              Connectez-vous pour accéder aux recettes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
