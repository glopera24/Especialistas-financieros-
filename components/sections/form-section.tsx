"use client";

import { motion } from "framer-motion";
import { LeadForm } from "@/components/forms/lead-form";
import { MessageCircle, Clock, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function FormSection() {
  return (
    <section id="contacto" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-14 items-start">
          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
              Contáctanos
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Hablemos de tu proyecto financiero
            </h2>
            <p className="mt-5 text-slate-500 leading-relaxed">
              Estamos listos para asesorarte sin compromiso. Completa el formulario y uno de
              nuestros especialistas te contactará a la brevedad.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={siteConfig.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-DEFAULT transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-brand-DEFAULT" />
                <div>
                  <p className="font-semibold text-slate-900">WhatsApp directo</p>
                  <p>{siteConfig.whatsapp.display}</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Clock className="h-5 w-5 text-brand-DEFAULT" />
                <div>
                  <p className="font-semibold text-slate-900">Horario</p>
                  <p>{siteConfig.schedule}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="h-5 w-5 text-brand-DEFAULT" />
                <div>
                  <p className="font-semibold text-slate-900">Atención</p>
                  <p>{siteConfig.attention}</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <LeadForm origen="home" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
