"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadEstado } from "@/types";

const ESTADOS: LeadEstado[] = ["nuevo", "contactado", "en_proceso", "cerrado", "descartado"];

const ESTADO_STYLES: Record<LeadEstado, string> = {
  nuevo: "bg-blue-500/15 text-blue-400",
  contactado: "bg-amber-500/15 text-amber-400",
  en_proceso: "bg-violet-500/15 text-violet-400",
  cerrado: "bg-blue-500/15 text-blue-400",
  descartado: "bg-zinc-500/15 text-zinc-400",
};

export function EstadoSelect({ id, estado }: { id: string; estado: LeadEstado }) {
  const [value, setValue] = useState(estado);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onChange = async (nuevo: LeadEstado) => {
    setValue(nuevo);
    const res = await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado: nuevo }),
    });
    if (res.ok) {
      startTransition(() => router.refresh());
    } else {
      setValue(estado); // revertir si falló
    }
  };

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => onChange(e.target.value as LeadEstado)}
      className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border-0 outline-none cursor-pointer disabled:opacity-50 ${ESTADO_STYLES[value]}`}
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e} className="bg-zinc-900 text-white">
          {e.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
