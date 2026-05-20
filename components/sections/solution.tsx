"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Brain,
  Target,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const STEPS = [
  {
    number: "01",
    icon: Globe,
    title: "Registro del proyecto",
    description:
      "Cuéntanos tu idea productiva en tus propias palabras. Sin formularios complejos ni términos técnicos. La IA lo procesa automáticamente.",
    detail: "Texto libre · Voz · Documentos",
    color: "brand",
  },
  {
    number: "02",
    icon: Brain,
    title: "Análisis con Inteligencia Artificial",
    description:
      "Nuestra IA detecta el sector, clasifica el nivel de madurez del proyecto, identifica brechas documentales y convierte el lenguaje informal en estructura técnica.",
    detail: "GPT-4o · Análisis sectorial · Clasificación",
    color: "indigo",
  },
  {
    number: "03",
    icon: Target,
    title: "Clasificación estratégica",
    description:
      "Ubicamos tu proyecto en la ruta de financiación más adecuada según su perfil: Bancoldex, Finagro, FNG, cooperación internacional o capital privado.",
    detail: "Finagro · Bancoldex · FNG · Cooperación",
    color: "cyan",
  },
  {
    number: "04",
    icon: FileText,
    title: "Estructuración técnica y financiera",
    description:
      "Construimos contigo el plan de negocio, flujos de caja proyectados, análisis de capacidad instalada y todos los documentos técnicos requeridos.",
    detail: "Plan de negocio · Flujos · Estudio de mercado",
    color: "violet",
  },
  {
    number: "05",
    icon: TrendingUp,
    title: "Acompañamiento hasta el cierre",
    description:
      "Te acompañamos desde la presentación formal ante financiadores hasta la aprobación definitiva y el desembolso. No te dejamos solo en ninguna etapa.",
    detail: "Presentación · Negociación · Desembolso",
    color: "amber",
  },
];

const COLOR_MAP: Record<string, { icon: string; line: string; num: string; numBg: string }> = {
  brand: { icon: "text-brand-DEFAULT bg-brand-light", line: "bg-brand-DEFAULT", num: "text-brand-DEFAULT", numBg: "bg-brand-light" },
  indigo: { icon: "text-indigo-600 bg-indigo-50", line: "bg-indigo-400", num: "text-indigo-600", numBg: "bg-indigo-50" },
  cyan: { icon: "text-cyan-600 bg-cyan-50", line: "bg-cyan-400", num: "text-cyan-600", numBg: "bg-cyan-50" },
  violet: { icon: "text-violet-600 bg-violet-50", line: "bg-violet-400", num: "text-violet-600", numBg: "bg-violet-50" },
  amber: { icon: "text-amber-600 bg-amber-50", line: "bg-amber-400", num: "text-amber-600", numBg: "bg-amber-50" },
};

export default function Solution() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="solucion" className="py-24 lg:py-32 bg-[#F8FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <Badge className="mb-4">Cómo funciona</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight"
          >
            De la idea al proyecto financiable{" "}
            <span className="font-display italic text-brand-DEFAULT">en 5 pasos.</span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {STEPS.map((step, index) => {
            const colors = COLOR_MAP[step.color];
            const isLast = index === STEPS.length - 1;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-6 relative"
              >
                {/* Left: number + line */}
                <div className="flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${colors.numBg} ${colors.num} z-10`}>
                    {step.number}
                  </div>
                  {!isLast && (
                    <div className={`w-px flex-1 ${colors.line} opacity-30 mt-1 mb-1 min-h-[40px]`} />
                  )}
                </div>

                {/* Right: content */}
                <div className={`pb-${isLast ? "0" : "10"} flex-1 pt-1`} style={{ paddingBottom: isLast ? 0 : 40 }}>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-card-hover transition-shadow duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.icon} group-hover:scale-110 transition-transform duration-200`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-3">{step.description}</p>
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${colors.numBg} ${colors.num}`}>
                          {step.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
