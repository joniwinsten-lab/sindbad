// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pursiseura Sindbad ry",
  description: "Lauttasaaren itärannalla toimiva pursiseura.",
};

const nav = [
  { href: "/", label: "Etusivu" },
  { href: "/seura", label: "Seura" },
  { href: "/satama", label: "Satama" },
  { href: "/tapahtumat", label: "Tapahtumat" },
  { href: "/yhteystiedot", label: "Yhteystiedot" },
  // UUSI: login myös navissa (näkyy mobiilimenussa)
  { href: "/login", label: "Kirjaudu" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="text-base font-semibold tracking-tight">
              Pursiseura <span className="text-sky-600">Sindbad</span>
            </Link>

            {/* desktop-nav */}
            <nav className="hidden items-center gap-3 text-sm md:flex">
              {nav
                // desktopissa ei tarvitse toista "Kirjaudu" -linkkiä listan seassa,
                // koska meillä on erillinen nappi oikealla
                .filter((item) => item.href !== "/login")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-1.5 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
              {/* UUSI: erillinen nappi */}
              <Link
                href="/login"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
              >
                Kirjaudu
              </Link>
            </nav>

            {/* mobile */}
            <details className="relative md:hidden">
              <summary className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white">
                ☰
              </summary>
              <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white p-1 shadow-lg">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded px-3 py-2 text-sm hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

        <footer className="mt-16 border-t bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
            © {new Date().getFullYear()} Pursiseura Sindbad ry
          </div>
        </footer>
      </body>
    </html>
  );
}
