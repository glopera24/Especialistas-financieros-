import { NextRequest, NextResponse } from "next/server";
import { leadService, requireUser } from "@/lib/supabase/server";
import { z } from "zod";

const LeadSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo.").max(200),
  telefono: z
    .string()
    .min(7, "Ingresa un teléfono válido.")
    .max(20)
    .regex(/^[\d+\s()-]+$/, "Ingresa un teléfono válido."),
  correo: z.string().email("Ingresa un correo válido.").optional().or(z.literal("")),
  ciudad: z.string().max(100).optional(),
  producto: z.enum([
    "hipotecario",
    "vehicular",
    "proteccion_patrimonial",
    "exterior",
    "empresarial",
    "otro",
  ]),
  valor_aproximado: z.string().max(100).optional(),
  mensaje: z.string().max(2000).optional(),
  origen: z.string().max(200).optional(),
  // Honeypot: los bots suelen rellenar todos los campos del formulario,
  // incluyendo este que está oculto por CSS para personas reales.
  sitio_web: z.string().max(0, "").optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sitio_web, ...data } = parsed.data;

    // Honeypot activado → probablemente un bot. Respondemos 200 "éxito"
    // para no revelarle al bot que fue detectado, pero no guardamos nada.
    if (sitio_web) {
      return NextResponse.json({ message: "Solicitud recibida." }, { status: 201 });
    }

    const lead = await leadService.create({
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo || undefined,
      ciudad: data.ciudad,
      producto: data.producto,
      valor_aproximado: data.valor_aproximado,
      mensaje: data.mensaje,
      origen: data.origen,
    });

    return NextResponse.json(
      { data: { id: lead.id }, message: "¡Gracias! Te contactaremos pronto." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json(
      { error: "No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp." },
      { status: 500 }
    );
  }
}

const UpdateEstadoSchema = z.object({
  id: z.string().uuid(),
  estado: z.enum(["nuevo", "contactado", "en_proceso", "cerrado", "descartado"]),
});

// Solo para el CRM interno (/admin) — requiere una sesión real de
// Supabase. El middleware ya protege la página, pero esta ruta se
// llama directamente vía fetch, así que valida la sesión de nuevo aquí.
export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = UpdateEstadoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const lead = await leadService.updateEstado(parsed.data.id, parsed.data.estado);
    return NextResponse.json({ data: lead });
  } catch (err) {
    console.error("[PATCH /api/leads]", err);
    return NextResponse.json({ error: "Error al actualizar el lead." }, { status: 500 });
  }
}
