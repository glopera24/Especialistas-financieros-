// ============================================================
// lib/site-config.ts
// Fuente única de verdad para datos reales del negocio. Todo lo
// que hay aquí viene del sitio publicado (index.html y las
// landing pages hipotecario/, vehiculo/, proteccion/, exterior/)
// — nada fue inventado. Si algo cambia (teléfono, horario,
// cifras), se edita en un solo lugar.
// ============================================================

export const siteConfig = {
  name: "Especialistas Financieros",
  tagline: "Transformamos proyectos y necesidades financieras en estructuras financiables.",
  description:
    "Firma especializada en banca y finanzas con más de 13 años de trayectoria. Comparamos opciones de crédito hipotecario, vehicular, protección patrimonial e inversión desde el exterior, y te acompañamos con ética y profesionalismo hasta el desembolso.",
  url: "https://especialistasfinancieros.com",
  whatsapp: {
    number: "573183269385",
    display: "+57 318 326 9385",
    get link() {
      return `https://wa.me/${this.number}`;
    },
  },
  schedule: "Lun – Vie: 8:00 am – 6:00 pm",
  attention: "Colombia – presencial y virtual",
  stats: [
    { value: "13+", label: "Años de experiencia" },
    { value: "2.000+", label: "Clientes asesorados" },
    { value: "10+", label: "Productos financieros" },
    { value: "3", label: "Asesores especializados" },
  ],
  methodology: [
    {
      title: "Diagnóstico inicial",
      description: "Entrevista para conocer tu perfil financiero y tus objetivos.",
    },
    {
      title: "Planteamiento de opciones",
      description: "Diseñamos las alternativas financieras que mejor se adaptan a ti.",
    },
    {
      title: "Pre-evaluación y estrategia",
      description: "Analizamos viabilidad y trazamos el camino más eficiente.",
    },
    {
      title: "Gestión y seguimiento",
      description: "Acompañamiento completo desde la solicitud hasta el desembolso.",
    },
    {
      title: "Red de aliados",
      description: "Bancos, peritos, notarios e inmobiliarias a tu disposición.",
    },
    {
      title: "Asesoría personalizada",
      description: "Un equipo dedicado a tus necesidades en todo momento.",
    },
  ],
  advantages: [
    {
      title: "Certeza legal",
      description:
        "Garantizamos un proceso confiable, transparente y respaldado por el conocimiento del sector financiero colombiano.",
    },
    {
      title: "Mejora tu historial",
      description:
        "Te ayudamos a estructurar tu perfil financiero y a mejorar tu score crediticio para obtener las mejores condiciones.",
    },
    {
      title: "Plan de negocios",
      description:
        "Te acompañamos para presentar al banco lo que realmente necesita. Ideal para crédito PyME y créditos hipotecarios.",
    },
  ],
  audiences: [
    {
      title: "Personas naturales",
      description:
        "Empleados, independientes y profesionales que buscan financiación para sus proyectos de vida.",
    },
    {
      title: "Empresas",
      description:
        "Negocios que requieren capital de trabajo, activos o expansión con las mejores condiciones del mercado.",
    },
    {
      title: "Colombianos en el exterior",
      description:
        "Residentes fuera del país que desean invertir en Colombia o acceder a créditos internacionales.",
    },
  ],
} as const;

import type { LeadProducto } from "@/types";
export type { LeadProducto };

export type Solucion = {
  slug: string;
  /** Valor que corresponde a la constraint CHECK de la tabla `leads` — no se deriva del slug porque no siempre coinciden (p. ej. "colombianos-en-el-exterior" → "exterior"). */
  leadValue: LeadProducto;
  nombre: string;
  nombreCorto: string;
  emoji: string;
  imagen: string | null;
  resumen: string;
  hero: { titulo: string; subtitulo: string; descripcion: string };
  opciones: { titulo: string; descripcion: string; emoji?: string }[];
  disponible: boolean;
};

