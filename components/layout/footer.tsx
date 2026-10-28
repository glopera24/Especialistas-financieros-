import Link from "next/link";
import { Landmark, MessageCircle, Clock, MapPin } from "lucide-react";
import { siteConfig, soluciones } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-[#070D12] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-DEFAULT to-brand-dark flex items-center justify-center">
                <Landmark className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Especialistas</p>
                <p className="text-[10px] font-medium text-slate-500 tracking-widest uppercase leading-none mt-0.5">Financieros</p>
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
              {siteConfig.description}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-brand-DEFAULT shrink-0" />
                <a href={siteConfig.whatsapp.link} target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
                  {siteConfig.whatsapp.display}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-DEFAULT shrink-0" />
                {siteConfig.schedule}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-DEFAULT shrink-0" />
                {siteConfig.attention}
              </li>
            </ul>
          </div>

          {/* Soluciones */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 tracking-widest uppercase mb-4">Soluciones</h3>
            <ul className="space-y-2.5">
              {soluciones.map((s) => (
                <li key={s.slug}>
                  <Link href={`/soluciones/${s.slug}`} className="text-sm text-slate-500 hover:text-slate-200 transition-colors">
                    {s.nombreCorto}
                    {!s.disponible && <span className="text-slate-700"> (próximamente)</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 tracking-widest uppercase mb-4">Empresa</h3>
            <ul className="space-y-2.5">
              <li><Link href="/#nosotros" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">Quiénes somos</Link></li>
              <li><Link href="/#metodologia" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">Metodología</Link></li>
              <li><Link href="/herramientas/simulador" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">Simulador</Link></li>
              <li><Link href="/#contacto" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">Contáctanos</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 tracking-widest uppercase mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/legal/tratamiento-datos" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">Tratamiento de datos</Link></li>
              <li><Link href="/legal/privacidad" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">Política de privacidad</Link></li>
              <li><Link href="/legal/terminos" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">Términos de uso</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Especialistas Financieros. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
