"use client";

import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";

export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0, y: 16 });
    ScrollTrigger.create({
      start: 600,
      end: "max",
      onToggle: (self) =>
        gsap.to(el, { autoAlpha: self.isActive ? 1 : 0, y: self.isActive ? 0 : 16, duration: 0.3 }),
    });
  });

  const goTop = () => {
    gsap.to(window, {
      scrollTo: 0,
      duration: prefersReducedMotion() ? 0 : 0.9,
      ease: "power3.inOut",
    });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      className="invisible fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full bg-ink text-white shadow-lg hover:bg-cobalt"
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
