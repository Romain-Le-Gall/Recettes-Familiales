export type Category = "Entrée" | "Plat" | "Dessert";

export type Step = {
  title?: string;
  content: string;
};

export type Recipe = {
  id: string;
  title: string;
  author: string;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  steps: Step[];
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  recipeId: string;
  author: string;
  content: string;
  createdAt: string;
};

export type Modification = {
  id: string;
  type: "creation" | "update" | "comment";
  recipeId: string;
  recipeTitle: string;
  author: string;
  at: string;
};