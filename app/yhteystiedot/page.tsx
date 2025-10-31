export default function YhteystiedotPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Yhteystiedot</h1>
      <p className="text-slate-600">
        Sindbadin toimisto avoinna torstaisin klo 17–18. Puhelin 050 4649 219.
      </p>
      <p className="text-slate-600">
        Voit olla yhteydessä myös sähköpostitse: info@sindbad.fi (vaihda oikeaan).
      </p>
      <div className="rounded-md bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold">Sijainti</h2>
        <p className="text-sm text-slate-600">
          Lohiapajanlahti, Lauttasaaren itäranta, Helsinki.
        </p>
        <p className="text-sm text-slate-600">
          Katso reitti kartalla →
        </p>
      </div>
    </div>
  );
}
