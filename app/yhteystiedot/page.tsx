// app/yhteystiedot/page.tsx
"use client";

import { useState } from "react";

export default function YhteystiedotPage() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // tässä kohtaa voisit POSTata vaikka /api/contact -endpointtiin
    // nyt vain feikataan onnistunut lähetys
    try {
      console.log("form data", Object.fromEntries(formData.entries()));
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-600">Yhteystiedot</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ota yhteyttä Sindbadiin</h1>
        <p className="max-w-2xl text-slate-600">
          Voit ottaa yhteyttä satama-asioissa, jäsenyyksissä ja tapahtumissa. Toimisto on avoinna
          torstaisin klo 17–18 (puh. 050 4649 219).
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-[1.1fr,0.9fr]">
        {/* Lomake */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-slate-800">
                  Nimi
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white"
                  placeholder="Etunimi Sukunimi"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-slate-800">
                  Sähköposti
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white"
                  placeholder="sinä@example.fi"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="text-sm font-medium text-slate-800">
                Aihe
              </label>
              <input
                id="subject"
                name="subject"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white"
                placeholder="Esim. Laituripaikka, jäsenyys, tapahtuma..."
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-slate-800">
                Viesti
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white"
                placeholder="Kerro, miten voimme auttaa."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
            >
              Lähetä viesti
              <span aria-hidden>→</span>
            </button>

            {status === "ok" && (
              <p className="text-sm text-emerald-600">
                Kiitos viestistä! Otamme yhteyttä mahdollisimman pian.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600">
                Lähetys epäonnistui. Yritä uudelleen tai soita toimistoon.
              </p>
            )}
          </form>
        </div>

        {/* Yhteystiedot-paneeli */}
        <div className="space-y-4 rounded-2xl bg-slate-950 px-6 py-6 text-slate-50">
          <h2 className="text-lg font-semibold">Sijainti & toimisto</h2>
          <p className="text-sm text-slate-200">
            Pursiseura Sindbad ry
            <br />
            Lohiapajanlahti, Lauttasaari, Helsinki
          </p>
          <div className="rounded-xl bg-slate-900/50 p-4 text-sm">
            <p className="text-slate-200">Toimisto avoinna</p>
            <p className="text-sm font-medium text-white">Torstaisin klo 17–18</p>
            <p className="mt-2 text-sm text-slate-200">Puhelin: 050 4649 219</p>
            <p className="text-sm text-slate-200">Sähköposti: info@sindbad.fi</p>
          </div>
          <p className="text-sm text-slate-200">
            Satamaan liittyvissä asioissa voit olla yhteydessä myös suoraan satamakapteenin
            numeroon.
          </p>
          <a
            href="https://maps.app.goo.gl/"
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-200 hover:text-white"
          >
            Avaa sijainti kartalla →
          </a>
        </div>
      </section>
    </div>
  );
}
