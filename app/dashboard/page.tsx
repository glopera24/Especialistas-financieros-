"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Pipeline from "@/components/pipeline/pipeline";
import ProjectsList from "@/components/projects/projects-list";
import NewProject from "@/components/projects/new-project";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {

    const getUser = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || "");
      }

    };

    getUser();

  }, []);

  const handleLogout = async () => {

    await supabase.auth.signOut();

    window.location.href = "/login";

  };

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-zinc-400 mt-2">
            Bienvenido:
          </p>

          <p className="text-xl mt-1">
            {userEmail}
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-white text-black px-5 py-2 rounded-xl font-semibold"
        >
          Cerrar sesión
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-zinc-400 text-sm">
            Proyectos activos
          </h2>

          <p className="text-4xl font-bold mt-2">
            24
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-zinc-400 text-sm">
            Capital gestionado
          </h2>

          <p className="text-4xl font-bold mt-2">
            $8.2B
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-zinc-400 text-sm">
            Tasa aprobación
          </h2>

          <p className="text-4xl font-bold mt-2">
            96%
          </p>
        </div>

      </div>

      <NewProject />

      <div className="mt-10">
        <Pipeline />
      </div>

      <ProjectsList />

    </div>

  );
}