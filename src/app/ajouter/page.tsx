"use client";
import { useAuth } from "@/context/AuthContext";
import { addRecipe, generateRecipeId } from "@/lib/store";
import { Category, Recipe, Step } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES: Category[] = ["Entrée", "Plat", "Dessert"];
const UNITS = ["ml", "cl", "L", "cac", "cas", "une pincée"] as const;

export default function AjouterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(user || "");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [category, setCategory] = useState<Category>("Entrée");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [ingredientUnits, setIngredientUnits] = useState<string[]>([""]);
  const [steps, setSteps] = useState<Step[]>([{ content: "" }]);
  const [error, setError] = useState<string | null>(null);

  if (!user) return <div className="p-6">Veuillez vous connecter pour ajouter une recette.</div>;

  // helpers
  const addIngredientField = () => {
    setIngredients((arr) => [...arr, ""]);
    setIngredientUnits((arr) => [...arr, ""]);
  };
  const updateIngredient = (idx: number, val: string) => setIngredients((arr) => arr.map((v, i) => (i === idx ? val : v)));
  const removeIngredient = (idx: number) => {
    setIngredients((arr) => arr.filter((_, i) => i !== idx));
    setIngredientUnits((arr) => arr.filter((_, i) => i !== idx));
  };
  const updateIngredientUnit = (idx: number, val: string) => setIngredientUnits((arr) => arr.map((v, i) => (i === idx ? val : v)));

  const addStepField = () => setSteps((arr) => [...arr, { content: "" }]);
  const updateStepTitle = (idx: number, val: string) => setSteps((arr) => arr.map((s, i) => (i === idx ? { ...s, title: val } : s)));
  const updateStepContent = (idx: number, val: string) => setSteps((arr) => arr.map((s, i) => (i === idx ? { ...s, content: val } : s)));
  const removeStep = (idx: number) => setSteps((arr) => arr.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !author.trim()) {
      setError("Titre et Auteur sont requis.");
      return;
    }

  const cleanedIngredients = ingredients
    .map((i, idx) => {
      const base = i.trim();
      const unit = (ingredientUnits[idx] || "").trim();
      return base ? (unit ? `${base} ${unit}` : base) : "";
    })
    .filter(Boolean);
    const cleanedSteps = steps.map((s) => ({ title: s.title?.trim() || undefined, content: s.content.trim() })).filter((s) => s.content.length > 0);
    const now = new Date().toISOString();
    const id = generateRecipeId(category);
    const recipe: Recipe = {
      id,
      title: title.trim(),
      author: author.trim(),
      prepTime: prepTime.trim(),
      cookTime: cookTime.trim(),
      ingredients: cleanedIngredients,
      steps: cleanedSteps,
      category,
      createdAt: now,
      updatedAt: now,
    };
    addRecipe(recipe);
    router.push(`/recette/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Ajouter une recette</h1>
      <div className="space-y-6 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-600">Titre</label>
            <input className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-neutral-600">Auteur</label>
            <input className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-neutral-600">Préparation (min)</label>
            <input type="number" className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-neutral-600">Cuisson (min)</label>
            <input type="number" className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-neutral-600">Catégorie</label>
            <select className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={category} onChange={(e) => setCategory(e.target.value as any)}>
              <option>Entrée</option>
              <option>Plat</option>
              <option>Dessert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-neutral-600">Ingrédients</label>
          <div className="space-y-3">
            {ingredients.map((i, idx) => (
              <div key={idx} className="flex gap-2">
                <input className="flex-1 rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={i} onChange={(e) => updateIngredient(idx, e.target.value)} />
                <select className="w-28 rounded-md border border-neutral-300 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={ingredientUnits[idx] || ""} onChange={(e) => updateIngredientUnit(idx, e.target.value)}>
                  <option value="">Aucune unité</option>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <button type="button" className="rounded-md bg-red-500 px-3 py-2 text-white" onClick={() => removeIngredient(idx)}>Supprimer</button>
              </div>
            ))}
            <button type="button" className="rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200" onClick={addIngredientField}>Ajouter un ingrédient</button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-neutral-600">Étapes</label>
          <div className="space-y-4">
            {steps.map((s, idx) => (
              <div key={idx} className="space-y-2 rounded-md border border-neutral-200 p-3">
                <input className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={s.title || ""} onChange={(e) => updateStepTitle(idx, e.target.value)} placeholder={`Étape ${idx + 1}`} />
                <textarea className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={s.content} onChange={(e) => updateStepContent(idx, e.target.value)} rows={3} />

                <div className="flex gap-2">
                  <button className="rounded-md bg-red-500 px-3 py-2 text-white" onClick={() => removeStep(idx)}>Supprimer</button>
                  {idx === steps.length - 1 && (
                    <button type="button" className="rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200" onClick={addStepField}>Ajouter une étape</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200" onClick={() => router.push("/")}>Annuler</button>
          <button type="submit" className="rounded-md bg-neutral-900 px-3 py-2 text-white hover:bg-black">Enregistrer</button>
        </div>
      </div>
    </form>
  );
}