"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Leaf,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Cómo funciona", href: "#solucion" },
  { label: "Sectores", href: "#sectores" },
  { label: "IA Asistente", href: "#ia-asistente" },
  { label: "Plataforma", href: "#dashboard" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-DEFAULT to-brand-dark flex items-center justify-center shadow-sm group-hover:shadow-green-glow transition-shadow duration-300">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  Especialistas
                </p>
                <p className="text-[10px] font-medium text-slate-500 tracking-widest uppercase leading-none mt-0.5">
                  Financieros
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                    scrolled
                      ? "text-slate-600 hover:text-brand-DEFAULT hover:bg-brand-light"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="#contacto"
                className={cn(
                  "text-sm font-medium transition-colors",
                  scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/70 hover:text-white"
                )}
              >
                Iniciar sesión
              </Link>
              <Button asChild size="default">
                <Link href="#ia-asistente">
                  <Sparkles className="h-4 w-4" />
                  Evaluar Proyecto
                </Link>
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-16 lg:hidden"
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex-1 px-6 py-6 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-3.5 px-4 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:text-brand-DEFAULT transition-colors"
                    >
                      {link.label}
                      <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="px-6 pb-8 space-y-3 border-t border-slate-100 pt-6">
                <Button asChild size="lg" className="w-full">
                  <Link href="#ia-asistente" onClick={() => setMobileOpen(false)}>
                    <Sparkles className="h-4 w-4" />
                    Evaluar mi Proyecto Gratis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full">
                  <Link href="#contacto" onClick={() => setMobileOpen(false)}>
                    Iniciar sesión
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
