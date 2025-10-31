// app/satama/page.tsx
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function SatamaPage() {
  const supabase = createServerClient();

  // perussisältö
  const { data: harbor } = await supabase
    .from("harbor_page")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // kortit
  const { data: cards } = await supabase
    .from("harbor_feature_cards")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // säännöt
  const { data: rules } = await supabase
    .from("harbor_rules")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // fallback-yhteystiedot site_settingsistä
  const { data: settings } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-600">Satama</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {harbor?.title ?? "Satama Lohiapajanlahdella, Lauttasaaressa"}
        </h1>
        <p className="max-w-2xl text-slate-600">
          {harbor?.intro ??
            "Sindbadin satama sijaitsee Lauttasaaren itärannalla, suojaisassa Lohiapajanlahdessa. Satama palvelee seuran jäseniä ja toimii kotisatamana seuran veneille."}
        </p>
      </header>

      {/* kortit */}
      <section className="grid gap-6 md:grid-cols-3">
        {(cards || []).length > 0
          ? cards!.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <h2 className="text-base font-semibold text-slate-900">{card.title}</h2>
                {card.body ? <p className="mt-2 text-sm text-slate-600">{card.body}</p> : null}
              </div>
            ))
          : [
              {
                title: "Laituripaikat",
                body: "Paikat ovat ensisijaisesti seuran jäsenille. Vapautuvista paikoista tiedotetaan toimiston kautta.",
              },
              {
                title: "Sähkö & vesi",
                body: "Laitureilla on rajallinen sähkönkäyttömahdollisuus. Sähköstä ohjeistaa satamakapteeni.",
              },
              {
                title: "Vierailijat",
                body: "Vierailu satamassa on mahdollista sopimalla etukäteen.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-base font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{card.body}</p>
              </div>
            ))}
      </section>

      {/* kaksi palstaa */}
      <section className="grid gap-8 md:grid-cols-[1.2fr,0.8fr]">
        {/* vasen: säännöt */}
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Laituripaikkojen käyttö</h2>
          <p className="text-sm text-slate-600">
            Laituripaikat ovat seuran hallinnoimia. Hinnasto vahvistetaan vuosikokouksessa ja hinnat
            voivat vaihdella paikan koon ja sijainnin mukaan. Ajantasainen tieto saat
            satamakapteenilta tai seuran toimistolta.
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Sataman tilanne juuri nyt:</p>
            <p className="mt-1">
              {settings?.harbor_status
                ? settings.harbor_status
                : "Paikat lähes täynnä / rajoitetusti. Kysy toimistolta torstaisin."}
            </p>
          </div>
          <h3 className="mt-6 text-sm font-semibold text-slate-900">Yleiset satamasäännöt</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {(rules || []).length > 0
              ? rules!.map((rule) => (
                  <li key={rule.id} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>{rule.text}</span>
                  </li>
                ))
              : [
                  "Laituripaikka on henkilökohtainen eikä sitä saa luovuttaa edelleen ilman seuran lupaa.",
                  "Veneen on oltava ilmoitettua kokoluokkaa – muutoksista ilmoitettava.",
                  "Kaikki veneet vakuutettuina.",
                  "Satama-alueella noudatetaan seuran järjestyssääntöjä.",
                ].map((rule) => (
                  <li key={rule} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>{rule}</span>
                  </li>
                ))}
          </ul>
        </div>

        {/* oikea: yhteys + kartta */}
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Sijainti & yhteystiedot</h2>
          <p className="text-sm text-slate-600">
            {harbor?.location ?? "Lohiapajanlahti, Lauttasaari, Helsinki."}
          </p>
          <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Satamakapteeni / toimisto</p>
            <p className="text-sm text-slate-600">
              {settings?.phone ? settings.phone : "puh. 050 4649 219"}
            </p>
            <p className="text-sm text-slate-600">
              {settings?.office_hours ? settings.office_hours : "torstaisin klo 17–18"}
            </p>
            {settings?.email ? <p className="text-sm text-slate-600">{settings.email}</p> : null}
          </div>
          <Link
            href={harbor?.map_url || "https://maps.app.goo.gl/"}
            className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Avaa kartta →
          </Link>
          <p className="text-xs text-slate-400">
            Voit päivittää karttalinkin adminissa Satama-sivu -kohdasta.
          </p>
        </div>
      </section>
    </div>
  );
}
