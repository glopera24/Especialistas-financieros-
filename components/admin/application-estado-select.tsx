"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getApplicationStatusColor } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

const ESTADOS: ApplicationStatus[] = [
  "nuevo", "contactado", "diagnostico", "documentacion", "en_analisis",
  "enviado_entidad", "estudio", "aprobado", "desembolsado", "rechazado", "cerrado",
];

export function ApplicationEstadoSelect({ id, estado }: { id: string; estado: ApplicationStatus }) {
  const [value, setValue] = useState(estado);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const colors = getApplicationStatusColor(value);

  const onChange = async (nuevo: ApplicationStatus) => {
    const anterior = value;
    setValue(nuevo);
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado: nuevo }),
    });
    if (res.ok) {
      startTransition(() => router.refresh());
    } else {
      setValue(anterior);
    }
  };

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => onChange(e.target.value as ApplicationStatus)}
      className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border-0 outline-none cursor-pointer disabled:opacity-50 ${colors.bg} ${colors.text}`}
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e} className="bg-zinc-900 text-white">
          {e.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
