"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function FinalCta() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-navy-DEFAULT relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-DEFAULT/8 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-DEFAULT/10 border border-brand-DEFAULT/20 text-sm font-semibold text-brand-light mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT animate-pulse" />
          Evaluación gratuita disponible hoy
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-7"
        >
          Tu proyecto productivo merece
          <br />
          <span className="font-display italic text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-cyan-300">
            acceder a la financiación.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Más de 180 proyectos productivos ya accedieron a financiación con nuestra plataforma. Empieza hoy con una evaluación gratuita, sin compromisos, sin formularios complejos.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button asChild size="xl" className="group min-w-[220px]">
            <Link href="#ia-asistente">
              <MessageSquare className="h-5 w-5" />
              Evaluar mi Proyecto Gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline-white" className="min-w-[220px]">
            <Link href="#contacto-directo">
              <Phone className="h-5 w-5" />
              Hablar con un Especialista
            </Link>
          </Button>
        </motion.div>

        {/* Trust checks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {[
            "Sin costo inicial",
            "Sin registro previo",
            "Respuesta en 24 horas",
            "Confidencialidad garantizada",
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-sm text-white/40">
              <CheckCircle2 className="h-4 w-4 text-brand-DEFAULT/60" />
              {item}
            </div>
          ))}
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          id="contacto-directo"
          className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto"
        >
          {[
            {
              icon: Phone,
              label: "WhatsApp Business",
              value: "+57 300 000 0000",
              href: "https://wa.me/573000000000",
              note: "Lun–Vie 8am–6pm",
            },
            {
              icon: Mail,
              label: "Correo electrónico",
              value: "info@especialistasfinancieros.com",
              href: "mailto:info@especialistasfinancieros.com",
              note: "Respuesta en 24h hábiles",
            },
          ].map(({ icon: Icon, label, value, href, note }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-4 bg-white/[0.04] border border-white/8 rounded-2xl hover:bg-white/[0.08] hover:border-white/15 transition-all duration-200 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-DEFAULT/15 flex items-center justify-center shrink-0 group-hover:bg-brand-DEFAULT/25 transition-colors">
                <Icon className="h-4.5 w-4.5 text-brand-DEFAULT" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/40 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white/80 truncate">{value}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{note}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
