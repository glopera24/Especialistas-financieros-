"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

export default function Metodologia() {
  return (
    <section id="metodologia" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
            Metodología
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">¿Cómo lo hacemos?</h2>
          <p className="mt-4 text-slate-500">
            Te acompañamos con una metodología probada y personalizada en cada etapa del proceso.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.methodology.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-4"
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-brand-DEFAULT/10 text-brand-DEFAULT font-bold text-sm flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
