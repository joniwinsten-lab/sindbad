// app/seura/page.tsx
import { createServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function SeuraPage() {
  const supabase = createServerClient();

  const { data: board } = await supabase
    .from("board_members")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const { data: officers } = await supabase
    .from("officers")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-600">Seura</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pursiseura Sindbad ry</h1>
        <p className="max-w-2xl text-slate-600">
          Sindbad on Helsingin Lauttasaaren itärannalla toimiva pursiseura. Seura ylläpitää satamaa,
          järjestää tapahtumia ja tarjoaa jäsenilleen kotisataman sekä veneily-yhteisön.
        </p>
      </header>

      {/* Hallitus */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Hallitus</h2>
        <p className="text-sm text-slate-600">
          Hallitus valitaan vuosikokouksessa. Alla oleva lista päivittyy hallintapaneelista.
        </p>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Nimi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tehtävä
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Yhteys
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(board || []).map((person) => (
                <tr key={person.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-900">{person.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{person.role}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {person.email ? (
                      <a
                        href={`mailto:${person.email}`}
                        className="text-sm font-medium text-sky-600 hover:text-sky-800"
                      >
                        {person.email}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {(board || []).length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-sm text-slate-400">
                    Hallitusta ei ole vielä lisätty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Toimihenkilöt */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Toimihenkilöt</h2>
        <p className="text-sm text-slate-600">
          Satama-asioissa ja jäsenyyksissä ota mieluiten suoraan yhteyttä oikeaan henkilöön.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {(officers || []).map((p) => (
            <li key={p.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-900">{p.name}</p>
              {p.responsibility ? <p className="text-sm text-slate-600">{p.responsibility}</p> : null}
              {p.contact ? <p className="mt-2 text-sm text-slate-700">{p.contact}</p> : null}
            </li>
          ))}
          {(officers || []).length === 0 && (
            <li className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-400">
              Ei toimihenkilöitä lisättynä.
            </li>
          )}
        </ul>
      </section>

      {/* Jäsenyys-boksi voidaan jättää ennalleen */}
      <section className="rounded-2xl bg-slate-900 px-6 py-7 text-slate-50">
        <h2 className="text-lg font-semibold">Jäseneksi Sindbadiin</h2>
        <p className="mt-2 text-sm text-slate-200">
          Seura ottaa uusia jäseniä resurssien ja satamapaikkojen puitteissa. Voit lähettää
          liittymispyynnön yhteydenottolomakkeella tai sähköpostitse.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/yhteystiedot"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950"
          >
            Lähetä liittymispyyntö
          </a>
          <a
            href="/satama"
            className="rounded-lg border border-slate-200/30 px-4 py-2 text-sm font-medium text-slate-50"
          >
            Katso sataman tilanne
          </a>
        </div>
        <p className="mt-3 text-xs text-slate-300">
          Muista liittää veneen perustiedot (pituus, leveys, syvyys) jos haet paikkaa.
        </p>
      </section>
    </div>
  );
}
