"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { soluciones } from "@/lib/site-config";

export default function NecesidadFinanciera() {
  return (
    <section id="soluciones" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
            Portafolio
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
            ¿Qué necesitas financiar?
          </h2>
          <p className="mt-4 text-slate-500">
            Ofrecemos un portafolio integral de soluciones financieras adaptadas a cada etapa de
            tu vida.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {soluciones.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative"
            >
              <Link
                href={s.disponible ? `/soluciones/${s.slug}` : "#contacto"}
                className={`flex h-full flex-col rounded-2xl border border-slate-200 p-6 transition-all hover:border-brand-DEFAULT/40 hover:shadow-lg ${
                  !s.disponible ? "opacity-70" : ""
                }`}
              >
                <span className="text-3xl mb-4">{s.emoji}</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.nombre}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{s.resumen}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-DEFAULT">
                  {s.disponible ? "Ver soluciones" : "Próximamente"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
