import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { MAX_FILE_SIZE, isValidFileType, isValidFileSize } from "@/lib/utils";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "documents";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;
    const userId = formData.get("userId") as string | null;
    const documentType = (formData.get("documentType") as string) || "otro";

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

    // Sanitize filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const safeName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const folderPath = projectId
      ? `${userId || "anonymous"}/${projectId}`
      : `${userId || "anonymous"}/general`;
    const storagePath = `${folderPath}/${safeName}`;

    const supabase = createAdminSupabaseClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[/api/upload] Storage error:", uploadError);
      return NextResponse.json(
        { error: "Error al subir el archivo. Intenta de nuevo." },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    // Persist document metadata if we have projectId and userId
    if (projectId && userId) {
      await supabase.from("documents").insert({
        project_id: projectId,
        user_id: userId,
        document_type: documentType,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: storagePath,
        public_url: urlData.publicUrl,
        status: "pending",
      });
    }

    return NextResponse.json({
      file_name: file.name,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error("[/api/upload] Unexpected error:", err);
    return NextResponse.json(
      { error: "Error interno al procesar el archivo." },
      { status: 500 }
    );
  }
}
