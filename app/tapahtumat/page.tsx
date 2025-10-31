// app/tapahtumat/page.tsx
const events = [
    {
      title: "Kevättalkoot satamassa",
      date: "2026-05-09",
      time: "10:00–13:00",
      location: "Sindbadin satama, Lauttasaari",
      type: "Talkoot",
      desc: "Siivotaan laiturit ja nostetaan kausivarusteet esille. Kahvit ja pullat seuralta.",
    },
    {
      title: "Purjehduskauden avaus",
      date: "2026-05-23",
      time: "18:00",
      location: "Seuran maja / satama",
      type: "Tapahtuma",
      desc: "Kauden avaus ja tervehdys hallitukselta. Sään salliessa pienimuotoinen venekisa.",
    },
    {
      title: "Jäsensäilöt ja satamakierros",
      date: "2026-06-06",
      time: "17:00",
      location: "Satama",
      type: "Satama",
      desc: "Käydään läpi sataman ajankohtaiset ja laituripaikat.",
    },
    // voit lisätä tähän helposti lisää
  ];
  
  // pieni apuformatti
  function formatDate(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00"); // varmistetaan ilman aikavyöhykehässäkkää
    return date.toLocaleDateString("fi-FI", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  }
  
  const typeColor: Record<string, string> = {
    Talkoot: "bg-orange-100 text-orange-800",
    Tapahtuma: "bg-sky-100 text-sky-800",
    Satama: "bg-emerald-100 text-emerald-800",
  };
  
  export default function TapahtumatPage() {
    const now = new Date();
    const upcoming = events
      .filter((e) => new Date(e.date) >= new Date(now.toDateString()))
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  
    const past = events
      .filter((e) => new Date(e.date) < new Date(now.toDateString()))
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  
    return (
      <div className="space-y-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tapahtumat</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Tälle sivulle päivitetään Sindbadin ajankohtaiset tapahtumat, talkoot ja sataman
            ilmoitukset. Jos jokin puuttuu, ota yhteyttä toimistoon (to 17–18).
          </p>
        </header>
  
        {/* Tulevat tapahtumat */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Tulevat tapahtumat</h2>
          {upcoming.length === 0 ? (
            <p className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-600">
              Ei tulevia tapahtumia julkaistuna juuri nyt. Tarkista myöhemmin tai kysy toimistolta.
            </p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {upcoming.map((event) => (
                <li
                  key={event.title + event.date}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-500">
                      {formatDate(event.date)}
                      {event.time ? ` • ${event.time}` : null}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        typeColor[event.type] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{event.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{event.desc}</p>
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    {event.location ?? "Tarkentuu"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
  
        {/* Menneet tapahtumat */}
        {past.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Menneet tapahtumat
            </h2>
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white text-sm shadow-sm ring-1 ring-slate-100">
              {past.map((event) => (
                <li key={event.title + event.date} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-32 shrink-0 text-xs text-slate-500">
                    {formatDate(event.date)}
                    {event.time ? <span className="block text-[11px]">{event.time}</span> : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{event.title}</p>
                    <p className="text-slate-500">{event.location}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium ${
                      typeColor[event.type] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {event.type}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }
  