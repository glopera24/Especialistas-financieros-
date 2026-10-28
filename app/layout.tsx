import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Autohospedada en vez de next/font/google: evita depender de una
// descarga externa en build-time, que falla en entornos de CI/CD con
// salida de red restringida. Fuente global: Inter (licencia OFL, ver
// app/fonts/Inter-OFL.txt), variable en peso 300–600.
const inter = localFont({
  src: "./fonts/Inter-Variable.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "300 600",
});

const instrumentSerif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Especialistas Financieros — Crédito Hipotecario, Vehicular y Protección Patrimonial",
    template: "%s | Especialistas Financieros",
  },
  description:
    "Firma especializada en banca y finanzas con más de 13 años de trayectoria. Comparamos opciones de crédito hipotecario, vehicular, protección patrimonial e inversión desde el exterior, y te acompañamos con ética y profesionalismo hasta el desembolso.",
  keywords: [
    "crédito hipotecario Colombia",
    "crédito vehicular Colombia",
    "leasing habitacional",
    "protección patrimonial",
    "inversión en dólares",
    "colombianos en el exterior crédito",
    "asesoría financiera Colombia",
    "compra de cartera",
  ],
  authors: [{ name: "Especialistas Financieros", url: "https://especialistasfinancieros.com" }],
  creator: "Especialistas Financieros",
  publisher: "Especialistas Financieros",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://especialistasfinancieros.com",
    title: "Especialistas Financieros — Soluciones financieras a tu medida",
    description:
      "Te acompañamos con ética y profesionalismo para conseguir el crédito ideal: hipotecario, vehicular, protección patrimonial e inversión desde el exterior.",
    siteName: "Especialistas Financieros",
  },
  twitter: {
    card: "summary_large_image",
    title: "Especialistas Financieros",
    description: "Soluciones financieras a tu medida: hipotecario, vehicular, protección patrimonial y exterior.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://especialistasfinancieros.com"),
};

export const viewport: Viewport = {
  themeColor: "#1D4ED8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Especialistas Financieros",
  url: "https://especialistasfinancieros.com",
  description:
    "Firma especializada en banca y finanzas con más de 13 años de trayectoria en Colombia.",
  telephone: "+573183269385",
  areaServed: "CO",
  address: { "@type": "PostalAddress", addressCountry: "CO" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-brand-200 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
