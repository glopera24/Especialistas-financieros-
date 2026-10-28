-- ============================================================
-- Especialistas Financieros — Esquema de Supabase
-- Ejecutar en el SQL Editor de Supabase (orden: de arriba a abajo)
-- ============================================================
--
-- NOTA DE MIGRACIÓN: si tu proyecto de Supabase ya tenía tablas del
-- modelo de negocio anterior con datos reales dentro, NO ejecutes un
-- DROP sobre ellas a partir de este archivo — este esquema ya no las
-- define ni las usa. Antes de eliminarlas manualmente, exporta una
-- copia de seguridad desde el panel de Supabase (Database → Backups)
-- y confirma que no necesitas conservar esa información.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLA: profiles
-- Extiende auth.users con rol y datos de contacto. Reemplaza a la
-- antigua tabla `users` (que no estaba ligada a auth.users por FK).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'advisor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Función auxiliar: evita repetir el subquery de rol en cada política.
-- SECURITY DEFINER para poder leer profiles incluso si la política de
-- SELECT de profiles no lo permitiría directamente (evita recursión).
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT COALESCE(public.current_user_role() IN ('advisor', 'admin'), false);
$$;

CREATE POLICY "Un usuario lee su propio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_staff());

CREATE POLICY "Un usuario actualiza su propio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role administra profiles" ON public.profiles
  USING (auth.role() = 'service_role');

