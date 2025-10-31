// app/page.tsx
import Link from "next/link";
import { getSiteSettings } from "@/lib/siteSettings";

const features = [
  {
    title: "Satama Lauttasaaressa",
    desc: "Suojaisa sijainti Lohiapajanlahdella. Laituripaikat jäsenille.",
    href: "/satama",
  },
  {
    title: "Tapahtumat & talkoot",
    desc: "Kevättalkoot, kauden avaus ja muut tapahtumat.",
    href: "/tapahtumat",
  },
  {
    title: "Liity jäseneksi",
    desc: "Aktiivinen mutta pieni seura – yhteys on nopea.",
    href: "/seura",
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-950 via-sky-800 to-sky-500 px-6 py-16 text-white md:px-10">
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
              Sindbad on Lauttasaaren itärannalla toimiva pursiseura. Sivuilta löydät ajantasaiset
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
              {settings?.office_hours
                ? `Toimisto: ${settings.office_hours}`
                : "Toimisto torstaisin klo 17–18"}
              {settings?.phone ? ` • Puh. ${settings.phone}` : " • Puh. 050 4649 219"}
            </p>
          </div>

          {/* oikean reunan kortti */}
          <div className="w-full max-w-sm rounded-2xl bg-slate-950/20 p-5 backdrop-blur md:w-80">
            <h2 className="text-sm font-semibold">Satamatilanne</h2>
            <p className="mt-1 text-xs text-sky-50/70">
              {settings?.harbor_status
                ? settings.harbor_status
                : "Paikat lähes täynnä / rajoitetusti – kysy satamakapteenilta."}
            </p>
            <div className="mt-4 space-y-3">
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

      {/* PALVELUT */}
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
    </div>
  );
}
