import { Comment, Modification, Recipe, Category } from "@/types";

const RECIPES_KEY = "recipes";
const COMMENTS_KEY = "comments";
const MODS_KEY = "modifications";

function nowISO() {
  return new Date().toISOString();
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function initSampleData() {
  if (typeof window === "undefined") return;
  const existing = read<Recipe[]>(RECIPES_KEY);
  if (!existing || existing.length === 0) {
    const sample: Recipe[] = [
      {
        id: "entree_001",
        title: "Salade de chèvre chaud",
        author: "Aline",
        prepTime: "15 min",
        cookTime: "10 min",
        ingredients: ["Chèvre", "Pain", "Miel", "Salade", "Tomates"],
        steps: [
          { title: "Préparer", content: "Préchauffer le four, trancher le pain." },
          { title: "Cuire", content: "Déposer le chèvre, arroser de miel, enfourner." },
        ],
        category: "Entrée",
        createdAt: nowISO(),
        updatedAt: nowISO(),
      },
      {
        id: "plat_001",
        title: "Boeuf bourguignon",
        author: "Pascal",
        prepTime: "30 min",
        cookTime: "2 h",
        ingredients: ["Boeuf", "Vin rouge", "Carottes", "Oignons", "Lardons"],
        steps: [
          { title: "Saisir", content: "Saisir la viande avec les lardons et oignons." },
          { title: "Mijoter", content: "Ajouter vin et légumes, mijoter longtemps." },
        ],
        category: "Plat",
        createdAt: nowISO(),
        updatedAt: nowISO(),
      },
      {
        id: "dessert_001",
        title: "Tarte Tatin",
        author: "Chantal",
        prepTime: "20 min",
        cookTime: "40 min",
        ingredients: ["Pommes", "Sucre", "Beurre", "Pâte brisée"],
        steps: [
          { title: "Caraméliser", content: "Caraméliser les pommes au beurre et sucre." },
          { title: "Cuire", content: "Couvrir de pâte et cuire au four." },
        ],
        category: "Dessert",
        createdAt: nowISO(),
        updatedAt: nowISO(),
      },
    ];
    write(RECIPES_KEY, sample);
    write<Comment[]>(COMMENTS_KEY, []);
    write<Modification[]>(MODS_KEY, []);
  }
}

export function listRecipes(): Recipe[] {
  const data = read<Recipe[]>(RECIPES_KEY) || [];
  return data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getRecipe(id: string): Recipe | null {
  const data = read<Recipe[]>(RECIPES_KEY) || [];
  return data.find((r) => r.id === id) || null;
}

function saveRecipes(recipes: Recipe[]) {
  write(RECIPES_KEY, recipes);
}

export function addRecipe(recipe: Recipe) {
  const recipes = listRecipes();
  recipes.push(recipe);
  saveRecipes(recipes);
  logModification({ type: "creation", recipeId: recipe.id, recipeTitle: recipe.title, author: recipe.author });
}

export function updateRecipe(updated: Recipe) {
  const recipes = listRecipes();
  const idx = recipes.findIndex((r) => r.id === updated.id);
  if (idx !== -1) {
    updated.updatedAt = nowISO();
    recipes[idx] = updated;
    saveRecipes(recipes);
    logModification({ type: "update", recipeId: updated.id, recipeTitle: updated.title, author: updated.author });
  }
}

export function listComments(recipeId: string): Comment[] {
  const comments = read<Comment[]>(COMMENTS_KEY) || [];
  return comments.filter((c) => c.recipeId === recipeId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addComment(recipeId: string, author: string, content: string) {
  const comments = read<Comment[]>(COMMENTS_KEY) || [];
  const newC: Comment = { id: crypto.randomUUID(), recipeId, author, content, createdAt: nowISO() };
  comments.push(newC);
  write(COMMENTS_KEY, comments);
  logModification({ type: "comment", recipeId, recipeTitle: getRecipe(recipeId)?.title || "", author });
}

export function listModifications(limit = 5): Modification[] {
  const mods = read<Modification[]>(MODS_KEY) || [];
  return mods.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, limit);
}

const CATEGORY_SLUG: Record<Category, string> = {
  "Entrée": "entree",
  "Plat": "plat",
  "Dessert": "dessert",
};

export function generateRecipeId(category: Category): string {
  const recipes = listRecipes();
  const slug = CATEGORY_SLUG[category];
  const re = new RegExp(`^${slug}_(\\d+)$`);
  const numbers = recipes
    .filter((r) => r.category === category)
    .map((r) => {
      const m = r.id.match(re);
      return m ? parseInt(m[1], 10) : null;
    })
    .filter((n): n is number => n !== null);
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  const padded = String(next).padStart(3, "0");
  return `${slug}_${padded}`;
}

function logModification({ type, recipeId, recipeTitle, author }: { type: Modification["type"]; recipeId: string; recipeTitle: string; author: string; }) {
  const mods = read<Modification[]>(MODS_KEY) || [];
  mods.push({ id: crypto.randomUUID(), type, recipeId, recipeTitle, author, at: nowISO() });
  write(MODS_KEY, mods);
}