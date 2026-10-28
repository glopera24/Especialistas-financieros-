import { NextRequest, NextResponse } from "next/server";
import { applicationService, requireUser, requireStaff } from "@/lib/supabase/server";
import { z } from "zod";

// Sustituye a la API anterior, ligada a un modelo de negocio ya retirado.
// Esta es la API de solicitudes financieras: el núcleo del CRM.

const PerfilFinancieroSchema = z.record(z.string(), z.unknown()).default({});

const CreateApplicationSchema = z.object({
  producto: z.enum(["hipotecario", "vehicular", "empresarial", "proteccion_patrimonial", "exterior"]),
  valor_solicitado: z.number().positive().optional(),
  perfil_financiero: PerfilFinancieroSchema,
  lead_id: z.string().uuid().optional(),
});

const UpdateApplicationSchema = z.object({
  id: z.string().uuid(),
  estado: z
    .enum([
      "nuevo", "contactado", "diagnostico", "documentacion", "en_analisis",
      "enviado_entidad", "estudio", "aprobado", "desembolsado", "rechazado", "cerrado",
    ])
    .optional(),
  valor_aprobado: z.number().positive().optional(),
  advisor_id: z.string().uuid().optional(),
  resumen_ia: z.string().max(5000).optional(),
  notas: z.string().max(5000).optional(),
});

export async function GET(req: NextRequest) {
  // Listar solicitudes es una operación de staff (CRM interno). Un cliente
  // consulta las suyas propias a través de su propia sesión/RLS, no de
  // este listado general.
  const staff = await requireStaff();
  if (!staff) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const application = await applicationService.getById(id);
      return NextResponse.json({ data: application });
    }

    const applications = await applicationService.getAll({
      estado: searchParams.get("estado") || undefined,
      producto: searchParams.get("producto") || undefined,
      advisor_id: searchParams.get("advisor_id") || undefined,
    });
    return NextResponse.json({ data: applications });
  } catch (err) {
    console.error("[GET /api/applications]", err);
    return NextResponse.json({ error: "Error al obtener solicitudes." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const application = await applicationService.create({
      ...parsed.data,
      client_id: user.id,
    });

    return NextResponse.json(
      { data: application, message: "Solicitud creada exitosamente." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/applications]", err);
    return NextResponse.json({ error: "Error al crear la solicitud." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // Cambiar estado/asesor/valor aprobado es una operación de staff.
  const staff = await requireStaff();
  if (!staff) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = UpdateApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const { id, ...rest } = parsed.data;
    const application = await applicationService.update(id, rest);
    return NextResponse.json({ data: application });
  } catch (err) {
    console.error("[PATCH /api/applications]", err);
    return NextResponse.json({ error: "Error al actualizar la solicitud." }, { status: 500 });
  }
}
