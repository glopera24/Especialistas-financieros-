"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import ProjectScore from "./project-score";
import ProjectAIAnalysis from "./project-ai-analysis";

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

  const calculateScore = (project: any) => {

    const score = (
      (
        (project.experience_years || 0) * 5 +
        (project.projected_jobs || 0) * 1 +
        (project.beneficiaries || 0) * 0.3
      ) / 2
    );

    return score > 100 ? 100 : Math.floor(score);

  };

  return (

    <div className="bg-zinc-900 rounded-2xl p-6 mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Mis Proyectos
      </h2>

      <div className="space-y-4">

        {projects.map((project) => (

          <div
            key={project.id}
            className="border border-zinc-800 rounded-xl p-5 bg-black/20"
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

            <div className="mt-5">

              <p className="text-zinc-400 text-sm">
                Inversión solicitada
              </p>

              <p className="text-3xl font-bold mt-1">
                $
                {Number(
                  project.investment_amount || 0
                ).toLocaleString("es-CO")}
              </p>

            </div>

            <div className="mt-6">

              <ProjectScore
                score={calculateScore(project)}
              />

            </div>

            <ProjectAIAnalysis
              sector={project.sector}
              score={calculateScore(project)}
            />

          </div>

        ))}

      </div>

    </div>

  );
}