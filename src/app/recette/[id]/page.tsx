"use client";
import { useAuth } from "@/context/AuthContext";
import {
  addComment,
  getRecipe,
  listComments,
  listRecipes,
  updateRecipe,
} from "@/lib/store";
import { Step, Category } from "@/types";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const UNITS = ["ml", "cl", "L", "cac", "cas", "une pincée"] as const;

export default function RecipePage() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientUnits, setIngredientUnits] = useState<string[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [category, setCategory] = useState<Category>("Entrée");
  const [commentText, setCommentText] = useState("");

  const recipe = useMemo(() => getRecipe(params.id), [params.id]);

  useEffect(() => {
    if (!recipe) return;
    setTitle(recipe.title);
    setAuthor(recipe.author);
    setPrepTime(recipe.prepTime);
    setCookTime(recipe.cookTime);

    const parsedUnits = recipe.ingredients.map((i) => {
      const t = i.trim();
      const match = UNITS.find(
        (u) => t.endsWith(` ${u}`) || t.endsWith(` (${u})`)
      );
      return match || "";
    });
    const parsedIngredients = recipe.ingredients.map((i, idx) => {
      const u = parsedUnits[idx];
      if (!u) return i;
      const t = i.trim();
      if (t.endsWith(` ${u}`)) return t.slice(0, -` ${u}`.length).trim();
      if (t.endsWith(` (${u})`)) return t.slice(0, -` (${u})`.length).trim();
      return i;
    });
    setIngredients(parsedIngredients);
    setIngredientUnits(parsedUnits);
    setSteps(recipe.steps);
    setCategory(recipe.category);
  }, [recipe]);

  if (!recipe) return notFound();

  const comments = listComments(recipe.id);

  const all = listRecipes();
  const sameCategory = all.filter((r) => r.category === recipe.category);
  const idx = sameCategory.findIndex((r) => r.id === recipe.id);
  const prevId =
    idx < sameCategory.length - 1 ? sameCategory[idx + 1]?.id : null;
  const nextId = idx > 0 ? sameCategory[idx - 1]?.id : null;

  const addIngredientField = () => {
    setIngredients((arr) => [...arr, ""]);
    setIngredientUnits((arr) => [...arr, ""]);
  };
  const updateIngredient = (idx: number, val: string) =>
    setIngredients((arr) => arr.map((v, i) => (i === idx ? val : v)));
  const updateIngredientUnit = (idx: number, val: string) =>
    setIngredientUnits((arr) => arr.map((v, i) => (i === idx ? val : v)));
  const removeIngredient = (idx: number) => {
    setIngredients((arr) => arr.filter((_, i) => i !== idx));
    setIngredientUnits((arr) => arr.filter((_, i) => i !== idx));
  };

  const addStepField = () => setSteps((arr) => [...arr, { content: "" }]);
  const updateStepTitle = (idx: number, val: string) =>
    setSteps((arr) =>
      arr.map((s, i) => (i === idx ? { ...s, title: val } : s))
    );
  const updateStepContent = (idx: number, val: string) =>
    setSteps((arr) =>
      arr.map((s, i) => (i === idx ? { ...s, content: val } : s))
    );
  const removeStep = (idx: number) =>
    setSteps((arr) => arr.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!user) return;
    const finalIngredients = ingredients
      .map((base, idx) => {
        const unit = (ingredientUnits[idx] || "").trim();
        const b = base.trim();
        return b ? (unit ? `${b} ${unit}` : b) : "";
      })
      .filter(Boolean);
    updateRecipe({
      ...recipe,
      title,
      author,
      prepTime,
      cookTime,
      ingredients: finalIngredients,
      steps,
      category,
      updatedAt: new Date().toISOString(),
    });
    setEditing(false);
    router.refresh();
  };

  const handleAddComment = () => {
    if (!user || !commentText.trim()) return;
    addComment(recipe.id, user, commentText.trim());
    setCommentText("");
    router.refresh();
  };

  return (
    <div className="">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            {recipe.title}
          </h1>
          <div className="flex gap-2">
            {prevId && (
              <button
                type="button"
                className="rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200"
                onClick={() => router.push(`/recette/${prevId}`)}
              >
                ← Précédent
              </button>
            )}
            {nextId && (
              <button
                type="button"
                className="rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200"
                onClick={() => router.push(`/recette/${nextId}`)}
              >
                Suivant →
              </button>
            )}
            <button
              type="button"
              className="rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200"
              onClick={() => router.push("/")}
            >
              Accueil
            </button>
            <button
              type="button"
              className="rounded-md bg-neutral-900 px-3 py-2 text-white hover:bg-black"
              onClick={() => router.push("/ajouter")}
            >
              Ajouter
            </button>
            {user && (
              <button
                type="button"
                className="rounded-md bg-neutral-800 px-3 py-2 text-white hover:bg-neutral-900"
                onClick={() => setEditing((v) => !v)}
              >
                {editing ? "Annuler" : "Modifier"}
              </button>
            )}
          </div>
        </div>

        {!editing ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-neutral-700">
                Par {recipe.author} · Préparation {recipe.prepTime || "-"} ·
                Cuisson {recipe.cookTime || "-"} · {recipe.category}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Ingrédients</h2>
              <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                {recipe.ingredients.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Étapes</h2>
              <div className="space-y-3">
                {recipe.steps.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
                  >
                    {s.title && <h3 className="font-medium mb-1">{s.title}</h3>}
                    <p className="whitespace-pre-wrap text-neutral-700 text-sm">
                      {s.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <input
                className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
              <input
                className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Ingrédients</h2>
              <div className="space-y-2">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      value={ing}
                      onChange={(e) => updateIngredient(idx, e.target.value)}
                    />
                    <select
                      className="w-28 rounded-md border border-neutral-300 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      value={ingredientUnits[idx] || ""}
                      onChange={(e) =>
                        updateIngredientUnit(idx, e.target.value)
                      }
                    >
                      <option value="">Aucune unité</option>
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="rounded-md bg-red-500 px-3 py-2 text-white"
                      onClick={() => removeIngredient(idx)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200"
                onClick={addIngredientField}
              >
                Ajouter un ingrédient
              </button>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Étapes</h2>
              <div className="space-y-3">
                {steps.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-md border border-neutral-200 bg-white p-3 space-y-2"
                  >
                    <input
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      placeholder="Titre (optionnel)"
                      value={s.title || ""}
                      onChange={(e) => updateStepTitle(idx, e.target.value)}
                    />
                    <textarea
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      rows={4}
                      value={s.content}
                      onChange={(e) => updateStepContent(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="rounded-md bg-red-500 px-3 py-2 text-white"
                      onClick={() => removeStep(idx)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 rounded-md bg-neutral-100 px-3 py-2 hover:bg-neutral-200"
                onClick={addStepField}
              >
                Ajouter une étape
              </button>
            </div>
            <div>
              <button
                className="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-black"
                onClick={handleSave}
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Commentaires</h2>
          <div className="space-y-2 mb-4">
            {comments.length === 0 ? (
              <p className="text-sm text-neutral-600">Aucun commentaire.</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded border bg-white p-3 text-sm shadow-sm"
                >
                  <span className="font-medium">{c.author}</span> ·{" "}
                  {new Date(c.createdAt).toLocaleString("fr-FR")}
                  <p className="mt-2 whitespace-pre-wrap text-neutral-700">
                    {c.content}
                  </p>
                </div>
              ))
            )}
          </div>
          {user ? (
            <div className="flex gap-2">
              <textarea
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Votre commentaire"
              />
              <button
                className="rounded-md bg-neutral-900 px-3 py-2 text-white hover:bg-black"
                onClick={handleAddComment}
              >
                Publier
              </button>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">
              Connectez-vous pour commenter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
