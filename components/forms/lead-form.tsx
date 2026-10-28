"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { soluciones, type LeadProducto } from "@/lib/site-config";

type FormValues = {
  nombre: string;
  telefono: string;
  correo: string;
  ciudad: string;
  producto: LeadProducto;
  valor_aproximado: string;
  mensaje: string;
  sitio_web: string; // honeypot — debe permanecer vacío
};

export function LeadForm({
  productoDefault,
  origen,
}: {
  productoDefault?: LeadProducto;
  origen?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { producto: productoDefault || "hipotecario" } });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, origen: origen || "web" }),
      });
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-blue-600 mx-auto mb-3" />
        <p className="font-semibold text-blue-900">¡Gracias! Te contactaremos pronto.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-3 text-sm text-blue-700 underline"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5"
      noValidate
    >
      {/* Honeypot: oculto para personas, visible para bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="sitio_web">No llenar este campo</label>
        <input id="sitio_web" tabIndex={-1} autoComplete="off" {...register("sitio_web")} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="nombre">Nombre completo *</Label>
          <Input
            id="nombre"
            {...register("nombre", { required: "Ingresa tu nombre.", minLength: 2 })}
            aria-invalid={!!errors.nombre}
            placeholder="Tu nombre"
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono / WhatsApp *</Label>
          <Input
            id="telefono"
            type="tel"
            {...register("telefono", { required: "Ingresa tu teléfono.", minLength: 7 })}
            aria-invalid={!!errors.telefono}
            placeholder="+57 300 000 0000"
          />
          {errors.telefono && (
            <p className="mt-1 text-xs text-red-600">{errors.telefono.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="correo">Correo electrónico</Label>
          <Input id="correo" type="email" {...register("correo")} placeholder="tucorreo@ejemplo.com" />
        </div>
        <div>
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input id="ciudad" {...register("ciudad")} placeholder="Bogotá" />
        </div>
      </div>

      <div>
        <Label htmlFor="producto">¿Qué necesitas financiar? *</Label>
        <Select id="producto" {...register("producto", { required: true })}>
          {soluciones.map((s) => (
            <option key={s.slug} value={s.leadValue}>
              {s.nombreCorto}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="valor_aproximado">Valor aproximado (opcional)</Label>
        <Input id="valor_aproximado" {...register("valor_aproximado")} placeholder="Ej: $300.000.000 COP" />
      </div>

      <div>
        <Label htmlFor="mensaje">Cuéntanos más (opcional)</Label>
        <Textarea id="mensaje" {...register("mensaje")} rows={3} placeholder="Tu mensaje" />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          Error al enviar. Intenta de nuevo o contáctanos por WhatsApp.
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" loading={status === "loading"}>
        Solicitar asesoría
      </Button>
      <p className="text-xs text-slate-400 text-center">
        Al enviar aceptas nuestra{" "}
        <a href="/legal/tratamiento-datos" className="underline">
          Política de Tratamiento de Datos
        </a>
        .
      </p>
    </form>
  );
}
