type Props = {
  score: number;
};

export default function ProjectScore({ score }: Props) {

  let status = "Riesgo Alto";

  if (score >= 80) {
    status = "Alta Probabilidad";
  } else if (score >= 60) {
    status = "Viable";
  } else if (score >= 40) {
    status = "En Evaluación";
  }

  return (

    <div className="mt-4">

      <div className="flex items-center justify-between mb-2">

        <p className="text-sm text-zinc-400">
          Score Financiero
        </p>

        <p className="font-semibold">
          {score}%
        </p>

      </div>

      <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">

        <div
          className="bg-green-500 h-full"
          style={{ width: `${score}%` }}
        />

      </div>

      <p className="mt-2 text-sm text-green-400">
        {status}
      </p>

    </div>

  );
}