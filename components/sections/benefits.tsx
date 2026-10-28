"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Ventajas() {
  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
              Quiénes somos
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
              Una firma especializada en banca y finanzas
            </h2>
            <p className="mt-5 text-slate-500 leading-relaxed">
              Somos una empresa con amplia trayectoria en el sector financiero colombiano.
              Nacimos para facilitar el acceso al crédito de manera transparente, eficiente y
              personalizada.
            </p>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Nuestro equipo de especialistas te guía desde la primera consulta hasta el
              desembolso, buscando las mejores condiciones para tu proyecto de vida o negocio.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Transparencia en cada paso del proceso",
                "Enfocados en lograr tu objetivo financiero",
                "Te acompañamos en cada etapa del proceso",
                "Alianzas estratégicas con las principales entidades financieras del país",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-brand-DEFAULT shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-5">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
              ¿Por qué elegirnos?
            </span>
            {siteConfig.advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="font-semibold text-slate-900">{adv.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{adv.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
