"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Brain, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-dot-1" />
      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-dot-2" />
      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-dot-3" />
    </div>
  );
}

export const ChatMessageBubble = memo(function ChatMessageBubble({
  message,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const isEmpty = !message.content && message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          isUser
            ? "bg-brand-DEFAULT/15 text-brand-DEFAULT"
            : "bg-slate-100 text-slate-600"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Brain className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-brand-DEFAULT text-white rounded-tr-sm"
            : "bg-[#F8FAFB] border border-slate-100 text-slate-800 rounded-tl-sm"
        )}
      >
        {isEmpty ? (
          <TypingDots />
        ) : isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-chat text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 text-slate-700 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="text-slate-700 text-sm">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                h1: ({ children }) => <h1 className="text-sm font-semibold text-slate-900 mb-1.5 mt-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-semibold text-slate-900 mb-1.5 mt-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold text-slate-900 mb-1 mt-2">{children}</h3>,
                code: ({ children }) => (
                  <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[12px] font-mono">{children}</code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-brand-DEFAULT pl-3 my-2 text-slate-600 italic">{children}</blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatMessageBubble;
