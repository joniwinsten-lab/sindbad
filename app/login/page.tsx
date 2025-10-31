"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // luodaan client tässä, jotta varmasti on olemassa
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  // jos näitä ei ole, näytetään heti virhe
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">
            Supabase-ympäristömuuttujat puuttuvat. Lisää NEXT_PUBLIC_SUPABASE_URL ja
            NEXT_PUBLIC_SUPABASE_ANON_KEY.
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // kirjautuminen ok → adminiin
    router.push("/admin");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-lg font-semibold text-slate-900">Kirjaudu hallintaan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Syötä se sähköposti ja salasana, jonka loit Supabasen kautta.
        </p>

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
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white"
              placeholder="sinä@example.fi"
              autoComplete="email"
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
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>
        </form>
      </div>
    </div>
  );
}
