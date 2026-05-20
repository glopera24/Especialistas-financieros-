import { NextRequest, NextResponse } from "next/server";
import { openai, CHAT_MODEL, MAX_TOKENS, TEMPERATURE } from "@/lib/openai/client";
import { MAIN_SYSTEM_PROMPT } from "@/lib/openai/prompts";
import { conversationService } from "@/lib/supabase/server";
import { z } from "zod";

const RequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(10000),
      })
    )
    .min(1)
    .max(100),
  sessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de solicitud inválidos." },
        { status: 400 }
      );
    }

    const { messages, sessionId } = parsed.data;

    // Persist conversation to Supabase (non-blocking)
    if (sessionId) {
      const lastMessage = messages[messages.length - 1];
      conversationService
        .appendMessage(sessionId, {
          role: lastMessage.role,
          content: lastMessage.content,
        })
        .catch(console.error);
    }

    const stream = await openai.chat.completions.create({
      model: CHAT_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      stream: true,
      messages: [
        { role: "system", content: MAIN_SYSTEM_PROMPT },
        ...messages.map(({ role, content }) => ({ role, content })),
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullContent = "";
        try {
          for await (const chunk of stream) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            fullContent += chunk.choices[0]?.delta?.content || "";
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));

          // Persist assistant response (non-blocking)
          if (sessionId && fullContent) {
            conversationService
              .appendMessage(sessionId, {
                role: "assistant",
                content: fullContent,
              })
              .catch(console.error);
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
