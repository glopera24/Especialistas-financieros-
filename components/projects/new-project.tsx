"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewProject() {

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [investment, setInvestment] = useState("");

  const handleCreate = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    const { error } = await supabase
      .from("projects")
      .insert([
        {
          user_id: user.id,
          name,
          sector,
          investment_amount: Number(investment),
          status: "Idea Inicial",
        },
      ]);

    if (error) {
      alert(error.message);
    } else {

      alert("Proyecto creado");

      window.location.reload();

    }

  };

  return (

    <div className="bg-zinc-900 rounded-2xl p-6 mb-10">

      <h2 className="text-2xl font-bold mb-6">
        Nuevo Proyecto
      </h2>

      <div className="space-y-4">

        <input
          className="w-full p-3 rounded bg-zinc-800"
          placeholder="Nombre del proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-zinc-800"
          placeholder="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-zinc-800"
          placeholder="Monto inversión"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
        >
          Crear Proyecto
        </button>

      </div>

    </div>

  );
}