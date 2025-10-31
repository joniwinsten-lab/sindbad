"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [debug, setDebug] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">
            NEXT_PUBLIC_SUPABASE_URL tai NEXT_PUBLIC_SUPABASE_ANON_KEY puuttuu.
          </p>
        </div>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDebug(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    // näytetään kaikki
    setDebug({ data, error });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // jos ei virhettä, mutta ei sessiota → todennäköisesti email ei vahvistettu
    if (!data.session) {
      setError("Kirjautuminen onnistui, mutta istuntoa ei luotu. Onko käyttäjä vahvistettu?");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-lg font-semibold text-slate-900">Kirjaudu hallintaan</h1>
        <p className="mt-1 text-sm text-slate-500">Käytä Supabasessa luotuja tunnuksia.</p>

        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="email">
              Sähköposti
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="password">
              Salasana
            </label>
            <input
              id="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-70"
          >
            {loading ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>
        </form>

        {debug ? (
          <pre className="mt-4 max-h-40 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
{JSON.stringify(debug, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
