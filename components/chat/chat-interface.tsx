"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Mic, MicOff, Loader2, RefreshCw, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessageBubble } from "./chat-message";
import { useChat } from "@/hooks/use-chat";
import { useAudioRecording, formatDuration } from "@/hooks/use-audio-recording";
import { cn } from "@/lib/utils";

const QUICK_SUGGESTIONS = [
  "Tengo una granja avícola de 5.000 pollos en Cundinamarca",
  "Quiero crear una empresa de reciclaje de plástico",
  "Proyecto de piscicultura de tilapia en el Huila",
  "Agroindustria de transformación de cacao",
  "Turismo rural comunitario en zona cafetera",
];

export default function ChatInterface() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    messagesEndRef,
  } = useChat();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { state: recordingState, startRecording, stopRecording, cancelRecording, duration } = useAudioRecording((text) => {
    sendMessage(text);
  });

  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSend = () => {
    sendMessage();
    textareaRef.current?.focus();
  };

  const canSend = input.trim().length > 0 && !isLoading && !isRecording;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card-premium">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-DEFAULT to-brand-dark flex items-center justify-center shadow-sm">
            <Brain className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Asistente de Estructuración</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT animate-pulse" />
              <span className="text-[11px] text-slate-400">
                {isLoading ? "Escribiendo..." : isProcessing ? "Transcribiendo..." : "En línea · GPT-4o"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={clearMessages}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          title="Limpiar conversación"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* ── Messages ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ChatMessageBubble message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading bubble */}
        {isLoading && messages[messages.length - 1]?.content === "" && null}

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Quick suggestions (only at start) */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <p className="text-[11px] font-medium text-slate-400 px-1">Prueba con un ejemplo:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 bg-white hover:border-brand-DEFAULT hover:text-brand-DEFAULT transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Recording indicator ────────────────────────────── */}
      <AnimatePresence>
        {(isRecording || isProcessing) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-red-50 px-5 py-2.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-700">
                {isProcessing ? "Transcribiendo audio..." : `Grabando · ${formatDuration(duration)}`}
              </span>
            </div>
            {isRecording && (
              <button
                onClick={cancelRecording}
                className="text-red-500 hover:text-red-700 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input ──────────────────────────────────────────── */}
      <div className="border-t border-slate-100 p-4">
        <div className={cn(
          "flex items-end gap-2 bg-[#F8FAFB] rounded-xl p-3 border transition-colors",
          "focus-within:border-brand-DEFAULT focus-within:bg-white"
        )}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe tu proyecto productivo…"
            rows={1}
            disabled={isRecording || isProcessing}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 resize-none outline-none leading-relaxed min-h-[24px] max-h-[140px] scrollbar-hidden disabled:opacity-50"
          />
          <div className="flex items-center gap-1.5 pb-0.5">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading || isProcessing}
              title={isRecording ? "Detener grabación" : "Grabar audio"}
              className={cn(
                "p-1.5 rounded-lg transition-colors disabled:opacity-50",
                isRecording
                  ? "bg-red-100 text-red-500 hover:bg-red-200"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              )}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                canSend
                  ? "bg-brand-DEFAULT text-white hover:bg-brand-dark shadow-sm"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          Enter para enviar · Shift+Enter para nueva línea · Micrófono para hablar
        </p>
      </div>
    </div>
  );
}
