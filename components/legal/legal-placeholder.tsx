import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { siteConfig } from "@/lib/site-config";

export function LegalPlaceholder({ titulo }: { titulo: string }) {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{titulo}</h1>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 leading-relaxed">
          <p className="font-semibold mb-2">Este documento está en preparación.</p>
          <p>
            Como firma que recolecta datos personales de clientes potenciales (nombre, teléfono,
            correo, información financiera), {siteConfig.name} debe publicar aquí el texto real de
            esta política, redactado o revisado por su equipo legal conforme a la Ley 1581 de 2012
            y el Decreto 1377 de 2013 (régimen colombiano de protección de datos personales). No se
            generó contenido genérico automáticamente para evitar publicar compromisos legales que la
            empresa no ha revisado ni aprobado.
          </p>
        </div>
        <p className="mt-8">
          <Link href="/" className="text-brand-DEFAULT font-medium hover:underline">
            ← Volver al inicio
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
