import { leadService, applicationService } from "@/lib/supabase/server";
import { EstadoSelect } from "@/components/admin/estado-select";
import { ApplicationEstadoSelect } from "@/components/admin/application-estado-select";
import { formatCurrency, getApplicationStatusLabel } from "@/lib/utils";
import { soluciones } from "@/lib/site-config";
import type { LeadProducto } from "@/types";

export const dynamic = "force-dynamic"; // siempre datos frescos, es un CRM interno

const PRODUCTO_LABEL: Record<LeadProducto, string> = Object.fromEntries(
  soluciones.map((s) => [s.leadValue, s.nombreCorto])
) as Record<LeadProducto, string>;
PRODUCTO_LABEL.otro = "Otro";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string; estado?: string }>;
}) {
  const { producto, estado } = await searchParams;
  // La página ya está protegida por middleware.ts (rol advisor/admin). Aquí
  // usamos el service role solo en el servidor — nunca se expone al navegador.
  const [leads, applications, stats] = await Promise.all([
    leadService.getAll({ producto, estado }),
    applicationService.getAll(),
    applicationService.getStats(),
  ]);

  // KPIs reales calculados desde Supabase — nunca cifras fijas (ver auditoría).
  const kpis = [
    { label: "Leads nuevos", value: stats.leads_nuevos },
    { label: "Solicitudes activas", value: stats.solicitudes_activas },
    { label: "En análisis", value: stats.solicitudes_en_analisis },
    { label: "Enviadas a entidad", value: stats.solicitudes_enviadas },
    { label: "Aprobadas", value: stats.solicitudes_aprobadas },
    { label: "Rechazadas", value: stats.solicitudes_rechazadas },
    { label: "Valor solicitado", value: formatCurrency(stats.valor_solicitado_total) },
    { label: "Valor gestionado", value: formatCurrency(stats.valor_gestionado_total) },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">CRM Financiero</h1>
        <p className="text-zinc-400 mt-2">Especialistas Financieros</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-zinc-400 text-xs">{kpi.label}</p>
            <h2 className="text-2xl font-bold mt-1">{kpi.value}</h2>
          </div>
        ))}
      </div>

      {/* Solicitudes financieras */}
      <h2 className="text-xl font-bold mb-4">Solicitudes</h2>
      <div className="bg-zinc-900 rounded-2xl overflow-x-auto mb-10">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-800">
              <th className="p-4 font-medium">Fecha</th>
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium">Valor solicitado</th>
              <th className="p-4 font-medium">Valor aprobado</th>
              <th className="p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  Sin solicitudes todavía.
                </td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-zinc-800/60">
                <td className="p-4 text-zinc-400 whitespace-nowrap">
                  {new Date(app.created_at).toLocaleDateString("es-CO", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td className="p-4 font-medium">{PRODUCTO_LABEL[app.producto] || app.producto}</td>
                <td className="p-4 text-zinc-400">
                  {app.valor_solicitado ? formatCurrency(app.valor_solicitado) : "—"}
                </td>
                <td className="p-4 text-zinc-400">
                  {app.valor_aprobado ? formatCurrency(app.valor_aprobado) : "—"}
                </td>
                <td className="p-4">
                  <ApplicationEstadoSelect id={app.id} estado={app.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leads */}
      <h2 className="text-xl font-bold mb-4">Leads</h2>
      <div className="bg-zinc-900 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-800">
              <th className="p-4 font-medium">Fecha</th>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Contacto</th>
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium">Valor aprox.</th>
              <th className="p-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  Sin leads todavía.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-zinc-800/60">
                <td className="p-4 text-zinc-400 whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString("es-CO", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td className="p-4 font-medium">{lead.nombre}</td>
                <td className="p-4 text-zinc-400">
                  <div>{lead.telefono}</div>
                  {lead.correo && <div className="text-xs">{lead.correo}</div>}
                </td>
                <td className="p-4">{PRODUCTO_LABEL[lead.producto] || lead.producto}</td>
                <td className="p-4 text-zinc-400">{lead.valor_aproximado || "—"}</td>
                <td className="p-4">
                  <EstadoSelect id={lead.id} estado={lead.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
