"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  type?: string;
  description?: string;
};

type Settings = {
  id: string;
  office_hours: string | null;
  phone: string | null;
  email: string | null;
  harbor_status: string | null;
};

export default function AdminPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  // hae data
  useEffect(() => {
    async function load() {
      const { data: evts } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      const { data: sets } = await supabase.from("site_settings").select("*").limit(1).single();
      setEvents(evts || []);
      setSettings(sets);
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function addEvent(formData: FormData) {
    const newEvent = {
      title: String(formData.get("title") || ""),
      date: String(formData.get("date") || ""),
      time: String(formData.get("time") || ""),
      location: String(formData.get("location") || ""),
      type: String(formData.get("type") || ""),
      description: String(formData.get("description") || ""),
    };
    const { data, error } = await supabase.from("events").insert(newEvent).select().single();
    if (!error && data) {
      setEvents((prev) => [...prev, data]);
    }
  }

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

  async function deleteEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">Ladataan hallintaa…</p>;
  }

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hallintapaneeli</h1>
          <p className="text-sm text-slate-500">
            Luo tapahtumia, päivitä yhteystiedot ja sataman tilanne.
          </p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            location.href = "/login";
          }}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          Kirjaudu ulos
        </button>
      </header>

      {/* Tapahtumat */}
      <section className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
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
          </ul>
        </div>

{/* Uusi tapahtuma */}
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

      {/* Yhteystiedot / sataman tilanne */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Seuran tiedot</h2>
        <p className="text-sm text-slate-500">Päivitä toimistoaika, puhelin ja sataman tilanne.</p>
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
    </div>
  );
}
