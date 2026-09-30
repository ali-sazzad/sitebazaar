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
      // A tighter fan on phones, where the board shares one screen with the headline.
      const step = window.matchMedia("(min-width: 1024px)").matches ? { x: 26, y: -22 } : { x: 16, y: -14 };
      cards.forEach((card, i) => {
        const depth = (i - front + LOTS.length) % LOTS.length;
        const vars = {
          x: depth * step.x,
          y: depth * step.y,
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
      // Below lg the hero is exactly one screen tall (minus the 65px header): text on top,
      // and the lot board scales to whatever height is left, so the whole hero shows on landing.
      className="sb-container flex h-[calc(100svh-65px)] min-h-[28rem] flex-col pb-5 pt-6 [@media(max-height:600px)]:pb-3 [@media(max-height:600px)]:pt-4 sm:pt-10 lg:grid lg:h-auto lg:min-h-0 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-20"
    >
      <div className="shrink-0">
        <h1 data-reveal className="hero-line display-tight text-[clamp(2.4rem,11vw,5.25rem)] font-extrabold [@media(max-height:600px)]:text-[2.25rem]">
          Websites, sold by the lot.
        </h1>
        <p data-reveal className="hero-sub mt-4 [@media(max-height:600px)]:mt-3 max-w-md text-base leading-relaxed text-muted-ink sm:text-lg lg:mt-7">
          Bid on finished sites in live auctions, or buy one outright and launch this week.
          <span className="hidden sm:inline"> Every lot lists its stack, its seller and its price up front.</span>
        </p>
        <div data-reveal className="hero-cta mt-6 [@media(max-height:600px)]:mt-4 flex flex-wrap gap-3 lg:mt-9">
          <Button asChild size="lg" className="h-11 rounded-full px-6 text-base sm:h-12 sm:px-7">
            <Link href="/marketplace">Browse lots</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 rounded-full bg-transparent px-6 text-base sm:h-12 sm:px-7">
            <Link href="/sell">Sell your site</Link>
          </Button>
        </div>
      </div>

      {/* Lot board */}
      <div className="relative mt-5 flex min-h-0 flex-1 flex-col pt-8 [@media(max-height:600px)]:mt-2 [@media(max-height:600px)]:pt-6 lg:mt-0 lg:block lg:flex-none lg:pr-14 lg:pt-12">
        {/* Phones: height-driven (fills the space left), width follows the aspect ratio. */}
        <div className="relative aspect-[4/3.6] h-full max-h-[24rem] max-w-[calc(100%-2.5rem)] self-start lg:h-auto lg:max-h-none lg:w-full lg:max-w-none">
          {LOTS.map((l, i) => (
            <Link
              key={l.id}
              href={`/auctions/${l.id}`}
              data-reveal
              tabIndex={i === front ? 0 : -1}
              aria-hidden={i === front ? undefined : true}
              className="lot-card @container absolute inset-0 flex origin-bottom-left flex-col overflow-hidden rounded-2xl border border-ink/15 bg-card shadow-[0_24px_60px_-20px_rgba(15,27,61,0.35)]"
            >
              <SitePreview id={l.id} category={l.category} className="border-b" />
              <div className="flex flex-1 items-end justify-between gap-3 p-3.5 sm:p-5">
                <div className="min-w-0">
                  <p className="text-xs text-muted-ink @max-[17rem]:hidden">
                    Lot {lotNumber(l.id)}, {l.category}
                  </p>
                  <p className="mt-0.5 truncate font-display text-lg font-semibold sm:text-xl">{shortTitle(l.title)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-ink @max-[17rem]:hidden">Current bid</p>
                  <CountUp value={bids[i]} flash className="font-display text-2xl font-bold sm:text-3xl" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 flex shrink-0 items-center gap-2 text-sm text-muted-ink lg:mt-10">
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
