"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { money } from "@/lib/format";

/**
 * Renders a dollar amount that tweens from its previous value whenever `value` changes.
 * Used where a number changing is the news (bids, totals).
 */
export function CountUp({
  value,
  className,
  flash = false,
}: {
  value: number;
  className?: string;
  flash?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: value });

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion() || shown.current.v === value) {
        shown.current.v = value;
        el.textContent = `$${money(value)}`;
        return;
      }
      gsap.to(shown.current, {
        v: value,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `$${money(Math.round(shown.current.v))}`;
        },
      });
      if (flash) {
        gsap.fromTo(
          el,
          { backgroundColor: "rgba(255,178,26,0.55)" },
          { backgroundColor: "rgba(255,178,26,0)", duration: 1.2, ease: "power1.out" }
        );
      }
    },
    { dependencies: [value] }
  );

  return (
    <span ref={ref} className={`tabular rounded-md ${className ?? ""}`}>
      ${money(value)}
    </span>
  );
}
