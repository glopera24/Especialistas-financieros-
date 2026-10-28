import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "COP",
  locale: string = "es-CO"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDate(date: string | Date, locale: string = "es-CO"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getApplicationStatusLabel(estado: string): string {
  const labels: Record<string, string> = {
    nuevo: "Nuevo",
    contactado: "Contactado",
    diagnostico: "Diagnóstico",
    documentacion: "Documentación",
    en_analisis: "En análisis",
    enviado_entidad: "Enviado a entidad",
    estudio: "En estudio",
    aprobado: "Aprobado",
    desembolsado: "Desembolsado",
    rechazado: "Rechazado",
    cerrado: "Cerrado",
  };
  return labels[estado] || estado;
}

export function getApplicationStatusColor(estado: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    nuevo: { bg: "bg-blue-50", text: "text-blue-700" },
    contactado: { bg: "bg-cyan-50", text: "text-cyan-700" },
    diagnostico: { bg: "bg-violet-50", text: "text-violet-700" },
    documentacion: { bg: "bg-amber-50", text: "text-amber-700" },
    en_analisis: { bg: "bg-orange-50", text: "text-orange-700" },
    enviado_entidad: { bg: "bg-indigo-50", text: "text-indigo-700" },
    estudio: { bg: "bg-purple-50", text: "text-purple-700" },
    aprobado: { bg: "bg-blue-50", text: "text-blue-700" },
    desembolsado: { bg: "bg-blue-50", text: "text-blue-700" },
    rechazado: { bg: "bg-red-50", text: "text-red-700" },
    cerrado: { bg: "bg-slate-100", text: "text-slate-700" },
  };
  return colors[estado] || { bg: "bg-slate-100", text: "text-slate-700" };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^[\d\s\+\-\(\)]{7,15}$/.test(phone.replace(/\s/g, ""));
}

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function isValidFileType(file: File): boolean {
  return Object.keys(ACCEPTED_FILE_TYPES).includes(file.type);
}

export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
