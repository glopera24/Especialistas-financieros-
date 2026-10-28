import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { NewApplicationForm } from "@/components/dashboard/new-application-form";
import Pipeline from "@/components/pipeline/pipeline";
import { formatCurrency } from "@/lib/utils";
import { soluciones } from "@/lib/site-config";
import type { FinancialApplication } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // La página ya está protegida por middleware.ts, pero volvemos a leer el
  // usuario aquí porque necesitamos su sesión para que RLS filtre
  // automáticamente sus propias solicitudes (política "client_id = auth.uid()").
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: applications } = await supabase
    .from("financial_applications")
    .select("*")
    .order("created_at", { ascending: false });

  const apps = (applications || []) as FinancialApplication[];
  const nombreProducto = (p: string) => soluciones.find((s) => s.leadValue === p)?.nombreCorto || p;

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Mi panel financiero</h1>
          <p className="text-zinc-400 mt-2">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <NewApplicationForm />

      {apps.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl p-10 text-center">
          <p className="text-zinc-400">Todavía no tienes solicitudes registradas.</p>
          <p className="text-zinc-500 text-sm mt-2">
            Crea tu primera solicitud arriba, o cuéntale tu necesidad a nuestro asistente
            financiero desde la página de inicio.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {apps.map((app) => (
            <div key={app.id} className="bg-zinc-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">{nombreProducto(app.producto)}</h3>
                  <p className="text-zinc-500 text-sm mt-1">
                    Creada el{" "}
                    {new Date(app.created_at).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {app.valor_solicitado && (
                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Valor solicitado</p>
                    <p className="text-2xl font-bold">{formatCurrency(app.valor_solicitado)}</p>
                  </div>
                )}
              </div>
              <Pipeline estadoActual={app.estado} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
