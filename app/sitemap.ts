import type { MetadataRoute } from "next";
import { soluciones } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://especialistasfinancieros.com";
  const now = new Date();

  const solucionesUrls = soluciones
    .filter((s) => s.disponible)
    .map((s) => ({
      url: `${base}/soluciones/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/soluciones`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...solucionesUrls,
    { url: `${base}/herramientas/simulador`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
