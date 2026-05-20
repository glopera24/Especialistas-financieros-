"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {

    const fetchProjects = async () => {

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);
      }

    };

    fetchProjects();

  }, []);

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <div className="mb-10">

        <h1 className="text-5xl font-bold">
          Admin CRM
        </h1>

        <p className="text-zinc-400 mt-2">
          Especialistas Financieros
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">
            Total proyectos
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {projects.length}
          </h2>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">
            Capital solicitado
          </p>

          <h2 className="text-2xl font-bold mt-2">
            $
            {projects
              .reduce(
                (acc, p) =>
                  acc + Number(p.investment_amount || 0),
                0
              )
              .toLocaleString("es-CO")}
          </h2>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">
            Sectores activos
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {new Set(projects.map((p) => p.sector)).size}
          </h2>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">
            Score promedio
          </p>

          <h2 className="text-4xl font-bold mt-2">
            74%
          </h2>
        </div>

      </div>

      <div className="bg-zinc-900 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Pipeline General
        </h2>

        <div className="space-y-4">

          {projects.map((project) => (

            <div
              key={project.id}
              className="border border-zinc-800 rounded-xl p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-semibold">
                    {project.name}
                  </h3>

                  <p className="text-zinc-400 mt-1 capitalize">
                    {project.sector}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-sm text-zinc-500">
                    Estado
                  </p>

                  <p className="font-semibold text-green-400">
                    {project.status}
                  </p>

                </div>

              </div>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">

                <div>
                  <p className="text-zinc-500 text-sm">
                    Inversión
                  </p>

                  <p className="font-semibold mt-1">
                    $
                    {Number(
                      project.investment_amount || 0
                    ).toLocaleString("es-CO")}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 text-sm">
                    Experiencia
                  </p>

                  <p className="font-semibold mt-1">
                    {project.experience_years || 0} años
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 text-sm">
                    Empleos
                  </p>

                  <p className="font-semibold mt-1">
                    {project.projected_jobs || 0}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 text-sm">
                    Beneficiarios
                  </p>

                  <p className="font-semibold mt-1">
                    {project.beneficiaries || 0}
                  </p>
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}