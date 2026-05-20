import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Project, Document, Conversation, User } from "@/types";

// ─── Server Client (uses user session) ─────────────────────
export function createClient() {
  const cookieStore = cookies();
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

// ─── Admin Client (bypasses RLS) ───────────────────────────
export function createAdminSupabaseClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// ─── Project Services ──────────────────────────────────────
export const projectService = {
  async create(data: Omit<Project, "id" | "created_at" | "updated_at">) {
    const supabase = createAdminSupabaseClient();
    const { data: project, error } = await supabase
      .from("projects")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return project as Project;
  },

  async getById(id: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, documents(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Project & { documents: Document[] };
  },

  async getAll(filters?: { status?: string; sector?: string }) {
    const supabase = createAdminSupabaseClient();
    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.sector) query = query.eq("sector", filters.sector);

    const { data, error } = await query;
    if (error) throw error;
    return data as Project[];
  },

  async update(id: string, data: Partial<Project>) {
    const supabase = createAdminSupabaseClient();
    const { data: project, error } = await supabase
      .from("projects")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return project as Project;
  },

  async updateStatus(id: string, status: Project["status"], notes?: string) {
    const supabase = createAdminSupabaseClient();
    const { data: current } = await supabase
      .from("projects")
      .select("status")
      .eq("id", id)
      .single();

    await supabase.from("project_status_history").insert({
      project_id: id,
      old_status: current?.status,
      new_status: status,
      notes,
    });

    return this.update(id, { status });
  },
};

// ─── Document Services ─────────────────────────────────────
export const documentService = {
  async create(data: Omit<Document, "id" | "created_at">) {
    const supabase = createAdminSupabaseClient();
    const { data: doc, error } = await supabase
      .from("documents")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return doc as Document;
  },

  async getByProject(projectId: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Document[];
  },

  async uploadToStorage(
    file: File,
    userId: string,
    projectId: string
  ): Promise<{ path: string; publicUrl: string }> {
    const supabase = createAdminSupabaseClient();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${userId}/${projectId}/${fileName}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || "documents")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || "documents")
      .getPublicUrl(path);

    return { path, publicUrl: urlData.publicUrl };
  },
};

// ─── Conversation Services ─────────────────────────────────
export const conversationService = {
  async getOrCreate(sessionId: string, userId?: string) {
    const supabase = createAdminSupabaseClient();
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (existing) return existing as Conversation;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ session_id: sessionId, user_id: userId, messages: [] })
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  },

  async appendMessage(sessionId: string, message: { role: string; content: string }) {
    const supabase = createAdminSupabaseClient();
    const conversation = await this.getOrCreate(sessionId);
    const messages = [...(conversation.messages as any[]), {
      ...message,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }];

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

// ─── User Services ─────────────────────────────────────────
export const userService = {
  async getOrCreate(data: Pick<User, "email" | "full_name" | "phone" | "city">) {
    const supabase = createAdminSupabaseClient();
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email)
      .single();

    if (existing) return existing as User;

    const { data: created, error } = await supabase
      .from("users")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as User;
  },
};
