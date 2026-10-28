import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, requireUser, applicationService, applicationDocumentService } from "@/lib/supabase/server";
import { MAX_FILE_SIZE } from "@/lib/utils";

// AUDITORÍA: esta ruta confiaba en un `userId`/`projectId` enviados por el
// cliente en el FormData, sin verificar nada contra la sesión real. Cualquiera
// podía enviar el ID de otra persona y el archivo (y su fila en la tabla de
// documentos) quedaba atribuido a esa identidad ajena. Los documentos
// financieros son información privada — ahora el ID viene SIEMPRE de la
// sesión autenticada en el servidor, nunca del formulario, y se verifica que
// la solicitud (`applicationId`) pertenezca a ese mismo usuario antes de
// aceptar el archivo. Además se devuelve una URL firmada (el bucket es
// privado) en vez de `getPublicUrl`, que no habría funcionado de todos modos.

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "documents";
const DOCUMENT_TYPES = new Set([
  "cedula", "rut", "certificado_laboral", "extractos_bancarios",
  "camara_comercio", "estados_financieros", "predial", "otro",
]);

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const applicationId = formData.get("applicationId") as string | null;
    const documentTypeRaw = (formData.get("documentType") as string) || "otro";
    const documentType = DOCUMENT_TYPES.has(documentTypeRaw) ? documentTypeRaw : "otro";

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo PDF, JPG, PNG y WebP." },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el tamaño máximo de 10MB." },
        { status: 400 }
      );
    }

    // Si se asocia a una solicitud, verificar que sea del usuario autenticado
    // (o que sea staff) antes de aceptar el archivo.
    if (applicationId) {
      const application = await applicationService.getById(applicationId).catch(() => null);
      if (!application || application.client_id !== user.id) {
        return NextResponse.json(
          { error: "No tienes acceso a esta solicitud." },
          { status: 403 }
        );
      }
    }

    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const safeName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    // El primer segmento SIEMPRE es user.id (identidad real de la sesión),
    // igual que exige la política de storage en schema.sql.
    const storagePath = applicationId
      ? `${user.id}/${applicationId}/${safeName}`
      : `${user.id}/general/${safeName}`;

    const supabase = createAdminSupabaseClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: file.type, cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("[/api/upload] Storage error:", uploadError);
      return NextResponse.json({ error: "Error al subir el archivo. Intenta de nuevo." }, { status: 500 });
    }

    // Bucket privado: una URL firmada con expiración, no una URL pública.
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 60 * 10); // 10 minutos

    if (applicationId) {
      await applicationDocumentService.create({
        application_id: applicationId,
        client_id: user.id,
        document_type: documentType as any,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: storagePath,
      });
    }

    return NextResponse.json({
      file_name: file.name,
      storage_path: storagePath,
      size: file.size,
      signed_url: signedUrlData?.signedUrl,
    });
  } catch (err) {
    console.error("[/api/upload] Unexpected error:", err);
    return NextResponse.json({ error: "Error interno al procesar el archivo." }, { status: 500 });
  }
}
