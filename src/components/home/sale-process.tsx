"use client";

import { useRef } from "react";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/motion/gsap";

const STEPS = [
  {
    title: "List the site",
    body: "Describe what you built, pick a fixed price or an auction window, and add screenshots.",
  },
  {
    title: "Take bids or a buyer",
    body: "Auctions run to the minute with minimum increments. Buy-now lots sell to the first buyer.",
  },
  {
    title: "Hand over the keys",
    body: "Payment sits in escrow until the repository, domain and hosting move to the new owner.",
  },
];

export function SaleProcess() {
  const root = useRef<HTMLElement>(null);

  // The rule fills as you scroll through the section; each step lights up as the fill reaches it.
  useGSAP(
    () => {
      gsap.matchMedia().add({ motion: FULL_MOTION, wide: "(min-width: 768px)" }, (ctx) => {
        const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
        if (!motion) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 55%", scrub: 0.6 },
        });
        tl.from(".rule-fill", { [wide ? "scaleX" : "scaleY"]: 0, ease: "none", duration: 3 });
        gsap.utils.toArray<HTMLElement>(".step").forEach((step, i) => {
          tl.from(step, { opacity: 0.25, duration: 0.4, ease: "none" }, i * 1.1);
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-night text-white">
      <div className="sb-container py-20">
        <h2 className="max-w-xl text-4xl font-bold sm:text-5xl">How a sale works</h2>
        <div className="steps relative mt-14">
          {/* horizontal on desktop, vertical on mobile */}
          <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-white/15 md:left-0 md:top-[7px] md:h-px md:w-full" />
          <div className="rule-fill absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-marigold md:left-0 md:top-[7px] md:h-px md:w-full md:origin-left" />
          <ol className="relative grid gap-12 md:grid-cols-3 md:gap-10">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step relative pl-10 md:pl-0 md:pt-10">
                <span className="absolute left-0 mt-1 size-[15px] rounded-full border-2 border-marigold bg-night md:top-0 md:mt-0" aria-hidden="true" />
                <p className="font-display text-sm text-marigold">Step {i + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-white/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
