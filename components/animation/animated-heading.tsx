"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const INITIAL_DELAY = 200;
const CHAR_DELAY = 30;
const DURATION = 500;

export function AnimatedHeading({
  lines,
  className = "",
  as: Tag = "h1",
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2";
}) {
  const [started, setStarted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setStarted(true);
      return;
    }
    const timer = setTimeout(() => setStarted(true), INITIAL_DELAY);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split("").map((char, charIndex) => {
            // (lineIndex * lineLength * charDelay) + (charIndex * charDelay)
            const charDelayMs =
              lineIndex * line.length * CHAR_DELAY + charIndex * CHAR_DELAY;
            return (
              <span
                key={charIndex}
                className="inline-block transition-all ease-out"
                style={{
                  opacity: reducedMotion || started ? 1 : 0,
                  transform:
                    reducedMotion || started ? "translateX(0)" : "translateX(-18px)",
                  transitionDuration: `${DURATION}ms`,
                  transitionDelay: reducedMotion ? "0ms" : `${charDelayMs}ms`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
