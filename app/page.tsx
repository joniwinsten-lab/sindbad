// app/page.tsx
export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-sky-100 to-sky-50 px-8 py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">
          Pursiseura Sindbad ry
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Tervetuloa Sindbadin sivuille
        </h1>
        <p className="mt-4 max-w-2xl text-slate-700">
          Sindbad on Helsingin Lauttasaaren itärannalla toimiva pursiseura. Sivuilta löydät
          tietoa seurasta, satamasta, tapahtumista ja jäsenyydestä.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href="/tapahtumat"
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Katso tapahtumat
          </a>
          <a
            href="/yhteystiedot"
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Yhteystiedot
          </a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Satama Lauttasaaressa</h2>
          <p className="mt-2 text-sm text-slate-600">
            Suojaisa satama Lohiapajanlahdella. Laituripaikkojen tilanteesta saat tiedon satamakapteeneilta.
          </p>
          <a href="/satama" className="mt-3 inline-block text-sm font-medium text-sky-600">
            Lue lisää →
          </a>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Pursiseuramme</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sindbadin historia, toiminta ja miten liityt jäseneksi.
          </p>
          <a href="/seura" className="mt-3 inline-block text-sm font-medium text-sky-600">
            Seuran tiedot →
          </a>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Toimisto</h2>
          <p className="mt-2 text-sm text-slate-600">
            Toimisto avoinna torstaisin klo 17–18. Puh. 050 4649 219.
          </p>
          <a href="/yhteystiedot" className="mt-3 inline-block text-sm font-medium text-sky-600">
            Ota yhteyttä →
          </a>
        </div>
      </section>
    </div>
  );
}
