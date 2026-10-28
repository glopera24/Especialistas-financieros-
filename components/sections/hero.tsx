"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animation/fade-in";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F2F6FC] pt-28 sm:pt-32">
      <div className="absolute -right-24 -top-20 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-3xl" aria-hidden />
      <div className="absolute left-0 top-48 h-64 w-64 rounded-full bg-sky-100/70 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:px-12 lg:pb-24">
        <div className="relative z-10">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-900/10 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-blue-800 shadow-sm">
              <Sparkles className="h-4 w-4" /> FINANZAS MÁS CLARAS. DECISIONES MEJORES.
            </div>
          </FadeIn>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.06] tracking-[-.045em] text-slate-950 sm:text-5xl lg:text-[4.15rem]">
            Tu próximo paso financiero empieza con una <span className="text-blue-700">buena decisión.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Organizamos tus necesidades, analizamos alternativas y te acompañamos para convertir tus planes en oportunidades de financiación.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#simulador" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-blue-800">
              Simular mi crédito <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/#contacto" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-blue-700 hover:text-blue-800">
              Hablar con un especialista
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-700"/> Orientación personalizada</span>
            <span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-700"/> Alternativas a tu medida</span>
          </div>
        </div>
        <FadeIn delay={180} className="relative">
          <div className="relative mx-auto max-w-[590px]">
            <div className="absolute -inset-3 rotate-[-3deg] rounded-[2rem] bg-blue-200/60" />
            <div className="relative overflow-hidden rounded-[1.7rem] bg-slate-200 shadow-2xl shadow-slate-900/15">
              <img src="/images/asesoria.jpg" alt="Asesoría financiera personalizada" className="h-[390px] w-full object-cover sm:h-[490px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Tu proyecto, nuestro punto de partida</p>
                <p className="mt-2 max-w-sm text-2xl font-medium leading-tight sm:text-3xl">Más claridad para avanzar con confianza.</p>
              </div>
            </div>
            <div className="absolute -left-4 top-8 hidden rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl sm:block">
              <p className="text-xs text-slate-500">Un proceso pensado para ti</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Diagnóstico · Opciones · Acompañamiento</p>
            </div>
          </div>
        </FadeIn>
      </div>
      <div className="border-y border-slate-200/80 bg-white/80">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-5 text-center sm:grid-cols-3 sm:px-8 lg:px-12">
          <div><p className="text-sm font-semibold text-slate-900">Crédito de vivienda</p><p className="text-xs text-slate-500">Planea tu próximo hogar</p></div>
          <div className="sm:border-x sm:border-slate-200"><p className="text-sm font-semibold text-slate-900">Financiación vehicular</p><p className="text-xs text-slate-500">Muévete hacia tus metas</p></div>
          <div><p className="text-sm font-semibold text-slate-900">Soluciones financieras</p><p className="text-xs text-slate-500">Para personas y empresas</p></div>
        </div>
      </div>
    </section>
  );
}
