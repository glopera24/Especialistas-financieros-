"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function FinalCta() {
  return (
    <section className="py-20 lg:py-28 bg-[#070D12] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(5,150,105,0.2),transparent)]"
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-DEFAULT/10 border border-brand-DEFAULT/20 text-sm font-semibold text-brand-light mb-8"
        >
          Asesoría inicial sin costo
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Hablemos de tu proyecto financiero
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-slate-400"
        >
          Estamos listos para asesorarte sin compromiso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button asChild size="xl">
            <a href="#contacto">
              Solicitar asesoría
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="xl" variant="outline-white">
            <a href={siteConfig.whatsapp.link} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp directo
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
