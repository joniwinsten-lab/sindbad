"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  date: string;
  time?: string | null;
  location?: string | null;
  type?: string | null;
  description?: string | null;
};

type Settings = {
  id: string;
  office_hours: string | null;
  phone: string | null;
  email: string | null;
  harbor_status: string | null;
};

type BoardMember = {
  id: string;
  name: string;
  role: string;
  email: string | null;
  sort_order: number | null;
};

type Officer = {
  id: string;
  name: string;
  responsibility: string | null;
  contact: string | null;
  sort_order: number | null;
};

export default function AdminPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [board, setBoard] = useState<BoardMember[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [admins, setAdmins] = useState<
    { id: string; email: string | null; role: string | null }[]
  >([]);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "settings" | "governance" | "harbor" | "users"
  >("dashboard");

  useEffect(() => {
    async function load() {
      const { data: evts } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      const { data: sets } = await supabase.from("site_settings").select("*").limit(1).single();

      const { data: boardData } = await supabase
        .from("board_members")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      const { data: officerData } = await supabase
        .from("officers")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      // admin-käyttäjät
      const { data: adminsData } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("role", "admin")
        .order("email", { ascending: true });

      setEvents(evts || []);
      setSettings(sets || null);
      setBoard(boardData || []);
      setOfficers(officerData || []);
      setAdmins(adminsData || []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  // tapahtuma: lisää
  async function addEvent(formData: FormData) {
    const newEvent = {
      title: String(formData.get("title") || ""),
      date: String(formData.get("date") || ""),
      time: String(formData.get("time") || "") || null,
      location: String(formData.get("location") || "") || null,
      type: String(formData.get("type") || "") || null,
      description: String(formData.get("description") || "") || null,
    };
    const { data, error } = await supabase.from("events").insert(newEvent).select().single();
    if (!error && data) {
      setEvents((prev) => [...prev, data].sort((a, b) => a.date.localeCompare(b.date)));
    }
  }

  // tapahtuma: poista
  async function deleteEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  // admin: lisää
  async function addAdminUser(fd: FormData) {
    const emailRaw = fd.get("email");
    if (!emailRaw) return;
    const email = String(emailRaw).trim().toLowerCase();

    // onko jo profiilia tällä emaililla?
    const { data: existing } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      const { data } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", existing.id)
        .select()
        .single();

      if (data) {
        setAdmins((prev) => {
          const filtered = prev.filter((a) => a.id !== data.id);
          return [...filtered, data].sort((a, b) => (a.email || "").localeCompare(b.email || ""));
        });
      }
    } else {
      // luodaan pelkkä profiili – user kirjautuu myöhemmin
      const { data } = await supabase
        .from("profiles")
        .insert({ email, role: "admin" })
        .select()
        .single();

      if (data) {
        setAdmins((prev) =>
          [...prev, data].sort((a, b) => (a.email || "").localeCompare(b.email || "")),
        );
      }
    }
  }

  // admin: poista
  async function removeAdminUser(id: string) {
    const { data } = await supabase
      .from("profiles")
      .update({ role: "user" })
      .eq("id", id)
      .select()
      .single();

    if (data) {
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    }
  }

  // asetukset: tallenna
  async function updateSettings(formData: FormData) {
    const payload = {
      office_hours: String(formData.get("office_hours") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      harbor_status: String(formData.get("harbor_status") || ""),
    };

    if (settings?.id) {
      await supabase.from("site_settings").update(payload).eq("id", settings.id);
      setSettings({ ...settings, ...payload });
    } else {
      const { data } = await supabase.from("site_settings").insert(payload).select().single();
      if (data) setSettings(data);
    }
  }

  // hallitus: lisää
  async function addBoardMember(fd: FormData) {
    const payload = {
      name: String(fd.get("name") || ""),
      role: String(fd.get("role") || ""),
      email: String(fd.get("email") || "") || null,
      sort_order: Number(fd.get("sort_order") || 0),
    };
    const { data, error } = await supabase.from("board_members").insert(payload).select().single();
    if (!error && data) {
      setBoard((prev) =>
        [...prev, data].sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
        ),
      );
    }
  }

  // hallitus: poista
  async function deleteBoardMember(id: string) {
    await supabase.from("board_members").delete().eq("id", id);
    setBoard((prev) => prev.filter((b) => b.id !== id));
  }

  // toimihenkilö: lisää
  async function addOfficer(fd: FormData) {
    const payload = {
      name: String(fd.get("name") || ""),
      responsibility: String(fd.get("responsibility") || "") || null,
      contact: String(fd.get("contact") || "") || null,
      sort_order: Number(fd.get("sort_order") || 0),
    };
    const { data, error } = await supabase.from("officers").insert(payload).select().single();
    if (!error && data) {
      setOfficers((prev) =>
        [...prev, data].sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name),
        ),
      );
    }
  }

  // toimihenkilö: poista
  async function deleteOfficer(id: string) {
    await supabase.from("officers").delete().eq("id", id);
    setOfficers((prev) => prev.filter((o) => o.id !== id));
  }

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">Ladataan hallintaa…</p>;
  }

  return (
    <div className="flex gap-6">
      {/* SIDEBAR */}
      <aside className="sticky top-6 h-[calc(100vh-3rem)] w-56 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Admin</p>
          <p className="text-sm font-semibold text-slate-900">Pursiseura Sindbad</p>
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
              activeTab === "dashboard"
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
              activeTab === "settings"
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Seuran tiedot</span>
          </button>
          <button
            onClick={() => setActiveTab("governance")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
              activeTab === "governance"
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Hallitus & toimihenkilöt</span>
          </button>
          <button
            onClick={() => setActiveTab("harbor")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
              activeTab === "harbor"
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Satama-sivu</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
              activeTab === "users"
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Käyttäjät</span>
          </button>
        </nav>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="text-sm text-slate-400 hover:text-slate-700"
          >
            Kirjaudu ulos
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 space-y-10">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <header className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">
                  Luo tapahtumia ja pidä ajankohtaiset asiat esillä.
                </p>
              </div>
            </header>

            <section className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
              {/* lista */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-base font-semibold text-slate-900">Tapahtumat</h2>
                <p className="text-sm text-slate-500">Lista kaikista tapahtumista.</p>
                <ul className="mt-4 space-y-3">
                  {events.map((evt) => (
                    <li
                      key={evt.id}
                      className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{evt.title}</p>
                        <p className="text-xs text-slate-500">
                          {evt.date} {evt.time ? `• ${evt.time}` : ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          {evt.location} {evt.type ? `• ${evt.type}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteEvent(evt.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Poista
                      </button>
                    </li>
                  ))}
                  {events.length === 0 && (
                    <p className="text-xs text-slate-400">Ei tapahtumia.</p>
                  )}
                </ul>
              </div>

              {/* uusi */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Lisää tapahtuma</h3>
                <form
                  className="mt-4 space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    await addEvent(fd);
                    e.currentTarget.reset();
                  }}
                >
                  <input
                    name="title"
                    required
                    placeholder="Esim. Kevättalkoot"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="time"
                    placeholder="esim. 10:00–13:00"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="location"
                    placeholder="Satama"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="type"
                    placeholder="Talkoot / Tapahtuma / Satama"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Lyhyt kuvaus"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700"
                  >
                    Tallenna tapahtuma
                  </button>
                </form>
              </div>
            </section>
          </>
        )}

        {/* SEURAN TIEDOT */}
        {activeTab === "settings" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Seuran tiedot</h2>
            <p className="text-sm text-slate-500">
              Päivitä toimistoaika, puhelin ja sataman tilanne.
            </p>
            <form
              className="mt-4 grid gap-4 md:grid-cols-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await updateSettings(fd);
              }}
            >
              <div>
                <label className="text-sm font-medium text-slate-800">Toimistoaika</label>
                <input
                  name="office_hours"
                  defaultValue={settings?.office_hours ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">Puhelin</label>
                <input
                  name="phone"
                  defaultValue={settings?.phone ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">Sähköposti</label>
                <input
                  name="email"
                  defaultValue={settings?.email ?? ""}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">Sataman tilanne</label>
                <input
                  name="harbor_status"
                  defaultValue={settings?.harbor_status ?? ""}
                  placeholder="Esim. Paikat täynnä / Rajoitetusti"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                >
                  Tallenna
                </button>
              </div>
            </form>
          </section>
        )}

        {/* HALLITUS */}
        {activeTab === "governance" && (
          <section className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Hallitus & toimihenkilöt</h2>
              <p className="text-sm text-slate-500">
                Lisää ja muokkaa hallituksen jäseniä ja toimihenkilöitä. Näkyy julkisella /seura -sivulla.
              </p>
            </div>

            {/* Hallitus */}
            <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Hallituksen jäsenet</h3>
                <ul className="mt-3 space-y-2">
                  {board.map((person) => (
                    <li
                      key={person.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{person.name}</p>
                        <p className="text-xs text-slate-500">
                          {person.role}
                          {person.email ? ` • ${person.email}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteBoardMember(person.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Poista
                      </button>
                    </li>
                  ))}
                  {board.length === 0 && (
                    <p className="text-xs text-slate-400">Ei hallituksen jäseniä vielä.</p>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900">Lisää hallituksen jäsen</h4>
                <form
                  className="mt-3 space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    await addBoardMember(fd);
                    e.currentTarget.reset();
                  }}
                >
                  <input
                    name="name"
                    required
                    placeholder="Nimi"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="role"
                    required
                    placeholder="Tehtävä (esim. Puheenjohtaja)"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Sähköposti"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="sort_order"
                    type="number"
                    placeholder="Järjestys (pienin ensin)"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700"
                  >
                    Lisää
                  </button>
                </form>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Toimihenkilöt */}
            <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Toimihenkilöt</h3>
                <ul className="mt-3 space-y-2">
                  {officers.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.name}</p>
                        {p.responsibility ? (
                          <p className="text-xs text-slate-500">{p.responsibility}</p>
                        ) : null}
                        {p.contact ? (
                          <p className="text-xs text-slate-500">
                            {p.contact.startsWith("0") || p.contact.startsWith("+") ? "Puh. " : ""}
                            {p.contact}
                          </p>
                        ) : null}
                      </div>
                      <button
                        onClick={() => deleteOfficer(p.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Poista
                      </button>
                    </li>
                  ))}
                  {officers.length === 0 && (
                    <p className="text-xs text-slate-400">Ei toimihenkilöitä vielä.</p>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900">Lisää toimihenkilö</h4>
                <form
                  className="mt-3 space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    await addOfficer(fd);
                    e.currentTarget.reset();
                  }}
                >
                  <input
                    name="name"
                    required
                    placeholder="Nimi"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="responsibility"
                    placeholder="Vastuu (esim. Satamakapteeni)"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="contact"
                    placeholder="Yhteys (puh. tai email)"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    name="sort_order"
                    type="number"
                    placeholder="Järjestys"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700"
                  >
                    Lisää
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* SATAMA */}
        {activeTab === "harbor" && (
          <section className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Satama-sivu</h2>
              <p className="text-sm text-slate-500">
                Päivitä /satama -sivun sisältö: otsikko, ingressi, kortit ja säännöt.
              </p>
            </div>
            <HarborContentEditor />
          </section>
        )}

        {/* KÄYTTÄJÄT */}
        {activeTab === "users" && (
          <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Käyttäjät / ylläpitäjät</h2>
              <p className="text-sm text-slate-500">
                Täältä voit lisätä uusia käyttäjiä, joilla on oikeus muokata sivuston sisältöä.
              </p>
            </div>

            {/* lista admineista */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Nykyiset adminit</h3>
              <ul className="space-y-2">
                {admins.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{user.email ?? "–"}</p>
                      <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                    <button
                      onClick={() => removeAdminUser(user.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Poista admin
                    </button>
                  </li>
                ))}
                {admins.length === 0 && (
                  <p className="text-xs text-slate-400">Ei admin-käyttäjiä vielä.</p>
                )}
              </ul>
            </div>

            {/* lomake */}
            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Lisää uusi admin</h3>
              <p className="mb-3 text-xs text-slate-500">
                Kirjoita sähköposti. Jos profiilia ei ole vielä, luomme admin-profiilin ja käyttäjä
                voi kirjautua myöhemmin samalla osoitteella.
              </p>
              <form
  className="flex flex-col gap-3 md:flex-row"
  onSubmit={async (e) => {
    e.preventDefault();
    const form = e.currentTarget;           // talteen ennen awaitia
    const fd = new FormData(form);
    await addAdminUser(fd);
    form.reset();                           // nyt se ei ole null
  }}
>

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="esim. hallitus@sindbad.fi"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                >
                  Lisää
                </button>
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* Satama-editori – sama kuin aiemmin */
function HarborContentEditor() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<{
    id: string;
    title: string | null;
    intro: string | null;
    location: string | null;
    map_url: string | null;
  } | null>(null);
  const [cards, setCards] = useState<
    { id: string; title: string; body: string | null; sort_order: number | null }[]
  >([]);
  const [rules, setRules] = useState<
    { id: string; text: string; sort_order: number | null }[]
  >([]);

  useEffect(() => {
    async function load() {
      const { data: harbor } = await supabase
        .from("harbor_page")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: featureCards } = await supabase
        .from("harbor_feature_cards")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      const { data: harborRules } = await supabase
        .from("harbor_rules")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      setPage(harbor || null);
      setCards(featureCards || []);
      setRules(harborRules || []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function savePage(fd: FormData) {
    const payload = {
      title: String(fd.get("title") || ""),
      intro: String(fd.get("intro") || ""),
      location: String(fd.get("location") || ""),
      map_url: String(fd.get("map_url") || ""),
    };
    if (page?.id) {
      const { data } = await supabase
        .from("harbor_page")
        .update(payload)
        .eq("id", page.id)
        .select()
        .single();
      if (data) setPage(data);
    } else {
      const { data } = await supabase.from("harbor_page").insert(payload).select().single();
      if (data) setPage(data);
    }
  }

  async function addCard(fd: FormData) {
    const payload = {
      title: String(fd.get("title") || ""),
      body: String(fd.get("body") || ""),
      sort_order: Number(fd.get("sort_order") || 0),
    };
    const { data, error } = await supabase
      .from("harbor_feature_cards")
      .insert(payload)
      .select()
      .single();
    if (!error && data) {
      setCards((prev) =>
        [...prev, data].sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.title.localeCompare(b.title),
        ),
      );
    }
  }

  async function deleteCard(id: string) {
    await supabase.from("harbor_feature_cards").delete().eq("id", id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  async function addRule(fd: FormData) {
    const payload = {
      text: String(fd.get("text") || ""),
      sort_order: Number(fd.get("sort_order") || 0),
    };
    const { data, error } = await supabase.from("harbor_rules").insert(payload).select().single();
    if (!error && data) {
      setRules((prev) =>
        [...prev, data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      );
    }
  }

  async function deleteRule(id: string) {
    await supabase.from("harbor_rules").delete().eq("id", id);
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Ladataan sataman sisältöä…</p>;
  }

  return (
    <div className="space-y-8">
      {/* perus */}
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await savePage(fd);
        }}
      >
        <div>
          <label className="text-sm font-medium text-slate-800">Otsikko</label>
          <input
            name="title"
            defaultValue={page?.title ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-800">Sijainti / osoite</label>
          <input
            name="location"
            defaultValue={page?.location ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-800">Ingressi</label>
          <textarea
            name="intro"
            rows={3}
            defaultValue={page?.intro ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-800">Karttalinkki</label>
          <input
            name="map_url"
            defaultValue={page?.map_url ?? ""}
            placeholder="https://maps.app.goo.gl/..."
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Tallenna satama-sivun perussisältö
          </button>
        </div>
      </form>

      {/* kortit */}
      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Sataman kortit</h4>
          <ul className="mt-3 space-y-2">
            {cards.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{c.title}</p>
                  <p className="text-xs text-slate-500">{c.body}</p>
                </div>
                <button
                  onClick={() => deleteCard(c.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Poista
                </button>
              </li>
            ))}
            {cards.length === 0 && (
              <p className="text-xs text-slate-400">Ei kortteja vielä.</p>
            )}
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-900">Lisää kortti</h5>
          <form
            className="mt-3 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await addCard(fd);
              e.currentTarget.reset();
            }}
          >
            <input
              name="title"
              required
              placeholder="Esim. Laituripaikat"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
            <textarea
              name="body"
              rows={2}
              placeholder="Lyhyt kuvaus"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
            <input
              name="sort_order"
              type="number"
              placeholder="Järjestys"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Lisää kortti
            </button>
          </form>
        </div>
      </div>

      {/* säännöt */}
      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Sataman säännöt / ohjeet</h4>
          <ul className="mt-3 space-y-2">
            {rules.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-2"
              >
                <p className="text-sm text-slate-700">{r.text}</p>
                <button
                  onClick={() => deleteRule(r.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Poista
                </button>
              </li>
            ))}
            {rules.length === 0 && (
              <p className="text-xs text-slate-400">Ei sääntöjä vielä.</p>
            )}
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-900">Lisää sääntö</h5>
          <form
            className="mt-3 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await addRule(fd);
              e.currentTarget.reset();
            }}
          >
            <textarea
              name="text"
              rows={2}
              required
              placeholder="Esim. Laituripaikka on henkilökohtainen..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
            <input
              name="sort_order"
              type="number"
              placeholder="Järjestys"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Lisää sääntö
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
