import Link from "next/link";
import { Leaf, Globe, Twitter, Linkedin, Instagram, ArrowUpRight } from "lucide-react";

const FOOTER_COLS = [
  {
    title: "Plataforma",
    links: [
      { label: "Cómo funciona", href: "#solucion" },
      { label: "IA Asistente", href: "#ia-asistente" },
      { label: "Sectores", href: "#sectores" },
      { label: "Dashboard CRM", href: "#dashboard" },
      { label: "Seguridad", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "#" },
      { label: "Blog", href: "#", external: true },
      { label: "Casos de éxito", href: "#" },
      { label: "Aliados estratégicos", href: "#" },
      { label: "Trabaja con nosotros", href: "#", external: true },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Guía de proyectos", href: "#" },
      { label: "Calculadora de inversión", href: "#" },
      { label: "Rutas de financiación", href: "#" },
      { label: "Plantillas gratuitas", href: "#" },
      { label: "Webinars", href: "#", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de privacidad", href: "#" },
      { label: "Términos de uso", href: "#" },
      { label: "Tratamiento de datos", href: "#" },
      { label: "Política de cookies", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#070D12] text-slate-400">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-DEFAULT to-brand-dark flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Especialistas</p>
                <p className="text-[10px] font-medium text-slate-500 tracking-widest uppercase leading-none mt-0.5">Financieros</p>
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
              Plataforma premium de estructuración financiera para proyectos productivos en Colombia y Latinoamérica.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Globe, href: "https://especialistasfinancieros.com", label: "Web" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold text-slate-200 tracking-widest uppercase mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.external && (
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Especialistas Financieros. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-DEFAULT animate-pulse" />
            <span className="text-xs text-slate-600">Todos los sistemas operativos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
