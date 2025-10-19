import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 text-blue-900 px-3 py-1.5 hover:from-sky-300 hover:via-blue-300 hover:to-indigo-300 font-semibold text-[15px] tracking-tight transition"
        >
          Accueil
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-[14px]">
          <Link
            href="/categorie/Entree"
            className="text-neutral-700 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-sky-50 transition"
          >
            Entrées
          </Link>
          <Link
            href="/categorie/Plat"
            className="text-neutral-700 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-sky-50 transition"
          >
            Plats
          </Link>
          <Link
            href="/categorie/Dessert"
            className="text-neutral-700 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-sky-50 transition"
          >
            Desserts
          </Link>
          <Link
            href="/ajouter"
            className="ml-2 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 text-blue-900 px-3 py-1.5 hover:from-sky-300 hover:via-blue-300 hover:to-indigo-300 transition"
          >
            Ajouter
          </Link>
        </nav>
      </div>
    </header>
  );
}
