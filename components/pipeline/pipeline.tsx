import { getApplicationStatusLabel } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";
import { CheckCircle2, Circle } from "lucide-react";

// Reemplaza la versión anterior: una lista fija de 8 pasos hardcodeados
// sin datos reales detrás. Ahora recibe el estado real de una solicitud
// financiera y refleja el flujo real del CRM (ver schema.sql).

const PIPELINE: ApplicationStatus[] = [
  "nuevo",
  "contactado",
  "diagnostico",
  "documentacion",
  "en_analisis",
  "enviado_entidad",
  "estudio",
  "aprobado",
  "desembolsado",
];

export default function Pipeline({ estadoActual }: { estadoActual: ApplicationStatus }) {
  const pasoActual = PIPELINE.indexOf(estadoActual);
  const rechazadoOCerrado = estadoActual === "rechazado" || estadoActual === "cerrado";

  return (
    <div className="bg-zinc-900 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">Estado de la solicitud</h2>

      {rechazadoOCerrado ? (
        <p className="text-sm text-zinc-400">{getApplicationStatusLabel(estadoActual)}</p>
      ) : (
        <div className="space-y-3">
          {PIPELINE.map((estado, index) => {
            const completado = index <= pasoActual;
            return (
              <div key={estado} className="flex items-center gap-3">
                {completado ? (
                  <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-zinc-700 shrink-0" />
                )}
                <span className={completado ? "text-white font-medium" : "text-zinc-500"}>
                  {getApplicationStatusLabel(estado)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
