export default function TapahtumatPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Tapahtumat</h1>
      <p className="text-slate-600">
        Tälle sivulle listataan kevättalkoot, purjehduskauden avaus, koulutukset ja muut ajankohtaiset.
      </p>
      <ul className="space-y-2">
        <li className="rounded-md bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold">Esimerkkitapahtuma</h2>
          <p className="text-sm text-slate-600">Päivä, kellonaika, paikka.</p>
        </li>
      </ul>
    </div>
  );
}
