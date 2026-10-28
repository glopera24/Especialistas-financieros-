"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function FadeIn({
  children,
  delay = 0,
  duration = 1000,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, reducedMotion]);

  return (
    <div
      className={`transition-opacity ease-out ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
