# Especialistas Financieros

Plataforma de diagnóstico, estructuración y acompañamiento financiero. Firma
colombiana de asesoría en banca y finanzas con más de 13 años de trayectoria.

> Transformamos necesidades y proyectos financieros en estructuras claras y financiables.

Líneas de negocio: **crédito hipotecario, crédito vehicular, financiamiento
empresarial, protección patrimonial / inversión en dólares, y colombianos en
el exterior.**

---

## Qué es

Un sitio público (portafolio de las 5 líneas, simulador, asistente de
diagnóstico financiero) + un CRM interno (`/admin`) + un panel de cliente
(`/dashboard`), sobre una misma base de datos en Supabase.

## Arquitectura

```text
Cliente
  ↓
Web pública → selecciona necesidad
  ↓
Diagnóstico financiero (Asistente IA o formulario)
  ↓
Solicitud financiera (financial_applications)
  ↓
CRM (/admin) → asesor da seguimiento
  ↓
Documentos + actividades
  ↓
Resultado (aprobado / rechazado / desembolsado)
```

## Tecnologías

| Categoría       | Tecnología                              |
|-----------------|------------------------------------------|
| Framework       | Next.js 15 (App Router)                   |
| Lenguaje        | TypeScript                                |
| Estilos         | TailwindCSS + tailwindcss-animate         |
| Animaciones     | Framer Motion                             |
| Componentes UI  | Radix UI                                  |
| Base de datos   | Supabase (PostgreSQL) con RLS por rol     |
| Almacenamiento  | Supabase Storage (bucket privado, URLs firmadas) |
| IA              | OpenAI GPT-4o (streaming SSE) + Whisper   |
| Deploy          | Vercel                                    |

## Instalación local

```bash
git clone <tu-repo>
cd especialistas-financieros
npm install
cp .env.example .env.local   # completa con tus valores reales
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Ver `.env.example`. Ninguna variable de este proyecto es opcional para que
Supabase/OpenAI funcionen:

```env
NEXT_PUBLIC_SITE_URL=
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=documents
```

**Nunca subas `.env.local` al repositorio** (ya está en `.gitignore`).

## Supabase

1. Crea un proyecto en [app.supabase.com](https://app.supabase.com).
2. Ejecuta `lib/supabase/schema.sql` completo en el SQL Editor.
3. Crea las cuentas de tu equipo (asesores/admin) en **Authentication → Users
   → Invite user** — no hay autorregistro público para `/admin`. Después,
   actualiza manualmente `role` a `advisor` o `admin` en la tabla `profiles`
   (por defecto todo usuario nuevo queda como `client`).
4. Verifica que el bucket `documents` quedó creado como **privado** en
   **Storage**.

### Modelo de datos

| Tabla                     | Qué guarda                                        |
|---------------------------|----------------------------------------------------|
| `profiles`                | Usuarios (cliente / asesor / admin), extiende auth.users |
| `leads`                   | Captación pública desde el formulario web          |
| `financial_applications`  | Solicitudes financieras — núcleo del CRM            |
| `application_documents`   | Documentos adjuntos a una solicitud                 |
| `activities`              | Seguimiento comercial (llamadas, notas, cambios de estado) |
| `conversations`           | Historial del Asistente de Diagnóstico Financiero   |

### Roles y autorización

- `client`: ve y crea sus propias solicitudes (`/dashboard`).
- `advisor` / `admin`: acceso al CRM (`/admin`), ven y gestionan todas las
  solicitudes y leads. La autorización se verifica en `middleware.ts` (no
  basta con estar autenticado) y de nuevo en cada ruta de API sensible.

## OpenAI

1. Crea una API key en [platform.openai.com](https://platform.openai.com/api-keys).
2. Verifica acceso a `gpt-4o` y `whisper-1`.
3. El prompt del Asistente de Diagnóstico Financiero está en
   `lib/openai/prompts.ts` — nunca promete aprobación ni inventa tasas o
   entidades; siempre cierra invitando a hablar con un asesor humano.

## Autenticación

Supabase Auth con `@supabase/ssr` (sesión por cookies, sincronizada entre
cliente y servidor). `/login` es solo para el equipo interno y clientes con
solicitudes activas — no ofrece autorregistro público hacia el CRM.

## Estructura de carpetas

```text
app/
├── page.tsx                        Home pública
├── soluciones/[slug]/               Las 5 líneas de negocio
├── herramientas/simulador/          Simulador de crédito
├── legal/                           Tratamiento de datos, privacidad, términos
├── admin/                           CRM (requiere rol advisor/admin)
├── dashboard/                       Panel del cliente
├── login/
└── api/
    ├── leads/                       Captación pública
    ├── applications/                 CRUD de solicitudes financieras
    ├── upload/                      Documentos (con verificación de dueño)
    ├── chat/                        Asistente de Diagnóstico Financiero
    └── transcribe/                  Transcripción de audio (Whisper)

lib/
├── site-config.ts                  Contenido real del sitio (WhatsApp, líneas de negocio)
├── finance.ts                      Fórmulas del simulador (sistema francés)
├── openai/                         Cliente y prompt del asistente
└── supabase/                       Clientes, servicios de datos, schema.sql

middleware.ts                       Protección de /admin (rol) y /dashboard (sesión)
```

## Desarrollo

```bash
npm run dev            # servidor de desarrollo
npx tsc --noEmit        # verificación de tipos
npm run lint            # ESLint
npm run build           # build de producción
```

## Deploy en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en [vercel.com/new](https://vercel.com/new).
3. Configura las variables de entorno de la sección anterior.
4. Conecta el dominio `especialistasfinancieros.com` en **Vercel → Domains**.
5. Deploy.

## Seguridad

- Ninguna clave sensible vive en el cliente: `SUPABASE_SERVICE_ROLE_KEY` y
  `OPENAI_API_KEY` solo se usan en rutas de servidor.
- RLS habilitado en todas las tablas; el service role se usa exclusivamente
  desde el servidor.
- El bucket de documentos es privado; el acceso es siempre por URL firmada
  con expiración, nunca pública.
- `/api/upload` deriva la identidad del usuario de su sesión real — nunca de
  un campo enviado por el formulario — y verifica que la solicitud a la que
  se adjunta el documento le pertenezca.
- `/admin` exige sesión **y** rol `advisor`/`admin`; un cliente autenticado
  no puede entrar solo por tener sesión.
- Los KPIs del CRM se calculan siempre desde Supabase — no hay cifras fijas
  en el código.
