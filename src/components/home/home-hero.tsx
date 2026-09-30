"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { listings } from "@/lib/mock/listings";
import { lotNumber, shortTitle } from "@/lib/format";
import { minIncrement } from "@/lib/auction/auction";
import { gsap, useGSAP, SplitText, FULL_MOTION, REDUCED_MOTION } from "@/lib/motion/gsap";
import { SitePreview } from "@/components/listing/site-preview";
import { CountUp } from "@/components/motion/count-up";
import { Button } from "@/components/ui/button";

const LOTS = listings.filter((l) => l.isAuction).slice(0, 3);

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  // Front-of-stack lot and its simulated live bid.
  const [front, setFront] = useState(0);
  const [bids, setBids] = useState(() => LOTS.map((l) => l.currentBid));
  const frontRef = useRef(0);
  const stacked = useRef(false);

  // Stack the cards around the front lot. The first run places them instantly so the
  // intro timeline below can tween from offscreen to these resting positions.
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".lot-card");
      cards.forEach((card, i) => {
        const depth = (i - front + LOTS.length) % LOTS.length;
        const vars = {
          x: depth * 26,
          y: depth * -22,
          scale: 1 - depth * 0.06,
          rotation: depth === 0 ? -2 : depth * 3,
          zIndex: LOTS.length - depth,
          filter: `brightness(${1 - depth * 0.07})`,
        };
        if (stacked.current) gsap.to(card, { ...vars, duration: 0.8, ease: "power3.inOut" });
        else gsap.set(card, vars);
      });
      stacked.current = true;
    },
    { dependencies: [front], scope: root }
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const split = SplitText.create(".hero-line", { type: "words", mask: "words" });
        const cards = gsap.utils.toArray<HTMLElement>(".lot-card");

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.set("[data-reveal]", { visibility: "visible" })
          .from(split.words, { yPercent: 110, duration: 1, stagger: 0.06 })
          .fromTo(".hero-sub", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.55")
          .fromTo(
            ".hero-cta > *",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5, clearProps: "transform,opacity,visibility" },
            "<0.1"
          )
          // Deal the lots onto the board, back card first.
          .from(
            [...cards].reverse(),
            {
              y: "+=240",
              rotation: (i) => [14, -10, 6][i],
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "back.out(1.2)",
            },
            "-=0.9"
          );

        // Live bidding: the front lot takes two bids, then the next lot rotates forward.
        let tick = 0;
        const loop = gsap.delayedCall(2.6, () => {
          tick++;
          if (tick % 3 === 0) {
            frontRef.current = (frontRef.current + 1) % LOTS.length;
            setFront(frontRef.current);
          } else {
            const f = frontRef.current;
            setBids((b) => b.map((v, i) => (i === f ? v + minIncrement(v) : v)));
          }
          loop.restart(true);
        });

        return () => {
          loop.kill();
          split.revert();
        };
      });

      mm.add(REDUCED_MOTION, () => {
        gsap.set("[data-reveal]", { visibility: "visible" });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="sb-container grid items-center gap-14 pb-20 pt-12 md:pt-20 lg:grid-cols-[1.15fr_1fr]"
    >
      <div>
        <h1 data-reveal className="hero-line display-tight text-[clamp(2.75rem,8.5vw,5.25rem)] font-extrabold">
          Websites, sold by the lot.
        </h1>
        <p data-reveal className="hero-sub mt-7 max-w-md text-lg leading-relaxed text-muted-ink">
          Bid on finished sites in live auctions, or buy one outright and launch this week.
          Every lot lists its stack, its seller and its price up front.
        </p>
        <div data-reveal className="hero-cta mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
            <Link href="/marketplace">Browse lots</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-transparent px-7 text-base">
            <Link href="/sell">Sell your site</Link>
          </Button>
        </div>
      </div>

      {/* Lot board */}
      <div className="relative mx-auto w-full max-w-md pl-3 pr-12 pt-12 sm:pl-0 sm:pr-14 lg:max-w-none">
        <div className="relative aspect-[4/3.6]">
          {LOTS.map((l, i) => (
            <Link
              key={l.id}
              href={`/auctions/${l.id}`}
              data-reveal
              tabIndex={i === front ? 0 : -1}
              aria-hidden={i === front ? undefined : true}
              className="lot-card absolute inset-0 flex origin-bottom-left flex-col overflow-hidden rounded-2xl border border-ink/15 bg-card shadow-[0_24px_60px_-20px_rgba(15,27,61,0.35)]"
            >
              <SitePreview id={l.id} category={l.category} className="border-b" />
              <div className="flex flex-1 items-end justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="text-xs text-muted-ink">
                    Lot {lotNumber(l.id)}, {l.category}
                  </p>
                  <p className="mt-1 truncate font-display text-xl font-semibold">{shortTitle(l.title)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-ink">Current bid</p>
                  <CountUp value={bids[i]} flash className="font-display text-3xl font-bold" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-10 flex items-center gap-2 text-sm text-muted-ink">
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-marigold opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-2.5 rounded-full bg-marigold" />
          </span>
          Now bidding: {shortTitle(LOTS[front].title)}
        </p>
      </div>
    </section>
  );
}
