import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { SimuladorForm } from "@/components/simulator/simulador-form";

export const metadata: Metadata = {
  title: "Simulador de crédito",
  description:
    "Calcula tu cuota mensual estimada para crédito hipotecario o vehicular con el sistema de amortización francés.",
  alternates: { canonical: "/herramientas/simulador" },
};

export default function SimuladorPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Simula tu crédito en segundos
            </h1>
            <p className="mt-3 text-slate-500">
              Calcula cuota, monto a financiar e intereses estimados para tu crédito hipotecario o
              vehicular.
            </p>
          </div>
          <SimuladorForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
