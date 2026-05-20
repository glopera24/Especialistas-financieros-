# Especialistas Financieros — Plataforma de Estructuración de Proyectos

Plataforma premium fintech/SaaS para estructuración de proyectos productivos, organización financiera y acompañamiento técnico con IA conversacional. Construida sobre Next.js 14 App Router, Supabase y OpenAI GPT-4o.

---

## Stack tecnológico

| Categoría       | Tecnología                              |
|-----------------|-----------------------------------------|
| Framework       | Next.js 14 (App Router)                 |
| Lenguaje        | TypeScript                              |
| Estilos         | TailwindCSS + tailwindcss-animate       |
| Animaciones     | Framer Motion                           |
| Componentes UI  | Shadcn/ui + Radix UI                    |
| Iconos          | Lucide React                            |
| Base de datos   | Supabase (PostgreSQL)                   |
| Almacenamiento  | Supabase Storage                        |
| IA Chat         | OpenAI GPT-4o (streaming SSE)           |
| IA Audio        | OpenAI Whisper API                      |
| Deploy          | Vercel                                  |

---

## Requisitos previos

- Node.js >= 18.17.0
- pnpm, npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [OpenAI Platform](https://platform.openai.com)
- (Opcional) Cuenta en [Vercel](https://vercel.com)

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/especialistas-financieros.git
cd especialistas-financieros
```

### 2. Instalar dependencias

```bash
npm install
# o
pnpm install
# o
yarn install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores reales (ver sección Variables de entorno más abajo).

### 4. Configurar Supabase

1. Crea un nuevo proyecto en [app.supabase.com](https://app.supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `lib/supabase/schema.sql`
3. Verifica que se crearon las tablas: `users`, `projects`, `documents`, `conversations`, `project_status_history`
4. Verifica que se creó el bucket `documents` en **Storage**
5. Copia la URL del proyecto y las claves desde **Settings → API**

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Variables de entorno

Crea el archivo `.env.local` con las siguientes variables:

```env
# URL pública del sitio (para desarrollo: http://localhost:3000)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ──────────────────────────────────────────────────────────────
# OPENAI
# Obtén tu API key en: https://platform.openai.com/api-keys
# ──────────────────────────────────────────────────────────────
OPENAI_API_KEY=sk-proj-...

# ──────────────────────────────────────────────────────────────
# SUPABASE
# Settings → API en tu proyecto de Supabase
# ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Nombre del bucket de almacenamiento (creado por el schema.sql)
SUPABASE_STORAGE_BUCKET=documents
```

> **⚠️ Importante:** Nunca subas `.env.local` al repositorio. Está incluido en `.gitignore`.

---

## Configuración de Supabase

### Base de datos

El schema completo está en `lib/supabase/schema.sql`. Ejecutarlo en el SQL Editor de Supabase crea:

| Tabla                     | Descripción                              |
|---------------------------|------------------------------------------|
| `users`                   | Usuarios y proponentes de proyectos      |
| `projects`                | Proyectos productivos registrados        |
| `documents`               | Metadata de documentos subidos           |
| `conversations`           | Historial de conversaciones con la IA    |
| `project_status_history`  | Auditoría de cambios de estado           |

### Storage

El script crea automáticamente el bucket `documents` con:
- Tipos MIME permitidos: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`
- Tamaño máximo por archivo: 10MB
- Políticas RLS configuradas

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Para las operaciones del servidor (API routes), se usa el `SUPABASE_SERVICE_ROLE_KEY` que bypassa RLS. Los clientes del navegador usan la anon key con políticas granulares.

---

## Configuración de OpenAI

1. Crea una cuenta en [platform.openai.com](https://platform.openai.com)
2. Ve a **API Keys** y crea una nueva clave
3. Asegúrate de tener acceso a los modelos:
   - `gpt-4o` (chat con streaming)
   - `whisper-1` (transcripción de audio)
4. Configura un límite de gasto mensual recomendado en **Billing → Usage limits**

### Costos estimados

| Operación              | Modelo      | Costo estimado           |
|------------------------|-------------|--------------------------|
| Chat (streaming)       | gpt-4o      | ~$5 / 1M tokens entrada  |
| Transcripción audio    | whisper-1   | ~$0.006 / minuto         |

---

## Estructura del proyecto

```
especialistas-financieros/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Streaming chat con GPT-4o
│   │   ├── upload/route.ts        # Upload a Supabase Storage
│   │   ├── projects/route.ts      # CRUD de proyectos
│   │   └── transcribe/route.ts    # Whisper transcription
│   ├── globals.css                # Estilos globales + variables CSS
│   ├── layout.tsx                 # Root layout con metadata
│   └── page.tsx                   # Landing page principal
│
├── components/
│   ├── ui/                        # Componentes base (Shadcn/ui)
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   └── accordion.tsx
│   ├── layout/
│   │   ├── navbar.tsx             # Navegación premium sticky
│   │   └── footer.tsx             # Footer con links y social
│   ├── sections/
│   │   ├── hero.tsx               # Hero con dashboard mockup
│   │   ├── problems.tsx           # Problemática (6 cards)
│   │   ├── solution.tsx           # Timeline de solución
│   │   ├── sectors.tsx            # Grid de sectores
│   │   ├── benefits.tsx           # Beneficios (6 cards)
│   │   ├── chat-section.tsx       # Sección de IA conversacional
│   │   ├── dashboard-preview.tsx  # CRM mockup interactivo
│   │   ├── form-section.tsx       # Wrapper del formulario
│   │   ├── faq.tsx                # FAQ con accordion
│   │   └── final-cta.tsx          # CTA final con contacto
│   ├── forms/
│   │   └── project-form.tsx       # Formulario multistep (5 pasos)
│   └── chat/
│       ├── chat-interface.tsx     # Interfaz chat completa
│       └── chat-message.tsx       # Burbuja de mensaje con markdown
│
├── lib/
│   ├── openai/
│   │   ├── client.ts              # Cliente OpenAI configurado
│   │   └── prompts.ts             # System prompts especializados
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client + servicios
│   │   └── schema.sql             # Esquema completo de base de datos
│   └── utils.ts                   # Funciones utilitarias
│
├── hooks/
│   ├── use-chat.ts                # Hook de chat con streaming SSE
│   ├── use-audio-recording.ts     # Grabación y transcripción audio
│   └── use-scroll-animation.ts    # Animaciones scroll-triggered
│
├── types/
│   └── index.ts                   # Interfaces y enums TypeScript
│
├── .env.example                   # Variables de entorno de ejemplo
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## Comandos disponibles

```bash
# Desarrollo local con hot reload
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción (después del build)
npm run start

# Verificación de tipos TypeScript
npm run type-check

# Linting con ESLint
npm run lint
```

---

## Deploy en Vercel

### Método 1: Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (primer deploy)
vercel

# Deploy a producción
vercel --prod
```

### Método 2: GitHub Integration

1. Sube el código a un repositorio en GitHub
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa el repositorio
4. Configura las variables de entorno en **Settings → Environment Variables**:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_SITE_URL` (URL de producción)
5. Haz deploy

### Variables de entorno en Vercel

| Variable                          | Entornos              |
|-----------------------------------|-----------------------|
| `OPENAI_API_KEY`                  | Production, Preview   |
| `NEXT_PUBLIC_SUPABASE_URL`        | All                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | All                   |
| `SUPABASE_SERVICE_ROLE_KEY`       | Production, Preview   |
| `SUPABASE_STORAGE_BUCKET`         | All                   |
| `NEXT_PUBLIC_SITE_URL`            | All (por entorno)     |

---

## Arquitectura de la IA

### Chat (SSE Streaming)

El endpoint `/api/chat` implementa streaming de respuestas usando `ReadableStream` con Server-Sent Events (SSE):

1. El cliente envía los mensajes de la conversación vía POST
2. El servidor crea un `ReadableStream` que emite chunks en formato `data: {...}\n\n`
3. El hook `useChat` parsea los eventos y actualiza la UI en tiempo real
4. Las conversaciones se persisten en Supabase de forma no bloqueante

### Audio (Whisper)

1. El hook `useAudioRecording` captura audio usando `MediaRecorder` API
2. Al detener la grabación, el blob de audio se envía al endpoint `/api/transcribe`
3. Whisper transcribe el audio en español
4. El texto transcrito se envía automáticamente al chat

### System Prompt

El prompt del sistema (`lib/openai/prompts.ts`) está especializado en:
- 7 sectores productivos colombianos
- Clasificación de madurez de proyectos (5 niveles)
- Identificación de brechas documentales
- Rutas de financiación (Bancoldex, Finagro, FNG, iNNpulsa, cooperación)
- Detección de riesgos sectoriales

---

## Seguridad

- **API Keys**: Todas las claves sensibles están en variables de entorno del servidor
- **Supabase RLS**: Políticas de seguridad a nivel de fila habilitadas en todas las tablas
- **Admin Client**: Las operaciones del servidor usan el service role key (no expuesto al cliente)
- **Validación**: Todos los endpoints usan Zod para validar los datos de entrada
- **Upload**: Los archivos se validan por tipo MIME y tamaño antes de subir a Storage
- **Sanitización**: Los nombres de archivo se sanitizan antes de almacenarlos

---

## Personalización

### Colores de marca

Edita `tailwind.config.ts` → `theme.extend.colors.brand` y `theme.extend.colors.ef`.

### System prompt de IA

Edita `lib/openai/prompts.ts` → `MAIN_SYSTEM_PROMPT` para especializar el asistente en otros sectores o regiones.

### Fuentes

En `app/layout.tsx` y `app/globals.css` puedes cambiar `Plus_Jakarta_Sans` por cualquier fuente de Google Fonts.

---

## Soporte

Para soporte técnico: [info@especialistasfinancieros.com](mailto:info@especialistasfinancieros.com)

Para reporte de bugs: abre un issue en el repositorio de GitHub.

---

## Licencia

Propiedad de Especialistas Financieros. Todos los derechos reservados.
