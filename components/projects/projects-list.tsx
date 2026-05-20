"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProjectsList() {

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {

    const fetchProjects = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);
      }

    };

    fetchProjects();

  }, []);

  return (

    <div className="bg-zinc-900 rounded-2xl p-6 mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Mis Proyectos
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

                <p className="text-zinc-400 mt-1">
                  {project.sector}
                </p>

              </div>

              <div className="text-right">

                <p className="text-sm text-zinc-500">
                  Estado
                </p>

                <p className="font-semibold">
                  {project.status}
                </p>

              </div>

            </div>

            <div className="mt-4">

              <p className="text-zinc-400 text-sm">
                Inversión solicitada
              </p>

              <p className="text-2xl font-bold mt-1">
                ${Number(project.investment_amount).toLocaleString("es-CO")}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}