"use client"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

export default function LoginModal() {
  const { user, login } = useAuth()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const ok = await login(name, password)
    setLoading(false)
    if (!ok) setError("Identifiants invalides. Vérifiez le prénom et le mot de passe.")
  }

  return (
    <div className="absolute inset-0 z-20 flex items-start justify-center bg-gradient-to-br from-slate-900/30 via-slate-700/20 to-slate-900/30 backdrop-blur-sm p-4 pt-[clamp(2rem,calc(35svh+2rem),60svh)]">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg border border-slate-200">
        <h2 className="mb-1 text-center text-2xl font-semibold text-slate-800">Bienvenue chez vous :)</h2>
        <p className="mb-4 text-center text-sm text-slate-500">Veuillez saisir vos identifiants.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Prénom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-sky-600 px-3 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  )
}