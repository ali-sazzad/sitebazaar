"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";

const R = 25; // ring radius inside a 56px button
const CIRCUMFERENCE = 2 * Math.PI * R;

export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const pathname = usePathname();

  // Each page has its own length, so re-measure scroll progress after navigating.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useGSAP(() => {
    const el = ref.current;
    if (!el || !ring.current) return;
    gsap.set(el, { autoAlpha: 0, y: 16, scale: 0.9 });

    // Appear once the reader is a screen or so down the page.
    ScrollTrigger.create({
      start: 600,
      end: "max",
      onToggle: (self) =>
        gsap.to(el, {
          autoAlpha: self.isActive ? 1 : 0,
          y: self.isActive ? 0 : 16,
          scale: self.isActive ? 1 : 0.9,
          duration: 0.3,
          ease: "back.out(1.6)",
        }),
    });

    // The ring fills with reading progress.
    gsap.fromTo(
      ring.current,
      { strokeDashoffset: CIRCUMFERENCE },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      }
    );
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
      title="Back to top"
      className="group invisible fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-40 grid size-14 place-items-center rounded-full bg-night text-white shadow-[0_12px_32px_-8px_rgba(15,27,61,0.55)] ring-1 ring-white/20 transition-colors hover:bg-cobalt focus-visible:outline-offset-4 sm:right-8 sm:bottom-[calc(2rem+env(safe-area-inset-bottom))]"
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r={R} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.5" />
        <circle
          ref={ring}
          cx="28"
          cy="28"
          r={R}
          fill="none"
          stroke="var(--marigold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp className="relative size-6 transition-transform group-hover:-translate-y-0.5" strokeWidth={2.25} />
    </button>
  );
}
