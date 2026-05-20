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

export function getSectorLabel(sector: string): string {
  const labels: Record<string, string> = {
    avicola: "Avícola",
    piscicultura: "Piscicultura",
    porcicultura: "Porcicultura",
    economia_circular: "Economía Circular",
    agroindustria: "Agroindustria",
    turismo_rural: "Turismo Rural",
    transformacion_productiva: "Transformación Productiva",
    otro: "Otro",
  };
  return labels[sector] || sector;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    idea_inicial: "Idea Inicial",
    perfil_basico: "Perfil Básico",
    prefactibilidad: "Prefactibilidad",
    factibilidad: "Factibilidad",
    en_estructuracion: "En Estructuración",
    presentado: "Presentado",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    idea_inicial: { bg: "bg-slate-100", text: "text-slate-700" },
    perfil_basico: { bg: "bg-blue-50", text: "text-blue-700" },
    prefactibilidad: { bg: "bg-amber-50", text: "text-amber-700" },
    factibilidad: { bg: "bg-violet-50", text: "text-violet-700" },
    en_estructuracion: { bg: "bg-brand-50", text: "text-brand-700" },
    presentado: { bg: "bg-cyan-50", text: "text-cyan-700" },
    aprobado: { bg: "bg-green-50", text: "text-green-700" },
    rechazado: { bg: "bg-red-50", text: "text-red-700" },
  };
  return colors[status] || { bg: "bg-slate-100", text: "text-slate-700" };
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
