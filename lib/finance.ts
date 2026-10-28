// ============================================================
// lib/finance.ts
// Fórmulas migradas tal cual desde simulador/simulator.js (el
// simulador real ya publicado). El simulador original comparaba
// tasas reales de varios bancos cargadas desde una tabla externa
// (`tables/bancos`, `tables/tasas`) que no forma parte de este
// repositorio — esos datos no existen en el proyecto entregado,
// así que NO se inventaron bancos ni tasas (regla de no invención).
// En su lugar, el simulador pide la tasa EA como dato de entrada.
// ============================================================

/** Sistema francés: C = P * (i(1+i)^n) / ((1+i)^n - 1) */
export function calcularCuotaFrancesa(
  principal: number,
  tasaMensual: number,
  numeroCuotas: number
): number {
  const i = tasaMensual / 100;
  if (i === 0) return principal / numeroCuotas;
  const numerador = i * Math.pow(1 + i, numeroCuotas);
  const denominador = Math.pow(1 + i, numeroCuotas) - 1;
  return principal * (numerador / denominador);
}

/** Convierte Tasa Efectiva Anual a Tasa Mensual Vencida: MV = ((1+EA)^(1/12) - 1) * 100 */
export function eaToMv(tasaEA: number): number {
  return (Math.pow(1 + tasaEA / 100, 1 / 12) - 1) * 100;
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
}

export type SimulacionInput = {
  valorTotal: number;
  cuotaInicialPct: number;
  tasaEA: number;
  plazoMeses: number;
};

export type SimulacionResultado = {
  montoCuotaInicial: number;
  montoFinanciar: number;
  tasaMV: number;
  cuotaMensual: number;
  totalPagado: number;
  interesesTotales: number;
};

export function simular({
  valorTotal,
  cuotaInicialPct,
  tasaEA,
  plazoMeses,
}: SimulacionInput): SimulacionResultado {
  const montoCuotaInicial = valorTotal * (cuotaInicialPct / 100);
  const montoFinanciar = valorTotal - montoCuotaInicial;
  const tasaMV = eaToMv(tasaEA);
  const numeroCuotas = plazoMeses;
  const cuotaMensual = calcularCuotaFrancesa(montoFinanciar, tasaMV, numeroCuotas);
  const totalPagado = cuotaMensual * numeroCuotas;
  const interesesTotales = totalPagado - montoFinanciar;

  return { montoCuotaInicial, montoFinanciar, tasaMV, cuotaMensual, totalPagado, interesesTotales };
}
