"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site-config";

// Contenido acotado a hechos ya verificados en el sitio (horario, WhatsApp,
// existencia del producto "exterior", asesoría inicial sin costo). No se
// inventaron tiempos de aprobación, tasas ni requisitos específicos —
// sección 30 del brief.
const FAQS = [
  {
    q: "¿Tiene costo la asesoría inicial?",
    a: "No. El diagnóstico inicial y la primera asesoría no tienen costo ni compromiso.",
  },
  {
    q: "¿Con qué entidades trabajan?",
    a: "Trabajamos con las principales entidades financieras del país para comparar condiciones y encontrar la opción que mejor se ajuste a tu perfil.",
  },
  {
    q: "¿Puedo aplicar si vivo fuera de Colombia?",
    a: "Sí. Tenemos una línea especializada para colombianos residentes en el exterior que quieren invertir o financiar vivienda en Colombia, con acompañamiento remoto de principio a fin.",
  },
  {
    q: "¿Qué documentos necesito?",
    a: "Depende del producto y de tu perfil (empleado, independiente o empresa). En el diagnóstico inicial te indicamos exactamente qué necesitas para tu caso.",
  },
  {
    q: "¿Cómo los contacto?",
    a: `Por WhatsApp al ${siteConfig.whatsapp.display}, o completando el formulario de esta página. Horario de atención: ${siteConfig.schedule}.`,
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
            Preguntas frecuentes
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
            ¿Tienes dudas?
          </h2>
        </div>

        <Accordion type="single" collapsible className="rounded-2xl border border-slate-200 px-6">
          {FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-slate-900">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
