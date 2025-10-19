export const ALLOWED_USERS = [
  "Aline",
  "Grégory",
  "Pascal",
  "Chantal",
  "Romain",
  "Joris",
  "Enola",
];

export const DEFAULT_PASSWORD = "jeveuxmanger!";

export function normaliseName(name: string): string {
  return name.trim();
}

export function isValidCredentials(name: string, password: string): boolean {
  const n = normaliseName(name);
  return ALLOWED_USERS.includes(n) && password === DEFAULT_PASSWORD;
}