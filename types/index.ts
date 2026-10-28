// ============================================================
// types/index.ts — Tipos globales del dominio financiero
// (reemplaza por completo el modelo anterior de "proyectos
// productivos" — ProjectStatus/ProjectSector/Project/SectorInfo
// ya no existen en este archivo)
// ============================================================

export type UserRole = "client" | "advisor" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type LeadProducto =
  | "hipotecario"
  | "vehicular"
  | "empresarial"
  | "proteccion_patrimonial"
  | "exterior"
  | "otro";

export type LeadEstado =
  | "nuevo"
  | "contactado"
  | "en_proceso"
  | "cerrado"
  | "descartado";

export interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  correo?: string;
  ciudad?: string;
  producto: LeadProducto;
  valor_aproximado?: string;
  mensaje?: string;
  origen?: string;
  estado: LeadEstado;
  application_id?: string;
  created_at: string;
}

/** Línea financiera — usada por financial_applications (no admite "otro": toda solicitud real cae en una línea concreta). */
export type FinancialProduct =
  | "hipotecario"
  | "vehicular"
  | "empresarial"
  | "proteccion_patrimonial"
  | "exterior";

export type ApplicationStatus =
  | "nuevo"
  | "contactado"
  | "diagnostico"
  | "documentacion"
  | "en_analisis"
  | "enviado_entidad"
  | "estudio"
  | "aprobado"
  | "desembolsado"
  | "rechazado"
  | "cerrado";

/**
 * Estructura libre porque cada línea de negocio recopila datos distintos
 * en el diagnóstico (ver lib/openai/prompts.ts). Todos los campos son
 * opcionales: se llenan progresivamente a medida que el cliente responde.
 */
export interface PerfilFinanciero {
  // Comunes
  tipo_cliente?: "empleado" | "independiente" | "empresa";
  ingresos_mensuales?: number;
  antiguedad_laboral_anios?: number;
  obligaciones_actuales?: string;
  // Hipotecario / Vehicular
  valor_inmueble_o_vehiculo?: number;
  cuota_inicial_disponible?: number;
  es_primera_vivienda?: boolean;
  tipo_operacion?: "compra" | "construccion" | "remodelacion" | "inversion" | "leasing" | "compra_cartera";
  // Empresarial
  actividad_economica?: string;
  antiguedad_empresa_anios?: number;
  flujo_de_caja_mensual?: number;
  garantias_disponibles?: string;
  destino_recursos?: string;
  // Protección patrimonial / inversión
  objetivo_inversion?: string;
  horizonte_anios?: number;
  patrimonio_estimado?: number;
  capacidad_ahorro_mensual?: number;
  // Colombianos en el exterior
  pais_residencia?: string;
  moneda_ingresos?: string;
  tipo_vinculacion?: string;
  proposito_en_colombia?: string;
  [key: string]: unknown;
}

export interface FinancialApplication {
  id: string;
  lead_id?: string;
  client_id?: string;
  advisor_id?: string;
  producto: FinancialProduct;
  estado: ApplicationStatus;
  valor_solicitado?: number;
  valor_aprobado?: number;
  perfil_financiero: PerfilFinanciero;
  resumen_ia?: string;
  proxima_actividad_at?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export type DocumentType =
  | "cedula"
  | "rut"
  | "certificado_laboral"
  | "extractos_bancarios"
  | "camara_comercio"
  | "estados_financieros"
  | "predial"
  | "otro";

export interface ApplicationDocument {
  id: string;
  application_id: string;
  client_id: string;
  document_type: DocumentType;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  notes?: string;
  created_at: string;
}

export type ActivityType = "llamada" | "whatsapp" | "correo" | "reunion" | "nota" | "cambio_estado";

export interface Activity {
  id: string;
  application_id: string;
  tipo: ActivityType;
  descripcion: string;
  created_by?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  application_id?: string;
  client_id?: string;
  session_id: string;
  messages: ChatMessage[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  file_name: string;
  storage_path: string;
  size: number;
  signed_url: string;
}

/** KPIs del CRM (app/admin). Todos se calculan desde Supabase — nunca cifras fijas. */
export interface CrmStats {
  leads_nuevos: number;
  solicitudes_activas: number;
  solicitudes_en_analisis: number;
  solicitudes_enviadas: number;
  solicitudes_aprobadas: number;
  solicitudes_rechazadas: number;
  valor_solicitado_total: number;
  valor_gestionado_total: number;
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
