import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type {
  FinancialApplication,
  ApplicationDocument,
  Activity,
  Conversation,
  Lead,
  Profile,
} from "@/types";

// ─── Server Client (usa la sesión del usuario) ──────────────
// Next.js 15: cookies() ahora es async, así que este helper también lo es.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {}
        },
      },
    }
  );
}

// ─── Admin Client (bypasses RLS — solo en el servidor) ──────
export function createAdminSupabaseClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// ─── Auth helpers para Route Handlers ───────────────────────
// El middleware ya protege las páginas /admin y /dashboard, pero las
// rutas de API se llaman directamente y necesitan su propia verificación.
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Verifica sesión real Y rol de staff (advisor/admin) — no basta con estar
 * autenticado. Reemplaza la comprobación anterior de /admin, que solo
 * miraba si había sesión y habría dejado entrar a cualquier cliente.
 */
export async function requireStaff() {
  const user = await requireUser();
  if (!user) return null;

  const admin = createAdminSupabaseClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "advisor" && profile.role !== "admin")) {
    return null;
  }
  return { user, role: profile.role as "advisor" | "admin" };
}

// ─── Profile Services ────────────────────────────────────────
export const profileService = {
  async getById(id: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (error) throw error;
    return data as Profile;
  },
};

// ─── Lead Services ──────────────────────────────────────────
// Reemplaza el patrón anterior de archivos planos (_leads/*.json,
// crm/leads.json) que quedaban públicamente accesibles. Solo staff o el
// service role pueden leer/listar leads; el formulario público únicamente
// inserta a través de /api/leads.
export const leadService = {
  async create(data: Omit<Lead, "id" | "created_at" | "estado" | "application_id">) {
    const supabase = createAdminSupabaseClient();
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({ ...data, estado: "nuevo" })
      .select()
      .single();
    if (error) throw error;
    return lead as Lead;
  },

  async getAll(filters?: { producto?: string; estado?: string }) {
    const supabase = createAdminSupabaseClient();
    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

    if (filters?.producto) query = query.eq("producto", filters.producto);
    if (filters?.estado) query = query.eq("estado", filters.estado);

    const { data, error } = await query;
    if (error) throw error;
    return data as Lead[];
  },

  async updateEstado(id: string, estado: Lead["estado"]) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("leads")
      .update({ estado })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Lead;
  },
};

// ─── Financial Application Services (núcleo del CRM) ────────
// Reemplaza por completo al servicio anterior, ligado a un modelo de
// negocio ya retirado.
export const applicationService = {
  async create(data: Partial<FinancialApplication> & { producto: FinancialApplication["producto"] }) {
    const supabase = createAdminSupabaseClient();
    const { data: application, error } = await supabase
      .from("financial_applications")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return application as FinancialApplication;
  },

  async getById(id: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("financial_applications")
      .select("*, application_documents(*), activities(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as FinancialApplication & {
      application_documents: ApplicationDocument[];
      activities: Activity[];
    };
  },

  async getAll(filters?: { estado?: string; producto?: string; client_id?: string; advisor_id?: string }) {
    const supabase = createAdminSupabaseClient();
    let query = supabase
      .from("financial_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.estado) query = query.eq("estado", filters.estado);
    if (filters?.producto) query = query.eq("producto", filters.producto);
    if (filters?.client_id) query = query.eq("client_id", filters.client_id);
    if (filters?.advisor_id) query = query.eq("advisor_id", filters.advisor_id);

    const { data, error } = await query;
    if (error) throw error;
    return data as FinancialApplication[];
  },

  async update(id: string, data: Partial<FinancialApplication>) {
    const supabase = createAdminSupabaseClient();
    const { data: application, error } = await supabase
      .from("financial_applications")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return application as FinancialApplication;
  },

  /** KPIs reales para el CRM (app/admin) — nunca cifras fijas en el frontend. */
  async getStats() {
    const supabase = createAdminSupabaseClient();
    const [{ data: applications }, { data: leadsNuevos }] = await Promise.all([
      supabase.from("financial_applications").select("estado, valor_solicitado, valor_aprobado"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("estado", "nuevo"),
    ]);

    const apps = applications || [];
    const sum = (rows: typeof apps, field: "valor_solicitado" | "valor_aprobado") =>
      rows.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);

    return {
      leads_nuevos: (leadsNuevos as unknown as { count: number })?.count ?? 0,
      solicitudes_activas: apps.filter((a) => !["cerrado", "rechazado", "desembolsado"].includes(a.estado)).length,
      solicitudes_en_analisis: apps.filter((a) => a.estado === "en_analisis" || a.estado === "estudio").length,
      solicitudes_enviadas: apps.filter((a) => a.estado === "enviado_entidad").length,
      solicitudes_aprobadas: apps.filter((a) => a.estado === "aprobado" || a.estado === "desembolsado").length,
      solicitudes_rechazadas: apps.filter((a) => a.estado === "rechazado").length,
      valor_solicitado_total: sum(apps, "valor_solicitado"),
      valor_gestionado_total: sum(apps, "valor_aprobado"),
    };
  },
};

// ─── Application Document Services ──────────────────────────
export const applicationDocumentService = {
  async create(data: Omit<ApplicationDocument, "id" | "created_at" | "status">) {
    const supabase = createAdminSupabaseClient();
    const { data: doc, error } = await supabase
      .from("application_documents")
      .insert({ ...data, status: "pending" })
      .select()
      .single();
    if (error) throw error;
    return doc as ApplicationDocument;
  },

  async getByApplication(applicationId: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("application_documents")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ApplicationDocument[];
  },
};

// ─── Activity Services (seguimiento comercial) ──────────────
export const activityService = {
  async create(data: Omit<Activity, "id" | "created_at">) {
    const supabase = createAdminSupabaseClient();
    const { data: activity, error } = await supabase
      .from("activities")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return activity as Activity;
  },

  async getByApplication(applicationId: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Activity[];
  },
};

// ─── Conversation Services (Asistente de Diagnóstico Financiero) ──
export const conversationService = {
  async getOrCreate(sessionId: string, clientId?: string) {
    const supabase = createAdminSupabaseClient();
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (existing) return existing as Conversation;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ session_id: sessionId, client_id: clientId, messages: [] })
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  },

  async appendMessage(sessionId: string, message: { role: string; content: string }) {
    const supabase = createAdminSupabaseClient();
    const conversation = await this.getOrCreate(sessionId);
    const messages = [
      ...(conversation.messages as any[]),
      { ...message, id: crypto.randomUUID(), created_at: new Date().toISOString() },
    ];

    const { data, error } = await supabase
      .from("conversations")
      .update({ messages })
      .eq("session_id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  },
};
