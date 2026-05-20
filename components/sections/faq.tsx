"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const FAQ_ITEMS = [
  {
    question: "¿Qué tipo de proyectos puede estructurar la plataforma?",
    answer:
      "Nos especializamos en proyectos productivos del sector agropecuario, agroindustrial, economía circular, turismo rural y transformación productiva. Esto incluye proyectos avícolas, piscícolas, porcícolas, de transformación de cacao, café, frutas tropicales, panela, reciclaje, biogás, agroturismo y más. Si tu proyecto no encaja exactamente en estas categorías, puedes contactarnos directamente para evaluar juntos el caso.",
  },
  {
    question: "¿Qué entidades financieras trabajan con ustedes?",
    answer:
      "Tenemos alianzas estratégicas con más de 40 entidades, incluyendo Bancoldex, Finagro, Fondo Nacional de Garantías (FNG), SENA a través del Fondo Emprender, iNNpulsa Colombia, Banco Agrario, Bancamía, y fondos de cooperación internacional como GIZ, FIDA, BID Lab y FAO. La selección de la entidad adecuada depende del perfil específico del proyecto.",
  },
  {
    question: "¿Cuánto tiempo toma estructurar un proyecto desde cero?",
    answer:
      "Depende del nivel de madurez inicial del proyecto. Un proyecto en fase de idea puede estar listo para presentación en 4 a 8 semanas con acompañamiento activo. Proyectos que ya tienen alguna estructura previa pueden estar listos en 2 a 4 semanas. La IA acelera significativamente el proceso de organización documental y estructuración técnica inicial.",
  },
  {
    question: "¿Cómo funciona la IA conversacional y qué información procesa?",
    answer:
      "El asistente usa GPT-4o con un sistema prompt especializado en proyectos productivos colombianos. Analiza la descripción libre del proyecto, detecta el sector, clasifica el nivel de madurez, identifica brechas documentales y genera recomendaciones de financiación. No almacena información sensible sin tu consentimiento y todas las conversaciones son cifradas en tránsito y en reposo.",
  },
  {
    question: "¿Qué documentos debo subir a la plataforma?",
    answer:
      "Los documentos básicos requeridos incluyen: RUT de la empresa o persona natural, Cámara de Comercio actualizada (si existe), cédula de ciudadanía del representante, certificado de predial o contrato de arriendo del predio productivo, cotizaciones o presupuestos de equipos e infraestructura, y cualquier estudio técnico o financiero previo que tengas. La plataforma acepta PDF, imágenes JPG/PNG hasta 10MB por archivo.",
  },
  {
    question: "¿Tienen garantía de aprobación del crédito o financiación?",
    answer:
      "No garantizamos aprobación de créditos, ya que esta decisión depende exclusivamente de cada entidad financiera y sus políticas internas. Lo que sí garantizamos es que presentaremos el proyecto de la manera más técnica, completa y profesional posible para maximizar las probabilidades de aprobación. Nuestra tasa histórica de aprobación es del 96% en proyectos que han completado el proceso de estructuración con nosotros.",
  },
  {
    question: "¿Tienen presencia física o es todo virtual?",
    answer:
      "Somos una plataforma digital con equipos remotos distribuidos por toda Colombia. Operamos 100% de manera virtual para las etapas de diagnóstico, estructuración y preparación documental. Para proyectos que requieren visitas técnicas al predio, contamos con una red de consultores aliados en las principales regiones productivas del país.",
  },
  {
    question: "¿Cuál es el costo del servicio?",
    answer:
      "La evaluación inicial y la primera conversación con la IA son completamente gratuitas. Para el servicio completo de estructuración, manejamos un modelo de éxito: cobramos un porcentaje acordado del monto aprobado únicamente cuando el proyecto obtiene la financiación. En algunos casos, para proyectos complejos, puede aplicar una tarifa fija de estructuración. Contáctanos para una propuesta personalizada según tu proyecto.",
  },
];

export default function FAQ() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <Badge className="mb-4">Preguntas frecuentes</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4"
          >
            Todo lo que necesitas{" "}
            <span className="font-display italic text-brand-DEFAULT">saber.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-500"
          >
            ¿Tienes más preguntas? Escríbenos directamente a través del chat o al correo.
          </motion.p>
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center p-6 bg-[#F8FAFB] rounded-2xl border border-slate-100"
        >
          <p className="text-sm font-semibold text-slate-700 mb-1">
            ¿No encontraste lo que buscabas?
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Nuestro equipo responde en menos de 24 horas hábiles.
          </p>
          <a
            href="mailto:info@especialistasfinancieros.com"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-DEFAULT hover:text-brand-dark transition-colors"
          >
            info@especialistasfinancieros.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
