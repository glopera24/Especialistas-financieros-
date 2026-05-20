type Props = {
  sector: string;
  score: number;
};

export default function ProjectAIAnalysis({
  sector,
  score,
}: Props) {

  let risk = "Alto";
  let recommendation = "Requiere fortalecimiento";

  if (score >= 80) {
    risk = "Bajo";
    recommendation = "Apto para financiación inmediata";
  } else if (score >= 60) {
    risk = "Medio";
    recommendation = "Viable con ajustes menores";
  }

  const entities =
    sector.toLowerCase().includes("avic")
      ? "Finagro · Bancóldex"
      : sector.toLowerCase().includes("agro")
      ? "Finagro · iNNpulsa"
      : "Bancóldex · Fondo Emprender";

  return (

    <div className="mt-5 bg-black/40 border border-zinc-800 rounded-xl p-5">

      <div className="flex items-center gap-2 mb-4">

        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />

        <p className="font-semibold text-green-400">
          IA Financiera Analizando
        </p>

      </div>

      <div className="space-y-3 text-sm">

        <div>
          <p className="text-zinc-500">
            Riesgo estimado
          </p>

          <p className="font-medium mt-1">
            {risk}
          </p>
        </div>

        <div>
          <p className="text-zinc-500">
            Recomendación IA
          </p>

          <p className="font-medium mt-1">
            {recommendation}
          </p>
        </div>

        <div>
          <p className="text-zinc-500">
            Entidades sugeridas
          </p>

          <p className="font-medium mt-1">
            {entities}
          </p>
        </div>

      </div>

    </div>

  );
}