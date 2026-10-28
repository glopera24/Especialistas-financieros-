import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ArrowRight } from "lucide-react";
import { soluciones } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Soluciones financieras",
  description:
    "Crédito hipotecario, vehicular, protección patrimonial e inversión desde el exterior. Encuentra la solución financiera que necesitas.",
  alternates: { canonical: "/soluciones" },
};

export default function SolucionesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900">
              Soluciones financieras
            </h1>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              Un portafolio integral adaptado a cada etapa de tu vida o de tu empresa.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {soluciones.map((s) => (
              <Link
                key={s.slug}
                href={`/soluciones/${s.slug}`}
                className={`group flex flex-col rounded-2xl border border-slate-200 p-7 transition-all hover:border-brand-DEFAULT/40 hover:shadow-lg ${
                  !s.disponible ? "opacity-70" : ""
                }`}
              >
                <span className="text-3xl mb-4">{s.emoji}</span>
                <h2 className="text-xl font-semibold text-slate-900">{s.nombre}</h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">{s.resumen}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-DEFAULT">
                  {s.disponible ? "Ver soluciones" : "Próximamente"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
