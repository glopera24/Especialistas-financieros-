"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage } from "@/types";
import { generateSessionId } from "@/lib/utils";

interface UseChatOptions {
  initialMessages?: ChatMessage[];
  sessionId?: string;
  onError?: (error: string) => void;
}

interface UseChatReturn {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  sendMessage: (content?: string) => Promise<void>;
  clearMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "initial",
  role: "assistant",
  content: `¡Hola! Soy el asistente de estructuración de **Especialistas Financieros** 👋

Estoy aquí para ayudarte a organizar tu proyecto productivo técnica y financieramente.

**¿Qué puedo hacer por ti?**
- Analizar y clasificar tu proyecto por sector
- Identificar qué documentos necesitas
- Detectar brechas para acceder a financiación
- Recomendarte la ruta de financiación más adecuada

Cuéntame: **¿en qué consiste tu proyecto?** Puedes describirlo con tus propias palabras, no te preocupes por usar términos técnicos.`,
  created_at: new Date().toISOString(),
};

export function useChat({
  initialMessages = [INITIAL_MESSAGE],
  sessionId: initialSessionId,
  onError,
}: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => initialSessionId || generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (content?: string) => {
      const messageContent = content || input.trim();
      if (!messageContent || isLoading) return;

      setInput("");
      setError(null);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: messageContent,
        created_at: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map(({ role, content }) => ({ role, content })),
            sessionId,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Error al conectar con el asistente.");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No se pudo leer la respuesta.");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              accumulated += delta;

              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last.role === "assistant") {
                  return [...prev.slice(0, -1), { ...last, content: accumulated }];
                }
                return prev;
              });
            } catch {}
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        const errorMsg =
          err instanceof Error
            ? err.message
            : "Ha ocurrido un error inesperado. Por favor intenta de nuevo.";

        setError(errorMsg);
        onError?.(errorMsg);

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === "assistant" && last.content === "") {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [input, messages, isLoading, sessionId, onError]
  );

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sessionId,
    sendMessage,
    clearMessages,
    messagesEndRef,
  };
}
