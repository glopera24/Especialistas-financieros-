"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const NAV_LINKS = [
  { label: "Soluciones", href: "/soluciones" },
  { label: "Herramientas", href: "/herramientas/simulador" },
  { label: "Cómo trabajamos", href: "/#metodologia" },
  { label: "Nosotros", href: "/#nosotros" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 md:px-8 lg:px-12">
      <header className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/80 bg-white/90 px-4 py-2.5 shadow-lg shadow-slate-900/[0.06] backdrop-blur-xl sm:px-5">
        <Link href="/" className="shrink-0 text-sm font-bold tracking-tight text-slate-950 sm:text-base">
          Especialistas Financieros
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#contacto"
            className="hidden rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 sm:inline-flex"
          >
            Hablar con un especialista
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Hablar con un especialista
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
