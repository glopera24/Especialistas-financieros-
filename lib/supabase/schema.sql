-- ============================================================
-- Especialistas Financieros — Supabase Schema
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLA: users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  id_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Service role can do everything on users" ON public.users
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLA: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sector TEXT NOT NULL CHECK (
    sector IN (
      'avicola', 'piscicultura', 'porcicultura',
      'economia_circular', 'agroindustria',
      'turismo_rural', 'transformacion_productiva', 'otro'
    )
  ),
  status TEXT NOT NULL DEFAULT 'idea_inicial' CHECK (
    status IN (
      'idea_inicial', 'perfil_basico', 'prefactibilidad',
      'factibilidad', 'en_estructuracion',
      'presentado', 'aprobado', 'rechazado'
    )
  ),
  investment_amount NUMERIC(18,2),
  projected_jobs INTEGER,
  productive_capacity TEXT,
  social_impact TEXT,
  beneficiaries INTEGER,
  environmental_impact TEXT,
  location TEXT,
  experience_years INTEGER,
  maturity_level INTEGER DEFAULT 1 CHECK (maturity_level BETWEEN 1 AND 5),
  risk_level TEXT DEFAULT 'bajo' CHECK (risk_level IN ('bajo', 'medio', 'alto')),
  ai_summary TEXT,
  ai_recommendations TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects" ON public.projects
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role can do everything on projects" ON public.projects
  USING (auth.role() = 'service_role');

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_sector ON public.projects(sector);

-- ============================================================
-- TABLA: documents
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL DEFAULT 'otro' CHECK (
    document_type IN (
      'rut', 'camara_comercio', 'cedula', 'predial',
      'cotizacion', 'estado_financiero', 'foto_predio', 'otro'
    )
  ),
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'reviewing', 'approved', 'rejected')
  ),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own documents" ON public.documents
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role can do everything on documents" ON public.documents
  USING (auth.role() = 'service_role');

CREATE INDEX idx_documents_project_id ON public.documents(project_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);

-- ============================================================
-- TABLA: conversations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own conversations" ON public.conversations
  USING (auth.uid()::text = user_id::text OR user_id IS NULL);

CREATE POLICY "Service role can do everything on conversations" ON public.conversations
  USING (auth.role() = 'service_role');

CREATE INDEX idx_conversations_session_id ON public.conversations(session_id);
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);

-- ============================================================
-- TABLA: project_status_history
-- ============================================================
CREATE TABLE IF NOT EXISTS public.project_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything on history" ON public.project_status_history
  USING (auth.role() = 'service_role');

-- ============================================================
-- FUNCIÓN: update_updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER trigger_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- ============================================================
-- STORAGE BUCKET: documents
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.role() = 'service_role')
  );

CREATE POLICY "Service role can manage all documents" ON storage.objects
  USING (bucket_id = 'documents' AND auth.role() = 'service_role');
