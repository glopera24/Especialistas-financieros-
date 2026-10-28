import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30_000,
});

export const CHAT_MODEL = "gpt-4o" as const;
export const WHISPER_MODEL = "whisper-1" as const;
export const MAX_TOKENS = 1024 as const;
export const TEMPERATURE = 0.7 as const;
