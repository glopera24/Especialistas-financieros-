"use client";

import { useEffect, useState } from "react";

/** Respeta prefers-reduced-motion: los componentes de animación del Hero
 * (AnimatedHeading, FadeIn) lo consultan para saltar directamente al
 * estado final en vez de animar. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
