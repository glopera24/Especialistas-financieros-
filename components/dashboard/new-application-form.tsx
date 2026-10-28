"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { soluciones } from "@/lib/site-config";
import type { FinancialProduct } from "@/types";

type FormValues = { producto: FinancialProduct; valor_solicitado: string };

export function NewApplicationForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { producto: "hipotecario" },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto: values.producto,
          valor_solicitado: values.valor_solicitado ? Number(values.valor_solicitado) : undefined,
          perfil_financiero: {},
        }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 rounded-2xl p-6 mb-8 space-y-4">
      <h2 className="text-xl font-bold">Iniciar una nueva solicitud</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-zinc-300">Línea financiera</Label>
          <Select {...register("producto")} className="bg-zinc-800 border-zinc-700 text-white">
            {soluciones
              .filter((s) => s.disponible)
              .map((s) => (
                <option key={s.slug} value={s.leadValue}>
                  {s.nombreCorto}
                </option>
              ))}
          </Select>
        </div>
        <div>
          <Label className="text-zinc-300">Valor aproximado (opcional)</Label>
          <Input
            type="number"
            className="bg-zinc-800 border-zinc-700 text-white"
            {...register("valor_solicitado")}
            placeholder="300000000"
          />
        </div>
      </div>
      {status === "error" && (
        <p className="text-sm text-red-400">No pudimos crear la solicitud. Intenta de nuevo.</p>
      )}
      <Button type="submit" loading={status === "loading"}>
        Crear solicitud
      </Button>
    </form>
  );
}
