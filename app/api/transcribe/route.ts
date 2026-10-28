import { NextRequest, NextResponse } from "next/server";
import { openai, WHISPER_MODEL } from "@/lib/openai/client";
import { WHISPER_TRANSCRIPTION_PROMPT } from "@/lib/openai/prompts";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB (Whisper limit)
const ALLOWED_AUDIO_TYPES = new Set([
  "audio/webm", "audio/ogg", "audio/mp4",
  "audio/mpeg", "audio/wav", "audio/flac",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No se proporcionó audio." }, { status: 400 });
    }

    if (audioFile.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { error: "El audio supera el límite de 25MB." },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: WHISPER_MODEL,
      language: "es",
      prompt: WHISPER_TRANSCRIPTION_PROMPT,
      response_format: "text",
    });

    return NextResponse.json({ text: transcription });
  } catch (err) {
    console.error("[/api/transcribe] Error:", err);
    return NextResponse.json(
      { error: "Error al transcribir el audio." },
      { status: 500 }
    );
  }
}
