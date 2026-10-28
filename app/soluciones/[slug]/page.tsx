import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { LeadForm } from "@/components/forms/lead-form";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { soluciones, siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return soluciones.map((s) => ({ slug: s.slug }));
}

type Params = Promise<{ slug: string }>;

// Next.js 15: params ahora es una Promise tanto en generateMetadata como en la página.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const solucion = soluciones.find((s) => s.slug === slug);
  if (!solucion) return {};
  return {
    title: solucion.hero.titulo,
    description: solucion.hero.descripcion,
    alternates: { canonical: `/soluciones/${solucion.slug}` },
    openGraph: {
      title: `${solucion.hero.titulo} | Especialistas Financieros`,
      description: solucion.hero.descripcion,
    },
  };
}

export default async function SolucionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const solucion = soluciones.find((s) => s.slug === slug);
  if (!solucion) notFound();

  if (!solucion.disponible) {
    return (
      <>
        <Navbar />
        <main className="pt-40 pb-24 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-5xl">{solucion.emoji}</span>
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-900">
            {solucion.hero.titulo}
          </h1>
          <p className="mt-4 text-slate-500 leading-relaxed">{solucion.hero.descripcion}</p>
          <Button asChild size="lg" className="mt-8">
            <a href={siteConfig.whatsapp.link} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@position": 1, "@type": "ListItem", name: "Inicio", item: siteConfig.url },
      {
        "@position": 2,
        "@type": "ListItem",
        name: solucion.nombreCorto,
        item: `${siteConfig.url}/soluciones/${solucion.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#070D12] pt-32 pb-20 lg:pt-40 lg:pb-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(5,150,105,0.25),transparent)]"
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-4xl">{solucion.emoji}</span>
            <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-brand-DEFAULT">
              {solucion.hero.titulo}
            </p>
            <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-white leading-tight">
              {solucion.hero.subtitulo}
            </h1>
            <p className="mt-5 text-slate-400 max-w-xl mx-auto leading-relaxed">
              {solucion.hero.descripcion}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="#asesoria">
                  Solicitar asesoría
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline-white">
                <a href={siteConfig.whatsapp.link} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Opciones */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {solucion.imagen && (
              <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-14">
                <Image
                  src={solucion.imagen}
                  alt={solucion.hero.titulo}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
              Opciones para tu necesidad
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {solucion.opciones.map((op) => (
                <div key={op.titulo} className="rounded-2xl border border-slate-200 p-6">
                  {op.emoji && <span className="text-2xl mb-3 block">{op.emoji}</span>}
                  <h3 className="font-semibold text-slate-900">{op.titulo}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{op.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section id="asesoria" className="py-20 lg:py-28 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2">
              Solicita asesoría sin costo
            </h2>
            <p className="text-center text-slate-500 mb-10">
              Completa el formulario y uno de nuestros especialistas te contactará.
            </p>
            <LeadForm productoDefault={solucion.leadValue} origen={`vertical:${solucion.slug}`} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
