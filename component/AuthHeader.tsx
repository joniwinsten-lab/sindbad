"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export function AuthHeaderNav() {
  const supabase = createClient();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
  }, [supabase]);

  return loggedIn ? (
    <Link
      href="/admin"
      className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700"
    >
      Hallintapaneeli
    </Link>
  ) : (
    <Link
      href="/login"
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
    >
      Kirjaudu
    </Link>
  );
}
