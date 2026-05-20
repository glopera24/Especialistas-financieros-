export default function Pipeline() {

  const steps = [
    "Idea Inicial",
    "Perfilado IA",
    "Prefactibilidad",
    "Documentación",
    "Estructuración",
    "Radicado",
    "Aprobado",
    "Desembolso",
  ];

  return (

    <div className="bg-zinc-900 rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6">
        Pipeline del Proyecto
      </h2>

      <div className="space-y-4">

        {steps.map((step, index) => (

          <div
            key={index}
            className="flex items-center gap-4"
          >

            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
              {index + 1}
            </div>

            <div className="text-lg">
              {step}
            </div>

          </div>

        ))}

      </div>

    </div>

  );
}