-- Crea el profile automáticamente cuando alguien se registra en Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- TABLA: leads
-- Captación pública (formulario web). Reemplazó al patrón anterior
-- de _leads/*.json + crm/leads.json (archivos planos públicos sin
-- protección real). El formulario público solo puede INSERTAR; leer
-- leads requiere ser staff (advisor/admin) o el service role.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  correo TEXT,
  ciudad TEXT,
  producto TEXT NOT NULL CHECK (
    producto IN ('hipotecario', 'vehicular', 'empresarial', 'proteccion_patrimonial', 'exterior', 'otro')
  ),
  valor_aproximado TEXT,
  mensaje TEXT,
  origen TEXT,
  estado TEXT NOT NULL DEFAULT 'nuevo' CHECK (
    estado IN ('nuevo', 'contactado', 'en_proceso', 'cerrado', 'descartado')
  ),
  application_id UUID, -- se referencia después de crear financial_applications
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede crear un lead" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff administra los leads" ON public.leads
  USING (public.is_staff());

CREATE POLICY "Service role administra los leads" ON public.leads
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_leads_producto ON public.leads(producto);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON public.leads(estado);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- ============================================================
-- TABLA: financial_applications (Solicitudes financieras)
-- Núcleo del CRM.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.financial_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  producto TEXT NOT NULL CHECK (
    producto IN ('hipotecario', 'vehicular', 'empresarial', 'proteccion_patrimonial', 'exterior')
  ),
  estado TEXT NOT NULL DEFAULT 'nuevo' CHECK (
    estado IN (
      'nuevo', 'contactado', 'diagnostico', 'documentacion', 'en_analisis',
      'enviado_entidad', 'estudio', 'aprobado', 'desembolsado', 'rechazado', 'cerrado'
    )
  ),
  valor_solicitado NUMERIC(18, 2),
  valor_aprobado NUMERIC(18, 2),
  -- Perfil financiero: estructura flexible porque cada línea (hipotecario,
  -- vehicular, empresarial, protección patrimonial, exterior) recopila datos
  -- distintos (ver lib/openai/prompts.ts). JSONB evita 20 columnas nulas.
  perfil_financiero JSONB NOT NULL DEFAULT '{}'::jsonb,
  resumen_ia TEXT,
  proxima_actividad_at TIMESTAMPTZ,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.financial_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cliente ve y crea sus propias solicitudes" ON public.financial_applications
  FOR SELECT USING (client_id = auth.uid() OR public.is_staff());

CREATE POLICY "Cliente crea su propia solicitud" ON public.financial_applications
  FOR INSERT WITH CHECK (client_id = auth.uid() OR public.is_staff());

CREATE POLICY "Staff actualiza cualquier solicitud" ON public.financial_applications
  FOR UPDATE USING (public.is_staff());

CREATE POLICY "Cliente actualiza su propia solicitud" ON public.financial_applications
  FOR UPDATE USING (client_id = auth.uid());

CREATE POLICY "Service role administra financial_applications" ON public.financial_applications
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_applications_client ON public.financial_applications(client_id);
CREATE INDEX IF NOT EXISTS idx_applications_advisor ON public.financial_applications(advisor_id);
CREATE INDEX IF NOT EXISTS idx_applications_estado ON public.financial_applications(estado);
CREATE INDEX IF NOT EXISTS idx_applications_producto ON public.financial_applications(producto);

ALTER TABLE public.leads
  ADD CONSTRAINT leads_application_id_fkey
  FOREIGN KEY (application_id) REFERENCES public.financial_applications(id) ON DELETE SET NULL;

-- ============================================================
-- TABLA: application_documents
-- Documentos adjuntos a una solicitud financiera. Se llama distinto a
-- la tabla `documents` del esquema anterior (ver sección LEGACY) para
-- no chocar con datos reales que puedan existir ahí.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.financial_applications(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL DEFAULT 'otro' CHECK (
    document_type IN (
      'cedula', 'rut', 'certificado_laboral', 'extractos_bancarios',
      'camara_comercio', 'estados_financieros', 'predial', 'otro'
    )
  ),
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'reviewing', 'approved', 'rejected')
  ),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cliente ve y sube sus propios documentos" ON public.application_documents
  USING (client_id = auth.uid() OR public.is_staff());

CREATE POLICY "Service role administra application_documents" ON public.application_documents
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_app_documents_application ON public.application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_app_documents_client ON public.application_documents(client_id);

-- ============================================================
-- TABLA: activities (seguimiento comercial)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.financial_applications(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('llamada', 'whatsapp', 'correo', 'reunion', 'nota', 'cambio_estado')),
  descripcion TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff administra activities" ON public.activities
  USING (public.is_staff());

CREATE POLICY "Cliente ve activities de su propia solicitud" ON public.activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.financial_applications fa
      WHERE fa.id = application_id AND fa.client_id = auth.uid()
    )
  );

CREATE POLICY "Service role administra activities" ON public.activities
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_activities_application ON public.activities(application_id);

-- ============================================================
-- TABLA: conversations (historial del Asistente de Diagnóstico Financiero)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.financial_applications(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso a conversaciones propias o anónimas" ON public.conversations
  USING (client_id = auth.uid() OR client_id IS NULL OR public.is_staff());

CREATE POLICY "Service role administra conversations" ON public.conversations
  USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON public.conversations(session_id);

-- ============================================================
-- FUNCIÓN: update_updated_at (genérica, reutilizada por varios triggers)
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER trigger_applications_updated_at
  BEFORE UPDATE ON public.financial_applications
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER trigger_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- Registra automáticamente un cambio de estado como actividad, para que
-- el pipeline del CRM tenga seguimiento sin que el código tenga que
-- acordarse de insertarlo cada vez.
CREATE OR REPLACE FUNCTION public.log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estado IS DISTINCT FROM OLD.estado THEN
    INSERT INTO public.activities (application_id, tipo, descripcion, created_by)
    VALUES (
      NEW.id, 'cambio_estado',
      'Estado cambiado de ' || OLD.estado || ' a ' || NEW.estado,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON public.financial_applications
  FOR EACH ROW EXECUTE PROCEDURE public.log_application_status_change();

-- ============================================================
-- STORAGE BUCKET: documents (privado; acceso solo vía URL firmada)
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

-- Convención de carpeta: <client_id>/<application_id>/archivo — el primer
-- segmento del path SIEMPRE debe ser el auth.uid() real, nunca un valor
-- enviado por el cliente (ver app/api/upload/route.ts).
CREATE POLICY "Staff y dueño pueden subir documentos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR public.is_staff())
  );

CREATE POLICY "Staff y dueño pueden ver documentos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR public.is_staff())
  );

CREATE POLICY "Service role administra el bucket documents" ON storage.objects
  USING (bucket_id = 'documents' AND auth.role() = 'service_role');
