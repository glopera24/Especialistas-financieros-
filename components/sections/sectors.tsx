"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Bird, Fish, Package, RefreshCw, Wheat, Mountain, Layers } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

const SECTORS = [
  {
    icon: Bird,
    name: "Avícola",
    description: "Gallinas ponedoras, pollos de engorde y codornices a escala comercial.",
    tags: ["Postura", "Engorde", "Incubación"],
    color: "amber",
    gradient: "from-amber-500/10 to-amber-600/5",
    border: "hover:border-amber-300",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    icon: Fish,
    name: "Piscicultura",
    description: "Tilapia, trucha, cachama y sistemas de acuicultura continental sostenibles.",
    tags: ["Estanques", "RAS", "Jaulas"],
    color: "blue",
    gradient: "from-blue-500/10 to-blue-600/5",
    border: "hover:border-blue-300",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    icon: Package,
    name: "Porcicultura",
    description: "Cría, levante y ceba de porcinos con estándares técnicos y sanitarios.",
    tags: ["Ciclo completo", "Levante", "Ceba"],
    color: "pink",
    gradient: "from-pink-500/10 to-pink-600/5",
    border: "hover:border-pink-300",
    iconBg: "bg-pink-50 text-pink-600",
  },
  {
    icon: RefreshCw,
    name: "Economía Circular",
    description: "Reciclaje, compostaje, biogás y aprovechamiento de residuos agroindustriales.",
    tags: ["Reciclaje", "Biogás", "Compostaje"],
    color: "green",
    gradient: "from-green-500/10 to-green-600/5",
    border: "hover:border-green-300",
    iconBg: "bg-green-50 text-green-600",
  },
  {
    icon: Wheat,
    name: "Agroindustria",
    description: "Cacao, café, frutas tropicales, panela, aceites esenciales y lácteos.",
    tags: ["Procesamiento", "Valor agregado", "Exportación"],
    color: "brand",
    gradient: "from-brand-DEFAULT/10 to-brand-dark/5",
    border: "hover:border-brand-DEFAULT",
    iconBg: "bg-brand-light text-brand-dark",
  },
  {
    icon: Mountain,
    name: "Turismo Rural",
    description: "Agroturismo, ecoturismo y experiencias comunitarias en zonas rurales.",
    tags: ["Agroturismo", "Ecoturismo", "Comunidad"],
    color: "cyan",
    gradient: "from-cyan-500/10 to-cyan-600/5",
    border: "hover:border-cyan-300",
    iconBg: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Layers,
    name: "Transformación Productiva",
    description: "Modernización tecnológica, innovación y escalamiento de cadenas productivas.",
    tags: ["Innovación", "Tecnología", "Escalamiento"],
    color: "violet",
    gradient: "from-violet-500/10 to-violet-600/5",
    border: "hover:border-violet-300",
    iconBg: "bg-violet-50 text-violet-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function Sectors() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="sectores" className="py-24 lg:py-32 bg-white">
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
            <Badge className="mb-4">Sectores</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5"
          >
            Especializados en los sectores que{" "}
            <span className="font-display italic text-brand-DEFAULT">
              transforman Colombia.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Metodología específica para cada sector productivo. No somos generalistas — conocemos a fondo las particularidades técnicas y financieras de cada industria.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {SECTORS.map((sector) => (
            <motion.div
              key={sector.name}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={cn(
                "group relative bg-gradient-to-br border border-slate-100 rounded-2xl p-5 cursor-pointer",
                "hover:shadow-card-hover transition-all duration-300",
                sector.gradient,
                sector.border
              )}
            >
              <div className={`w-12 h-12 rounded-xl ${sector.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <sector.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{sector.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{sector.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {sector.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-white/80 text-slate-600 rounded-full border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-brand-DEFAULT opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Ver más
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}

          {/* "Other sectors" card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -3 }}
            className="group border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-brand-DEFAULT transition-colors duration-300 cursor-pointer"
          >
            <div className="text-3xl mb-3">+</div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Otros sectores</p>
            <p className="text-xs text-slate-400">¿Tu proyecto no está en esta lista? Contáctanos.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
