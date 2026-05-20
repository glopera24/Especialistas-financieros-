"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ProjectForm from "@/components/forms/project-form";
import { ClipboardList, CheckCircle2, Clock, Shield } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const FORM_FEATURES = [
  { icon: ClipboardList, text: "Registro guiado paso a paso" },
  { icon: CheckCircle2, text: "Sin tecnicismos ni formularios complejos" },
  { icon: Clock, text: "Proceso completo en menos de 10 minutos" },
  { icon: Shield, text: "Información cifrada y confidencial" },
];

export default function FormSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 bg-[#F8FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-14 lg:gap-16 items-start">
          {/* Left: description */}
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="lg:col-span-2 lg:sticky lg:top-28"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="mb-5"
            >
              <Badge className="mb-4">Registro de proyecto</Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-5"
            >
              Registra tu proyecto.{" "}
              <span className="font-display italic text-brand-DEFAULT">
                Nosotros lo estructuramos.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="text-base text-slate-500 leading-relaxed mb-8"
            >
              Completa el formulario con la información básica de tu proyecto productivo. Nuestro equipo y la IA se encargan de estructurarlo técnica y financieramente.
            </motion.p>

            <div className="space-y-3">
              {FORM_FEATURES.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-brand-DEFAULT" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 bg-white border border-slate-100 rounded-xl"
            >
              <p className="text-xs font-semibold text-slate-700 mb-1">
                ¿Prefiere una asesoría directa?
              </p>
              <p className="text-xs text-slate-500 mb-2">
                Hable con uno de nuestros especialistas.
              </p>
              <a
                href="https://wa.me/573000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-brand-DEFAULT hover:text-brand-dark transition-colors"
              >
                Agendar por WhatsApp →
              </a>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <ProjectForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
