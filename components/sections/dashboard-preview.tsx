"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  FolderOpen,
  Bell,
  Search,
  ChevronRight,
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Settings,
  Bird,
  Fish,
  Wheat,
  ArrowUpRight,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

// ── Mock Data ───────────────────────────────────────────────
const PROJECTS = [
  { id: 1, name: "Granja Avícola El Palmar", sector: "Avícola", icon: Bird, status: "En estructuración", statusColor: "bg-brand-light text-brand-dark", maturity: 85, investment: "$450M", risk: "Bajo", docs: 8, docsTotal: 10 },
  { id: 2, name: "Piscicultura Río Verde", sector: "Piscicultura", icon: Fish, status: "Prefactibilidad", statusColor: "bg-amber-50 text-amber-700", maturity: 55, investment: "$280M", risk: "Medio", docs: 5, docsTotal: 10 },
  { id: 3, name: "Agroindustria Norte S.A.S.", sector: "Agroindustria", icon: Wheat, status: "Aprobado", statusColor: "bg-green-50 text-green-700", maturity: 100, investment: "$1.2B", risk: "Bajo", docs: 10, docsTotal: 10 },
  { id: 4, name: "Economía Circular Bogotá", sector: "Economía Circular", icon: BarChart3, status: "Perfil básico", statusColor: "bg-blue-50 text-blue-700", maturity: 30, investment: "$120M", risk: "Medio", docs: 3, docsTotal: 10 },
];

const STATS = [
  { label: "Proyectos activos", value: "24", change: "+3", icon: Briefcase, color: "text-brand-DEFAULT bg-brand-light" },
  { label: "COP gestionado", value: "$8.2B", change: "+12%", icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
  { label: "Tasa aprobación", value: "96%", change: "+2%", icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  { label: "Documentos subidos", value: "348", change: "+45", icon: FileText, color: "text-violet-600 bg-violet-50" },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Briefcase, label: "Proyectos" },
  { icon: FolderOpen, label: "Documentos" },
  { icon: Users, label: "Clientes" },
  { icon: MessageSquare, label: "Conversaciones" },
  { icon: Settings, label: "Configuración" },
];

// ── Sidebar ─────────────────────────────────────────────────
function DashboardSidebar() {
  return (
    <div className="w-[185px] bg-[#070D12] border-r border-white/5 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-DEFAULT to-brand-dark flex items-center justify-center">
          <TrendingUp className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-xs font-bold text-white/80">ESP. Financieros</span>
      </div>
      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors cursor-pointer",
              active
                ? "bg-brand-DEFAULT/15 text-brand-DEFAULT"
                : "text-white/35 hover:text-white/60 hover:bg-white/5"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
        ))}
      </nav>
      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-brand-DEFAULT/20 flex items-center justify-center text-[10px] text-brand-DEFAULT font-bold">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-white/70 truncate">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Content ─────────────────────────────────────────────
function DashboardMain() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0D1117]">
      {/* Topbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#070D12]">
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 flex-1 max-w-xs">
          <Search className="h-3.5 w-3.5 text-white/30" />
          <span className="text-[11px] text-white/30">Buscar proyectos...</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-4 w-4 text-white/40" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-brand-DEFAULT" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto scrollbar-hidden space-y-5">
        {/* Page title */}
        <div>
          <p className="text-sm font-bold text-white/80">Dashboard Principal</p>
          <p className="text-[11px] text-white/30">Vista general de todos los proyectos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2.5 ${color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-lg font-bold text-white/85">{value}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{label}</p>
              <p className="text-[10px] text-brand-DEFAULT mt-1 font-medium">{change} este mes</p>
            </div>
          ))}
        </div>

        {/* Projects table */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <p className="text-[11px] font-semibold text-white/60">Proyectos Recientes</p>
            <button className="flex items-center gap-1 text-[10px] text-brand-DEFAULT hover:text-brand-light transition-colors">
              Ver todos <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {PROJECTS.map((p) => (
              <motion.div
                key={p.id}
                onClick={() => setActiveProject(activeProject === p.id ? null : p.id)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                className="px-4 py-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <p.icon className="h-3.5 w-3.5 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[11px] font-semibold text-white/75 truncate">{p.name}</p>
                      <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.statusColor}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-brand-DEFAULT rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${p.maturity}%` }}
                          transition={{ delay: 0.4, duration: 1 }}
                        />
                      </div>
                      <span className="text-[10px] text-white/30 w-8 text-right">{p.maturity}%</span>
                      <span className="text-[10px] text-white/30">{p.docs}/{p.docsTotal} docs</span>
                      <span className="text-[10px] font-semibold text-white/50">{p.investment}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/20 shrink-0" />
                </div>

                {/* Expanded detail */}
                {activeProject === p.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-3"
                  >
                    {[
                      { label: "Sector", value: p.sector },
                      { label: "Inversión", value: p.investment },
                      { label: "Riesgo", value: p.risk },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[9px] text-white/25 mb-0.5">{label}</p>
                        <p className="text-[11px] font-semibold text-white/60">{value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] font-semibold text-white/60 mb-3">Actividad reciente</p>
          <div className="space-y-2.5">
            {[
              { text: "Documento RUT aprobado — Granja El Palmar", time: "hace 2 min", dot: "bg-green-400" },
              { text: "Nueva conversación iniciada — Proyecto acuícola", time: "hace 15 min", dot: "bg-blue-400" },
              { text: "Proyecto avanzó a Prefactibilidad", time: "hace 1 hora", dot: "bg-brand-DEFAULT" },
              { text: "3 documentos subidos — Agroindustria Norte", time: "hace 3 horas", dot: "bg-amber-400" },
            ].map(({ text, time, dot }) => (
              <div key={text} className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                <p className="text-[11px] text-white/45 flex-1 truncate">{text}</p>
                <p className="text-[10px] text-white/25 shrink-0">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section Wrapper ──────────────────────────────────────────
export default function DashboardPreviewSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="dashboard" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <Badge className="mb-4">Plataforma CRM</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5"
          >
            Gestión centralizada de{" "}
            <span className="font-display italic text-brand-DEFAULT">
              todos tus proyectos.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Dashboard en tiempo real con estado de proyectos, documentos, conversaciones y métricas clave de tu portafolio productivo.
          </motion.p>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
          style={{ height: 520 }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#070D12] border-b border-white/5">
            {["bg-red-400", "bg-amber-400", "bg-green-400"].map((c, i) => (
              <span key={i} className={`w-2.5 h-2.5 rounded-full ${c} opacity-60`} />
            ))}
            <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-[11px] text-white/25">
              especialistasfinancieros.com/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex h-full" style={{ height: "calc(100% - 40px)" }}>
            <DashboardSidebar />
            <DashboardMain />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
