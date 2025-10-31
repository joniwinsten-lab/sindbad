// app/satama/page.tsx
import Link from "next/link";

const infoCards = [
  {
    title: "Laituripaikat",
    desc: "Paikat ovat ensisijaisesti seuran jäsenille. Vapautuvista paikoista tiedotetaan toimiston kautta.",
  },
  {
    title: "Sähkö & vesi",
    desc: "Laitureilla on rajallinen sähkönkäyttömahdollisuus. Sähköstä ja käytöstä ohjeistaa satamakapteeni.",
  },
  {
    title: "Vierailijat",
    desc: "Vierailu satamassa on mahdollista sopimalla etukäteen. Ota yhteys satamakapteenin numeroon.",
  },
];

const mooringRules = [
  "Laituripaikka on henkilökohtainen eikä sitä saa luovuttaa edelleen ilman seuran lupaa.",
  "Veneen on oltava ilmoitettua kokoluokkaa – muutoksista ilmoitettava.",
  "Kaikki veneet vakuutettuina.",
  "Satama-alueella noudatetaan seuran järjestyssääntöjä.",
];

export default function SatamaPage() {
  return (
    <div className="space-y-10">
      {/* Hero / otsikko */}
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-600">Satama</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Satama Lohiapajanlahdella, Lauttasaaressa
        </h1>
        <p className="max-w-2xl text-slate-600">
          Sindbadin satama sijaitsee Lauttasaaren itärannalla, suojaisassa Lohiapajanlahdessa. Satama
          palvelee seuran jäseniä ja toimii kotisatamana seuran veneille.
        </p>
      </header>

      {/* Kortit */}
      <section className="grid gap-6 md:grid-cols-3">
        {infoCards.map((card) => (
          <div key={card.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* Hinnat / käytännöt */}
      <section className="grid gap-8 md:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Laituripaikkojen käyttö</h2>
          <p className="text-sm text-slate-600">
            Laituripaikat ovat seuran hallinnoimia. Hinnasto vahvistetaan aina vuosikokouksessa ja
            hinnat voivat vaihdella paikan koon ja sijainnin mukaan. Ajantasainen tieto ja
            mahdolliset vapaat paikat saat satamakapteenilta tai seuran toimistolta.
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Tällä hetkellä:</p>
            <p className="mt-1">
              Paikat lähes täynnä / rajoitetusti. Kysy toimistolta torstaisin klo 17–18 (puh. 050
              4649 219).
            </p>
          </div>
          <h3 className="mt-6 text-sm font-semibold text-slate-900">
            Yleiset satamasäännöt (tiivistelmä)
          </h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {mooringRules.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Kartta / sijainti */}
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Sijainti & yhteystiedot</h2>
          <p className="text-sm text-slate-600">
            Lohiapajanlahti, Lauttasaari, Helsinki. Ajo satama-alueelle seuralaisten ohjeiden
            mukaisesti.
          </p>
          <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Satamakapteeni</p>
            <p className="text-sm text-slate-600">puh. 050 4649 219</p>
            <p className="text-sm text-slate-600">torstaisin klo 17–18</p>
          </div>
          <Link
            href="https://www.google.com/maps/@60.1554245,24.8876536,19.15z?entry=ttu&g_ep=EgoyMDI1MTAyOC4wIKXMDSoASAFQAw%3D%3D"
            className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Avaa kartta
            <span aria-hidden>→</span>
          </Link>
          <p className="text-xs text-slate-400">
            Korvaa yllä oleva linkki oikealla Google Maps -osoitteella satamastanne.
          </p>
        </div>
      </section>
    </div>
  );
}
