import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Especialistas Financieros — Plataforma de Estructuración de Proyectos",
    template: "%s | Especialistas Financieros",
  },
  description:
    "Transformamos proyectos productivos en estructuras financiables. IA conversacional, automatización documental y acompañamiento experto para acceder a financiación.",
  keywords: [
    "financiación proyectos productivos",
    "estructuración financiera Colombia",
    "crédito agropecuario",
    "Bancoldex Finagro",
    "proyectos avícola piscicultura",
    "asesoría financiera pymes",
    "estructuración de proyectos",
    "acceso a crédito rural",
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
    title: "Especialistas Financieros — Proyectos Productivos Financiables",
    description:
      "Transformamos proyectos productivos en estructuras financiables con IA, automatización documental y acompañamiento experto.",
    siteName: "Especialistas Financieros",
  },
  twitter: {
    card: "summary_large_image",
    title: "Especialistas Financieros",
    description: "Plataforma de estructuración de proyectos productivos.",
    creator: "@espfinancieros",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://especialistasfinancieros.com"),
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-brand-200 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
