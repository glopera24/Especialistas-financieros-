"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { MessageCircle, Info } from "lucide-react";
import { simular, formatCOP } from "@/lib/finance";
import { siteConfig } from "@/lib/site-config";

type FormValues = {
  tipo: "hipotecario" | "vehicular";
  valorTotal: number;
  cuotaInicialPct: number;
  tasaEA: number;
  plazoMeses: number;
};

export function SimuladorForm() {
  const [resultado, setResultado] = useState<ReturnType<typeof simular> | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { tipo: "hipotecario", cuotaInicialPct: 30, plazoMeses: 180 },
  });

  const tipo = watch("tipo");

  const onSubmit = (values: FormValues) => {
    setResultado(
      simular({
        valorTotal: Number(values.valorTotal),
        cuotaInicialPct: Number(values.cuotaInicialPct),
        tasaEA: Number(values.tasaEA),
        plazoMeses: Number(values.plazoMeses),
      })
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5"
        noValidate
      >
        <div>
          <Label htmlFor="tipo">Tipo de crédito</Label>
          <Select id="tipo" {...register("tipo")}>
            <option value="hipotecario">Hipotecario</option>
            <option value="vehicular">Vehicular</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="valorTotal">
            {tipo === "hipotecario" ? "Valor del inmueble (COP)" : "Valor del vehículo (COP)"} *
          </Label>
          <Input
            id="valorTotal"
            type="number"
            min={1}
            step="1"
            {...register("valorTotal", { required: true, min: 1 })}
            placeholder="300000000"
          />
          {errors.valorTotal && (
            <p className="mt-1 text-xs text-red-600">Ingresa un valor válido.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cuotaInicialPct">Cuota inicial (%)</Label>
            <Input
              id="cuotaInicialPct"
              type="number"
              min={0}
              max={90}
              step="1"
              {...register("cuotaInicialPct", { required: true, min: 0, max: 90 })}
            />
          </div>
          <div>
            <Label htmlFor="plazoMeses">Plazo (meses)</Label>
            <Input
              id="plazoMeses"
              type="number"
              min={1}
              max={30}
              step="1"
              {...register("plazoMeses", { required: true, min: 1, max: 360, valueAsNumber: true })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tasaEA">Tasa efectiva anual — E.A. (%) *</Label>
          <Input
            id="tasaEA"
            type="number"
            min={0.1}
            max={60}
            step="0.01"
            {...register("tasaEA", { required: true, min: 0.1, max: 60 })}
            placeholder="Ej: 13.5"
          />
          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-400">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Usa la tasa que te indique tu entidad o pídenos una referencia actual por WhatsApp.
          </p>
          {errors.tasaEA && <p className="mt-1 text-xs text-red-600">Ingresa una tasa válida.</p>}
        </div>

        <Button type="submit" size="lg" className="w-full">
          Calcular
        </Button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        {!resultado ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
            <p className="text-sm">Completa el formulario para ver tu estimación.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-slate-500">Cuota mensual estimada</p>
              <p className="text-3xl font-bold text-brand-DEFAULT">
                {formatCOP(resultado.cuotaMensual)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Monto a financiar</dt>
                <dd className="font-semibold text-slate-900">{formatCOP(resultado.montoFinanciar)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Cuota inicial</dt>
                <dd className="font-semibold text-slate-900">{formatCOP(resultado.montoCuotaInicial)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Total a pagar</dt>
                <dd className="font-semibold text-slate-900">{formatCOP(resultado.totalPagado)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Intereses totales</dt>
                <dd className="font-semibold text-red-600">{formatCOP(resultado.interesesTotales)}</dd>
              </div>
            </dl>

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 leading-relaxed">
              Esta es una <strong>estimación</strong> calculada con sistema de amortización francés y
              la tasa que ingresaste. No constituye una aprobación crediticia ni un compromiso de
              ninguna entidad financiera. Las condiciones reales dependen de tu perfil y de la
              entidad que apruebe tu solicitud.
            </div>

            <Button asChild size="lg" className="w-full">
              <a href={siteConfig.whatsapp.link} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Quiero asesoría con esta simulación
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
