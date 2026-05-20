import { NextRequest, NextResponse } from "next/server";
import { projectService, userService } from "@/lib/supabase/server";
import { z } from "zod";

const CreateProjectSchema = z.object({
  // User info (creates user if not exists)
  full_name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  city: z.string().min(2).max(100),

  // Project info
  project_name: z.string().min(3).max(300),
  description: z.string().max(5000).optional(),
  sector: z.enum([
    "avicola", "piscicultura", "porcicultura",
    "economia_circular", "agroindustria",
    "turismo_rural", "transformacion_productiva", "otro",
  ]),
  location: z.string().max(200).optional(),
  investment_amount: z.number().positive().optional(),
  projected_jobs: z.number().int().positive().optional(),
  productive_capacity: z.string().max(500).optional(),
  social_impact: z.string().max(2000).optional(),
  beneficiaries: z.number().int().positive().optional(),
  environmental_impact: z.string().max(2000).optional(),
  experience_years: z.number().int().min(0).max(50).optional(),
});

const UpdateProjectSchema = z.object({
  id: z.string().uuid(),
  status: z
    .enum([
      "idea_inicial", "perfil_basico", "prefactibilidad",
      "factibilidad", "en_estructuracion",
      "presentado", "aprobado", "rechazado",
    ])
    .optional(),
  notes: z.string().max(5000).optional(),
  ai_summary: z.string().max(5000).optional(),
  ai_recommendations: z.string().max(5000).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const sector = searchParams.get("sector") || undefined;
    const id = searchParams.get("id");

    if (id) {
      const project = await projectService.getById(id);
      return NextResponse.json({ data: project });
    }

    const projects = await projectService.getAll({ status, sector });
    return NextResponse.json({ data: projects });
  } catch (err) {
    console.error("[GET /api/projects]", err);
    return NextResponse.json({ error: "Error al obtener proyectos." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Get or create user
    const user = await userService.getOrCreate({
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      city: data.city,
    });

    // Create project
    const project = await projectService.create({
      user_id: user.id,
      name: data.project_name,
      description: data.description,
      sector: data.sector,
      status: "idea_inicial",
      investment_amount: data.investment_amount,
      projected_jobs: data.projected_jobs,
      productive_capacity: data.productive_capacity,
      social_impact: data.social_impact,
      beneficiaries: data.beneficiaries,
      environmental_impact: data.environmental_impact,
      location: data.location,
      experience_years: data.experience_years,
    });

    return NextResponse.json(
      { data: project, user_id: user.id, message: "Proyecto creado exitosamente." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/projects]", err);
    return NextResponse.json({ error: "Error al crear el proyecto." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = UpdateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const { id, status, ...rest } = parsed.data;

    if (status) {
      const project = await projectService.updateStatus(id, status, rest.notes);
      return NextResponse.json({ data: project });
    }

    const project = await projectService.update(id, rest);
    return NextResponse.json({ data: project });
  } catch (err) {
    console.error("[PATCH /api/projects]", err);
    return NextResponse.json({ error: "Error al actualizar el proyecto." }, { status: 500 });
  }
}
