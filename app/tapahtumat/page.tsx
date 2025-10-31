// app/tapahtumat/page.tsx
import { createServerClient } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  type: string | null;
  description: string | null;
};

const typeColor: Record<string, string> = {
  Talkoot: "bg-orange-100 text-orange-800",
  Tapahtuma: "bg-sky-100 text-sky-800",
  Satama: "bg-emerald-100 text-emerald-800",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fi-FI", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export default async function TapahtumatPage() {
  const supabase = createServerClient();

  // hae KAIKKI tapahtumat
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    // jos db ei vielä valmis
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tapahtumat</h1>
        <p className="text-sm text-slate-500">
          Tapahtumia ei voitu ladata juuri nyt. Kokeile hetken päästä tai tarkista Supabase.
        </p>
      </div>
    );
  }

  const now = new Date();
  const today = new Date(now.toDateString());

  const upcoming = (events || []).filter((e) => new Date(e.date) >= today);
  const past = (events || []).filter((e) => new Date(e.date) < today).reverse(); // uusin eka

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tapahtumat</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Tälle sivulle listautuvat kaikki hallintapaneelissa luodut tapahtumat. Jos jotain puuttuu,
          kirjaudu sisään ja lisää se /admin-sivulta.
        </p>
      </header>

      {/* Tulevat */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Tulevat tapahtumat</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-600">
            Ei tulevia tapahtumia juuri nyt.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {upcoming.map((event) => (
              <li
                key={event.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-500">
                    {formatDate(event.date)}
                    {event.time ? ` • ${event.time}` : null}
                  </p>
                  {event.type ? (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        typeColor[event.type] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {event.type}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{event.title}</h3>
                {event.description ? (
                  <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                ) : null}
                <p className="mt-3 text-xs font-medium text-slate-500">
                  {event.location ?? "Sindbadin satama"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Menneet */}
      {past.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Menneet tapahtumat
          </h2>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white text-sm shadow-sm ring-1 ring-slate-100">
            {past.map((event) => (
              <li key={event.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-32 shrink-0 text-xs text-slate-500">
                  {formatDate(event.date)}
                  {event.time ? <span className="block text-[11px]">{event.time}</span> : null}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{event.title}</p>
                  <p className="text-slate-500">{event.location}</p>
                </div>
                {event.type ? (
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium ${
                      typeColor[event.type] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {event.type}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
