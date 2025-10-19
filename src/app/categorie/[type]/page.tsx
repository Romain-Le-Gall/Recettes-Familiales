"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { initSampleData, listRecipes } from "@/lib/store";
import { useMemo, useState, useEffect } from "react";
import type { Category } from "@/types";

function decodeCategory(typeParam: string): Category | null {
  if (!typeParam) return null;
  const normalized = typeParam.toLowerCase();
  if (normalized === "entree") return "Entrée";
  if (normalized === "plat") return "Plat";
  if (normalized === "dessert") return "Dessert";
  return null;
}

export default function CategoryPage() {
  const params = useParams<{ type: string }>();
  const cat = decodeCategory(params.type);
  const [query, setQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Ensure sample data is available on client and avoid SSR/client mismatch
    initSampleData();
    setHydrated(true);
  }, []);

  const recipes = useMemo(() => {
    if (!hydrated) return [] as ReturnType<typeof listRecipes>;
    const all = listRecipes();
    const filtered = cat ? all.filter((r) => r.category === cat) : all;
    const q = query.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q))
    );
  }, [cat, query, hydrated]);

  if (!cat) return <div className="p-6">Catégorie inconnue.</div>;

  return (
    <div className="">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">{cat}</h1>
          <Link
            href="/"
            className="rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200"
          >
            Accueil
          </Link>
        </div>

        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              className="w-full rounded-md border border-neutral-300 px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
              placeholder="Rechercher par titre, auteur ou ingrédient"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        {!hydrated ? (
          <div className="text-sm text-neutral-600">Chargement…</div>
        ) : recipes.length === 0 ? (
          <p className="text-sm text-neutral-600">
            Aucune recette dans cette catégorie.
          </p>
        ) : (
          <ul className="space-y-3">
            {recipes.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-neutral-600">{r.author}</div>
                </div>
                <Link
                  href={`/recette/${r.id}`}
                  className="rounded-md bg-neutral-900 px-3 py-2 text-white hover:bg-black"
                >
                  Ouvrir
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
