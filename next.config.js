/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15: experimental.serverComponentsExternalPackages se estabilizó
  // como serverExternalPackages (nivel raíz), ya no es "experimental".
  serverExternalPackages: ["openai"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_SITE_URL || "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
      ],
    },
    {
      // Applies to every route. Basic hardening; CSP is intentionally left out
      // here because it needs to be tuned against the real third-party scripts
      // in use (fonts, WhatsApp, analytics) before being enforced.
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ],
  // Preserva las URLs antiguas del sitio estático (sección 7 del brief): no
  // rompemos enlaces ya indexados por Google, solo los canonicalizamos hacia
  // la nueva arquitectura /soluciones/*.
  redirects: async () => [
    { source: "/hipotecario", destination: "/soluciones/hipotecario", permanent: true },
    { source: "/vehiculo", destination: "/soluciones/vehicular", permanent: true },
    { source: "/proteccion", destination: "/soluciones/proteccion-patrimonial", permanent: true },
    { source: "/exterior", destination: "/soluciones/colombianos-en-el-exterior", permanent: true },
    { source: "/simulador", destination: "/herramientas/simulador", permanent: true },
  ],
};

module.exports = nextConfig;
