"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "@/components/chat/chat-interface";
import {
  Sparkles,
  CheckCircle2,
  Brain,
  FileText,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const CAPABILITIES = [
  {
    icon: Brain,
    title: "Detecta el sector automáticamente",
    desc: "Identifica avicultura, piscicultura, agroindustria y más desde tu descripción libre.",
  },
  {
    icon: FileText,
    title: "Genera listas documentales",
    desc: "Te dice exactamente qué documentos faltan para acceder a cada tipo de financiación.",
  },
  {
    icon: TrendingUp,
    title: "Clasifica el nivel de madurez",
    desc: "Ubica tu proyecto en escala de 1 a 5 y traza la ruta para avanzar al siguiente nivel.",
  },
  {
    icon: Zap,
    title: "Recomienda fuentes de financiación",
    desc: "Sugiere Bancoldex, Finagro, FNG, iNNpulsa o cooperación según el perfil de tu proyecto.",
  },
];

export default function ChatSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="ia-asistente" className="py-24 lg:py-32 bg-navy-DEFAULT relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-DEFAULT/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* ── Left: description ─────────────────────────── */}
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="mb-5"
            >
              <Badge variant="glass" className="gap-1.5">
                <Sparkles className="h-3 w-3 text-brand-DEFAULT" />
                IA Conversacional
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            >
              Cuéntanos tu proyecto.{" "}
              <span className="font-display italic text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">
                La IA hace el resto.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-base text-white/55 leading-relaxed mb-10"
            >
              Nuestro asistente especializado en estructuración financiera analiza tu proyecto en tiempo real, identifica brechas y genera recomendaciones técnicas inmediatas. Sin formularios complejos ni lenguaje bancario inaccesible.
            </motion.p>

            {/* Capabilities */}
            <div className="space-y-4">
              {CAPABILITIES.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-DEFAULT/20 group-hover:border-brand-DEFAULT/30 transition-colors duration-200">
                    <cap.icon className="h-4 w-4 text-brand-DEFAULT" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90 mb-0.5">{cap.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{cap.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-4"
            >
              {[
                "Gratis para evaluar",
                "Sin registro previo",
                "Disponible 24/7",
                "GPT-4o",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-white/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-DEFAULT/70" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Chat interface ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-[620px] lg:h-[680px]"
          >
            <ChatInterface />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
