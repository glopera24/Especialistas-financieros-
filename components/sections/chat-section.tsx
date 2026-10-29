
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
    title: "Entiende tu necesidad en lenguaje natural",
    desc: "Descríbela con tus palabras: vivienda, vehículo, empresa, protección patrimonial o exterior.",
  },
  {
    icon: FileText,
    title: "Identifica qué información falta",
    desc: "Te dice qué datos necesitamos para hacer un diagnóstico inicial de tu caso.",
  },
  {
    icon: TrendingUp,
    title: "Te orienta hacia la línea correcta",
    desc: "Hipotecario, vehicular, protección patrimonial o inversión desde el exterior.",
  },
  {
    icon: Zap,
    title: "Te conecta con un especialista humano",
    desc: "El diagnóstico inicial termina siempre con una invitación a hablar por WhatsApp.",
  },
];

const TRUST_INDICATORS = [
  "Gratis para evaluar",
  "Sin registro previo",
  "Disponible 24/7",
  "Diagnóstico orientativo",
];

export default function ChatSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section
      id="ia-asistente"
      className="relative overflow-hidden py-24 lg:py-32"
      style={{
        backgroundColor: "#0B1220",
        color: "#FFFFFF",
      }}
    >
      {/* Decoración de fondo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/3 h-96 w-96 rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(59, 130, 246, 0.12)" }}
        />

        <div
          className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Columna izquierda: presentación del asistente */}
          <div ref={ref as React.RefObject<HTMLDivElement>}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-5"
            >
              <Badge
                variant="glass"
                className="gap-1.5"
              >
                <Sparkles
                  className="h-3.5 w-3.5"
                  style={{ color: "#93C5FD" }}
                />
                IA Conversacional
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.1,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
              style={{ color: "#FFFFFF" }}
            >
              Cuéntanos qué necesitas.{" "}
              <span
                className="font-display italic"
                style={{ color: "#93C5FD" }}
              >
                Te orientamos al instante.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-10 text-base leading-relaxed sm:text-lg"
              style={{ color: "#E2E8F0" }}
            >
              Nuestro asistente financiero te hace un primer diagnóstico en
              tiempo real y te dirige a la línea de crédito o protección
              patrimonial que corresponde a tu caso. Sin formularios largos ni
              lenguaje bancario inaccesible.
            </motion.p>

            {/* Capacidades del asistente */}
            <div className="space-y-5">
              {CAPABILITIES.map((cap, i) => {
                const Icon = cap.icon;

                return (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      delay: 0.3 + i * 0.08,
                      duration: 0.5,
                    }}
                    className="group flex items-start gap-4"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderColor: "rgba(147,197,253,0.25)",
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: "#93C5FD" }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="mb-1 text-sm font-bold leading-snug sm:text-base"
                        style={{ color: "#FFFFFF" }}
                      >
                        {cap.title}
                      </h3>

                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#CBD5E1" }}
                      >
                        {cap.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Indicadores de confianza */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-x-5 gap-y-4 border-t pt-8"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              {TRUST_INDICATORS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: "#E2E8F0" }}
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    style={{ color: "#93C5FD" }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Columna derecha: interfaz del chat */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : {}
            }
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="h-[620px] lg:h-[680px]"
          >
            <ChatInterface />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
