"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  FileX,
  AlertTriangle,
  Lock,
  Clock,
  UserX,
  TrendingDown,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const PROBLEMS = [
  {
    icon: FileX,
    title: "Desorganización documental",
    description:
      "Proyectos sin plan de negocio, estados financieros ni proyecciones claras que imposibilitan el acceso a crédito.",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    icon: AlertTriangle,
    title: "Sin estructura técnica",
    description:
      "Ideas brillantes atrapadas en lenguaje informal, sin la estructura que exige la banca de desarrollo y los fondos de fomento.",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: Lock,
    title: "Barreras de financiación",
    description:
      "Rechazo por documentación incompleta, flujos de caja inconsistentes o proyecciones poco creíbles ante los evaluadores.",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Clock,
    title: "Procesos lentos y manuales",
    description:
      "Meses perdidos en trámites, formularios en papel y visitas innecesarias a entidades que frenan el desarrollo productivo.",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: UserX,
    title: "Sin acompañamiento experto",
    description:
      "Emprendedores y productores solos frente a procesos complejos sin un equipo especializado que los oriente paso a paso.",
    color: "text-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-100",
  },
  {
    icon: TrendingDown,
    title: "Lenguaje técnico inaccesible",
    description:
      "Formularios, términos financieros y requerimientos bancarios diseñados para expertos, no para productores y emprendedores.",
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-100",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function Problems() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4">El problema</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 leading-tight"
          >
            ¿Por qué los proyectos{" "}
            <span className="font-display italic text-brand-DEFAULT">
              no acceden a financiación?
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            La mayoría de proyectos productivos viables nunca consiguen financiación por barreras estructurales que son completamente evitables.
          </motion.p>
        </div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PROBLEMS.map((p) => (
            <motion.div
              key={p.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-[#FAFAF9] rounded-2xl p-6 border ${p.border} hover:shadow-card-hover transition-shadow duration-300 group`}
            >
              <div
                className={`w-11 h-11 ${p.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}
              >
                <p.icon className={`h-5 w-5 ${p.color}`} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2.5">{p.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 text-center p-8 bg-slate-900 rounded-2xl"
        >
          <p className="text-slate-400 text-sm mb-1">Según estudios del sector</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            El <span className="text-brand-DEFAULT">78%</span> de los proyectos productivos viables son{" "}
            <span className="text-brand-light">rechazados por problemas estructurales</span>,{" "}
            no por inviabilidad del negocio.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
