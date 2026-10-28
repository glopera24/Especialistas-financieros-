import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SimuladorForm } from "@/components/simulator/simulador-form";

export default function SimuladorHome() {
  return (
    <section id="simulador" className="relative overflow-hidden bg-[#F2F6FC] py-20 lg:py-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
            SIMULADOR FINANCIERO
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
            Visualiza tu crédito. Planea a tu ritmo.
          </h2>
          <p className="mt-4 text-slate-500">
            Ajusta el valor, la cuota inicial, la tasa y el plazo en meses para obtener una estimación clara de tu cuota mensual.
          </p>
        </div>

        <SimuladorForm />

        <div className="mt-8 text-center">
          <Link
            href="/herramientas/simulador"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-DEFAULT hover:underline"
          >
            Abrir el simulador en pantalla completa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
