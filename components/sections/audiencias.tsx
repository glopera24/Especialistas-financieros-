"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const pasos = [
  "Nos contactas para contarnos tu necesidad financiera.",
  "Te hacemos un diagnóstico y trazamos una estrategia personalizada.",
  "Te acompañamos paso a paso hasta lograr el crédito ideal.",
];

export default function Publico() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
            ¿A quiénes asesoramos?
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
            Soluciones para cada perfil
          </h2>
          <p className="mt-4 text-slate-500">
            Brindamos asesoría personalizada a personas naturales y empresas que cuenten con
            capacidad de pago, historial crediticio adecuado y deseen optimizar sus condiciones
            financieras o acceder a nuevas oportunidades de inversión.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {siteConfig.audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl bg-white border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900">{a.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{a.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-8 sm:p-10">
          <ol className="grid sm:grid-cols-3 gap-8">
            {pasos.map((paso, i) => (
              <li key={paso} className="flex flex-col items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-DEFAULT text-white font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">{paso}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
