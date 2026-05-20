"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  MessageSquare,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  BarChart3,
  FileText,
  Clock,
} from "lucide-react";

// ── Dashboard Preview Component ─────────────────────────────
function DashboardPreview() {
  const projects = [
    { name: "Granja Avícola El Palmar", sector: "Avícola", status: "Estructurado", statusClass: "bg-brand-light text-brand-dark", pct: 85, value: "$450M COP" },
    { name: "Piscicultura Río Verde", sector: "Piscicultura", status: "En revisión", statusClass: "bg-amber-50 text-amber-700", pct: 60, value: "$280M COP" },
    { name: "Agroindustria Norte S.A.S.", sector: "Agroindustria", status: "Aprobado", statusClass: "bg-green-50 text-green-700", pct: 100, value: "$1.2B COP" },
  ];

  const pctColors: Record<number, string> = { 85: "bg-blue-500", 60: "bg-amber-400", 100: "bg-brand-DEFAULT" };

  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="absolute -inset-8 bg-brand-DEFAULT/10 rounded-3xl blur-3xl" />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        style={{ minWidth: 360 }}
      >
        {/* Topbar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
          {["bg-red-400", "bg-amber-400", "bg-green-400"].map((c, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-full ${c} opacity-70`} />
          ))}
          <span className="flex-1 text-center text-[11px] text-white/30">especialistasfinancieros.com/dashboard</span>
        </div>

        <div className="p-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Proyectos activos", value: "24", icon: BarChart3, color: "text-brand-DEFAULT bg-brand-light" },
              { label: "COP gestionado", value: "$8.2B", icon: TrendingUp, color: "text-blue-400 bg-blue-500/10" },
              { label: "Tasa aprobación", value: "96%", icon: CheckCircle2, color: "text-amber-400 bg-amber-500/10" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white/[0.04] rounded-xl p-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-lg font-bold text-white leading-none">{value}</p>
                <p className="text-[10px] text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Project list */}
          <div className="space-y-2.5">
            {projects.map((p) => (
              <div key={p.name} className="bg-white/[0.03] rounded-xl p-3">
                <div className="flex items-start justify-between mb-2.5 gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white/80 truncate">{p.name}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{p.sector}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.statusClass}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${pctColors[p.pct] || "bg-brand-DEFAULT"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }}
                      transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40 w-14 text-right">{p.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer notification */}
          <div className="mt-3 bg-brand-DEFAULT/10 border border-brand-DEFAULT/20 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT animate-pulse" />
            <p className="text-[11px] text-brand-light">3 documentos pendientes de revisión</p>
          </div>
        </div>
      </motion.div>

      {/* Floating cards */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute -top-4 -right-10 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-slate-100"
      >
        <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center">
          <FileText className="h-4 w-4 text-brand-DEFAULT" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900">IA analizó tu proyecto</p>
          <p className="text-[10px] text-slate-500">Sector detectado: Avícola</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute -bottom-6 -left-10 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-slate-100"
      >
        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900">Proyecto aprobado</p>
          <p className="text-[10px] text-slate-500">Bancoldex · $450M COP</p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Hero Component ────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center bg-hero noise-overlay overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-DEFAULT/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/6 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28"
      >
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="glass" className="gap-1.5">
                <Sparkles className="h-3 w-3 text-brand-DEFAULT" />
                Plataforma de estructuración financiera
              </Badge>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
                Transformamos proyectos productivos en{" "}
                <span className="font-display italic text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">
                  estructuras financiables.
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-white/60 leading-relaxed max-w-xl"
            >
              Organizamos, estructuramos y digitalizamos tu proyecto productivo con inteligencia artificial para que accedas a financiación sin fricciones.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="group">
                <Link href="#ia-asistente">
                  <MessageSquare className="h-4.5 w-4.5" />
                  Hablar con la IA
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline-white">
                <Link href="#contacto">
                  <FileText className="h-4.5 w-4.5" />
                  Evaluar Proyecto
                </Link>
              </Button>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-x-10 gap-y-4 pt-2"
            >
              {[
                { value: "180+", label: "Proyectos estructurados" },
                { value: "$42B COP", label: "En gestión activa" },
                { value: "96%", label: "Tasa de aprobación" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-white/40 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex justify-end pr-4"
          >
            <DashboardPreview />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
