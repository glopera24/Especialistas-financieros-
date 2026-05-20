"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  ClipboardList,
  Database,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const BENEFITS = [
  {
    icon: Brain,
    title: "IA Organizacional",
    description:
      "Nuestra inteligencia artificial convierte tu idea en una estructura técnica lista para presentar a financiadores. GPT-4o especializado en proyectos productivos.",
    highlight: "GPT-4o",
  },
  {
    icon: ClipboardList,
    title: "Metodología Probada",
    description:
      "Procesos basados en estándares de la banca de desarrollo colombiana, fondos de inversión de impacto y organismos de cooperación internacional.",
    highlight: "Bancoldex · Finagro",
  },
  {
    icon: Database,
    title: "Trazabilidad Total",
    description:
      "Seguimiento en tiempo real de cada etapa del proyecto: documentos, estados, revisiones y aprobaciones en un solo lugar con historial completo.",
    highlight: "Dashboard CRM",
  },
  {
    icon: Zap,
    title: "Automatización Documental",
    description:
      "Generación automática de fichas técnicas, resúmenes ejecutivos, flujos de caja proyectados y presentaciones profesionales para financiadores.",
    highlight: "Ahorra semanas",
  },
  {
    icon: Shield,
    title: "Acompañamiento Experto",
    description:
      "Equipo de especialistas en financiación agropecuaria, ingeniería productiva y estructuración de proyectos con más de 10 años de experiencia.",
    highlight: "10+ años",
  },
  {
    icon: TrendingUp,
    title: "Red de Financiación",
    description:
      "Acceso directo a bancos, fondos de fomento, entidades de cooperación internacional y capital privado. Más de 40 entidades aliadas.",
    highlight: "40+ aliados",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function Benefits() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 bg-[#F8FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <Badge className="mb-4">Beneficios</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5"
          >
            Todo lo que necesita tu proyecto{" "}
            <span className="font-display italic text-brand-DEFAULT">en un solo lugar.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Una plataforma diseñada para eliminar todas las barreras que impiden que los proyectos productivos accedan al financiamiento que merecen.
          </motion.p>
        </div>

        {/* Benefits grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {BENEFITS.map((b) => (
            <motion.div
              key={b.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <b.icon className="h-6 w-6 text-brand-DEFAULT" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900">{b.title}</h3>
                <span className="hidden sm:inline text-[10px] font-bold text-brand-DEFAULT bg-brand-light px-2 py-0.5 rounded-full">
                  {b.highlight}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 grid sm:grid-cols-2 gap-4"
        >
          {[
            {
              label: "Sin Especialistas Financieros",
              items: [
                "Meses de preparación manual",
                "Rechazo por documentación incompleta",
                "Sin orientación sobre la fuente correcta",
                "Riesgo de perder tiempo y dinero",
              ],
              icon: "❌",
              bg: "bg-red-50 border-red-100",
              textColor: "text-red-600",
            },
            {
              label: "Con Especialistas Financieros",
              items: [
                "Estructura lista en días, no meses",
                "Documentación completa desde el inicio",
                "Ruta de financiación personalizada",
                "Acompañamiento hasta el desembolso",
              ],
              icon: "✅",
              bg: "bg-brand-light border-brand-200",
              textColor: "text-brand-dark",
            },
          ].map((col) => (
            <div key={col.label} className={`rounded-2xl p-6 border ${col.bg}`}>
              <h4 className={`text-sm font-bold mb-4 ${col.textColor}`}>{col.label}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <span>{col.icon}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
