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
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Pursiseura <span className="text-sky-600">Sindbad</span>
            </Link>
            <nav className="flex gap-3 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
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
