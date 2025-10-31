// app/page.tsx
import Link from "next/link";

const features = [
  {
    title: "Satama Lauttasaaressa",
    desc: "Suojaisa sijainti Lohiapajanlahdella. Laituripaikat jäsenille, lisätietoa satamakapteenilta.",
    href: "/satama",
  },
  {
    title: "Tapahtumat & talkoot",
    desc: "Kevättalkoot, kauden avaus ja muut tapahtumat. Pidetään laitureista ja veneistä huolta yhdessä.",
    href: "/tapahtumat",
  },
  {
    title: "Liity jäseneksi",
    desc: "Sindbad on aktiivinen, mutta pieni seura – siksi yhteys on nopea ja päätöksenteko ketterää.",
    href: "/seura",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-950 via-sky-800 to-sky-500 px-6 py-16 text-white md:px-10">
        {/* koriste-ellipsi */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-100/80">
              Pursiseura Sindbad ry
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Meri, yhteisö ja hyvä satama <span className="text-sky-200">Lauttasaaressa.</span>
            </h1>
            <p className="max-w-xl text-sky-50/80">
              Sindbad on Lauttasaaren itärannalla toimiva pursiseura. Sivuiltamme löydät ajantasaiset
              tiedot satamasta, laituripaikoista, tapahtumista ja jäsenyydestä.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tapahtumat"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-sky-950 shadow-sm transition hover:bg-slate-50"
              >
                Katso tulevat tapahtumat
              </Link>
              <Link
                href="/yhteystiedot"
                className="rounded-xl border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Ota yhteyttä
              </Link>
            </div>
            <p className="text-xs text-sky-50/60">
              Toimisto torstaisin klo 17–18 • Puh. 050 4649 219
            </p>
          </div>
          {/* oikean reunan kortti */}
          <div className="w-full max-w-sm rounded-2xl bg-slate-950/20 p-5 backdrop-blur md:w-80">
            <h2 className="text-sm font-semibold">Satamatilanne</h2>
            <p className="mt-1 text-xs text-sky-50/70">
              Laituripaikat täynnä / rajoitetusti – ota yhteys satamakapteenilta.
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-slate-950/30 px-4 py-3">
                <p className="text-xs text-sky-50/60">Vierailijat</p>
                <p className="text-sm font-medium">Sovi etukäteen</p>
              </div>
              <div className="rounded-lg bg-slate-950/30 px-4 py-3">
                <p className="text-xs text-sky-50/60">Sijainti</p>
                <p className="text-sm font-medium">Lohiapajanlahti, Lauttasaari</p>
              </div>
            </div>
            <Link
              href="/satama"
              className="mt-4 inline-flex items-center text-xs font-medium text-sky-50/80 hover:text-white"
            >
              Sataman lisätiedot →
            </Link>
          </div>
        </div>
      </section>

      {/* PALVELUT / OSIOT */}
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Mitä löydät Sindbadilta
            </h2>
            <p className="text-sm text-slate-500">
              Satama, toimisto, tapahtumat ja jäsenyys samassa paikassa.
            </p>
          </div>
          <Link href="/seura" className="text-sm font-medium text-sky-700 hover:text-sky-900">
            Lue seurasta →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              <Link href={f.href} className="mt-4 inline-block text-sm font-medium text-sky-600">
                Lue lisää →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl rounded-2xl bg-slate-900 px-6 py-10 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Haluatko mukaan toimintaan?</h2>
            <p className="text-sm text-slate-200">
              Laita viestiä toimistoon niin kerromme jäsenyydestä ja paikkatilanteesta.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/yhteystiedot"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950"
            >
              Yhteystiedot
            </Link>
            <Link
              href="/tapahtumat"
              className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white"
            >
              Tapahtumat
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