// Las 5 verticales reales del negocio (confirmadas por el cliente): hipotecario,
// vehicular, empresarial, protección patrimonial y colombianos en el exterior.
export const soluciones: Solucion[] = [
  {
    slug: "hipotecario",
    leadValue: "hipotecario",
    imagen: "/images/hipotecario.jpg",
    nombre: "Crédito Hipotecario",
    nombreCorto: "Hipotecario",
    emoji: "🏡",
    resumen: "Compra, mejora o refinancia tu inmueble con las mejores condiciones del mercado.",
    hero: {
      titulo: "Crédito Hipotecario",
      subtitulo: "Tu casa propia comienza aquí",
      descripcion:
        "Compara múltiples opciones de crédito hipotecario y encuentra el plan ideal para ti. Con asesoría integral, tasas competitivas y acompañamiento legal completo.",
    },
    opciones: [
      { emoji: "🏡", titulo: "Compra de vivienda nueva o usada", descripcion: "Te guiamos en la compra del hogar ideal con tasas preferenciales." },
      { emoji: "🔁", titulo: "Compra de cartera hipotecaria", descripcion: "Mejora tu crédito actual con mejores condiciones y ahorra." },
      { emoji: "📄", titulo: "Leasing habitacional", descripcion: "Una opción flexible para personas naturales o empresas." },
      { emoji: "🏗️", titulo: "Crédito para construcción", descripcion: "Financia tu proyecto desde cero con respaldo profesional." },
      { emoji: "💸", titulo: "Crédito con subsidio", descripcion: "Gestionamos el acceso a subsidios de vivienda VIS o No VIS." },
      { emoji: "📉", titulo: "Ahorros en cesantías", descripcion: "Usa tus cesantías como parte de la cuota inicial." },
    ],
    disponible: true,
  },
  {
    slug: "vehicular",
    leadValue: "vehicular",
    imagen: "/images/vehiculo.jpg",
    nombre: "Crédito Vehicular",
    nombreCorto: "Vehicular",
    emoji: "🚗",
    resumen: "El vehículo que sueñas está más cerca con nuestras soluciones de financiación.",
    hero: {
      titulo: "Crédito Vehicular",
      subtitulo: "Tu vehículo soñado está más cerca",
      descripcion:
        "Compara opciones de crédito, recibe asesoría personalizada y obtén una respuesta ágil desde cualquier lugar.",
    },
    opciones: [
      { emoji: "🚗", titulo: "Compra de vehículo nuevo o usado", descripcion: "Accede a tasas competitivas para adquirir el carro que siempre has querido." },
      { emoji: "🔄", titulo: "Compra de cartera vehicular", descripcion: "Reduce tu cuota o plazo trasladando tu crédito a una entidad con mejores condiciones." },
      { emoji: "📄", titulo: "Leasing financiero", descripcion: "Alternativa ideal para empresas o profesionales que desean deducibilidad tributaria." },
      { emoji: "🚛", titulo: "Flotas empresariales", descripcion: "Soluciones de financiamiento para parque automotor corporativo o vehículos de trabajo." },
    ],
    disponible: true,
  },
  {
    slug: "proteccion-patrimonial",
    leadValue: "proteccion_patrimonial",
    imagen: "/images/proteccion.webp",
    nombre: "Inversión en Dólares y Protección Patrimonial",
    nombreCorto: "Protección Patrimonial",
    emoji: "💼",
    resumen: "Asegura tu futuro financiero y el de tu familia con nuestros planes especializados.",
    hero: {
      titulo: "Gestión patrimonial de clase mundial",
      subtitulo: "Tu capital merece crecer y protegerse en dólares, con respaldo internacional",
      descripcion:
        "Diseñamos estrategias financieras personalizadas para ejecutivos y familias: inversión en dólares, fondos globales indexados, seguros de vida con acumulación y protección patrimonial internacional.",
    },
    opciones: [
      { emoji: "📈", titulo: "Inversión en dólares", descripcion: "Portafolios indexados globales, S&P 500, desde USD $5,000." },
      { emoji: "🔒", titulo: "Seguro de vida + acumulación", descripcion: "Pólizas VUL / IUL con valor de rescate garantizado por póliza." },
      { emoji: "💵", titulo: "Renta vitalicia en USD", descripcion: "Convierte tu patrimonio en un flujo de ingresos en dólares." },
      { emoji: "🌎", titulo: "Protección patrimonial", descripcion: "Estructuras internacionales y diversificación multi-divisa." },
    ],
    disponible: true,
  },
  {
    slug: "colombianos-en-el-exterior",
    leadValue: "exterior",
    imagen: "/images/exterior.jpg",
    nombre: "Colombianos en el Exterior",
    nombreCorto: "Exterior",
    emoji: "🌍",
    resumen: "Financiación especializada para colombianos que residen fuera del país.",
    hero: {
      titulo: "Invierte en Colombia desde cualquier rincón del mundo",
      subtitulo: "Inversión desde el Exterior",
      descripcion:
        "Si eres colombiano residiendo fuera del país, te conectamos con el hogar de tus sueños: respaldo bancario sólido, asesoría legal experta y un proceso acompañado desde el exterior.",
    },
    opciones: [
      { titulo: "Inversión Remota Ágil", descripcion: "Gestionamos tu crédito y todo el proceso sin que tengas que viajar." },
      { titulo: "Inmuebles Residenciales y Turísticos", descripcion: "Viviendas VIS, No VIS, apartamentos de lujo o propiedades de inversión." },
      { titulo: "Acompañamiento Legal y Bancario", descripcion: "Respaldo institucional con bancos líderes y asesoría integral." },
      { titulo: "Proceso Simplificado y Rápido", descripcion: "Con la documentación en orden, la respuesta es más ágil." },
    ],
    disponible: true,
  },
  {
    slug: "empresarial",
    leadValue: "empresarial",
    imagen: null,
    nombre: "Financiamiento Empresarial",
    nombreCorto: "Empresarial",
    emoji: "🏢",
    resumen: "Capital de trabajo, adquisición de activos y expansión para tu empresa.",
    hero: {
      titulo: "Financiamiento Empresarial",
      subtitulo: "Estructuramos el crecimiento de tu empresa",
      descripcion:
        "Analizamos la situación financiera de tu empresa y estructuramos la solicitud ante las entidades correspondientes: capital de trabajo, adquisición de activos, expansión o financiación de flotas.",
    },
    opciones: [
      { emoji: "💼", titulo: "Capital de trabajo", descripcion: "Liquidez para la operación diaria de tu empresa." },
      { emoji: "🏗️", titulo: "Adquisición de activos", descripcion: "Financiación de maquinaria, equipos o infraestructura." },
      { emoji: "📈", titulo: "Expansión", descripcion: "Recursos para crecer a nuevos mercados o líneas de negocio." },
      { emoji: "🚛", titulo: "Flotas y vehículos empresariales", descripcion: "Financiación o leasing de parque automotor corporativo." },
    ],
    disponible: true,
  },
];
