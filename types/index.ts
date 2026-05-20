// ============================================================
// types/index.ts — Global TypeScript Types
// ============================================================

export type ProjectStatus =
  | "idea_inicial"
  | "perfil_basico"
  | "prefactibilidad"
  | "factibilidad"
  | "en_estructuracion"
  | "presentado"
  | "aprobado"
  | "rechazado";

export type ProjectSector =
  | "avicola"
  | "piscicultura"
  | "porcicultura"
  | "economia_circular"
  | "agroindustria"
  | "turismo_rural"
  | "transformacion_productiva"
  | "otro";

export type DocumentType =
  | "rut"
  | "camara_comercio"
  | "cedula"
  | "predial"
  | "cotizacion"
  | "estado_financiero"
  | "foto_predio"
  | "otro";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  beneficiaries?: number
  environmental_impact?: string
  id: string;
  user_id: string;
  name: string;
  description?: string;
  sector: ProjectSector;
  status: ProjectStatus;
  investment_amount?: number;
  projected_jobs?: number;
  social_impact?: string;
  productive_capacity?: string;
  location?: string;
  experience_years?: number;
  maturity_level?: number;
  risk_level?: "bajo" | "medio" | "alto";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  project_id: string;
  user_id: string;
  document_type: DocumentType;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  public_url?: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  notes?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  project_id?: string;
  user_id?: string;
  session_id: string;
  messages: ChatMessage[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProjectStatusRecord {
  id: string;
  project_id: string;
  status: ProjectStatus;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

export interface ProjectFormData {
  // Step 1 — Personal
  full_name: string;
  email: string;
  phone: string;
  city: string;
  id_number?: string;

  // Step 2 — Project
  project_name: string;
  sector: ProjectSector;
  description: string;
  location: string;
  experience_years: number;

  // Step 3 — Financial
  investment_amount: number;
  projected_jobs: number;
  productive_capacity: string;

  // Step 4 — Social Impact
  social_impact: string;
  beneficiaries?: number;
  environmental_impact?: string;

  // Step 5 — Documents
  documents: File[];
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  file_name: string;
  storage_path: string;
  public_url: string;
  size: number;
}

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  approved_projects: number;
  total_investment: number;
  total_documents: number;
  pending_review: number;
}

export interface SectorInfo {
  id: ProjectSector;
  label: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface ProblemCard {
  icon: string;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export interface TimelineStep {
  number: string;
  icon: string;
  title: string;
  description: string;
}
