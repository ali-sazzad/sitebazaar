"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion, FULL_MOTION } from "@/lib/motion/gsap";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { href: "/marketplace", label: "Browse lots" },
  { href: "/sell", label: "Sell a site" },
  { href: "/dashboard", label: "Dashboard" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const hideTween = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const el = header.current;
      if (!el) return;

      // Lift the header off the page with a shadow once content scrolls beneath it.
      ScrollTrigger.create({
        start: 8,
        end: "max",
        onToggle: (self) => el.toggleAttribute("data-scrolled", self.isActive),
      });

      // On larger screens, tuck the header away while scrolling down and bring it back on any
      // upward scroll. On phones it stays put so the menu is always one tap away.
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 768px) and ${FULL_MOTION}`, () => {
        const hide = gsap.to(el, { yPercent: -100, duration: 0.35, ease: "power2.inOut", paused: true });
        hideTween.current = hide;
        ScrollTrigger.create({
          start: 120,
          end: "max",
          onUpdate: (self) => (self.direction === 1 ? hide.play() : hide.reverse()),
          onLeaveBack: () => hide.reverse(),
        });
        return () => {
          hideTween.current = null;
        };
      });
    },
    { scope: header }
  );

  // A new page always starts with the header in view.
  useEffect(() => {
    hideTween.current?.reverse();
  }, [pathname]);

  // Slide the underline to whichever nav item matches the route.
  useGSAP(
    () => {
      const bar = marker.current;
      const links = nav.current?.querySelectorAll<HTMLAnchorElement>("a[data-nav]");
      if (!bar || !links) return;
      const active = Array.from(links).find((a) => isActive(pathname, a.dataset.nav!));
      if (!active) {
        gsap.to(bar, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      const target = { x: active.offsetLeft, width: active.offsetWidth, autoAlpha: 1 };
      if (prefersReducedMotion()) gsap.set(bar, target);
      else gsap.to(bar, { ...target, duration: 0.45, ease: "power3.inOut" });
    },
    { dependencies: [pathname], scope: nav }
  );

  return (
    <header
      ref={header}
      className="sticky top-0 z-50 border-b border-rule bg-paper pt-[env(safe-area-inset-top)] transition-shadow data-[scrolled]:shadow-[0_6px_24px_-12px_rgba(15,27,61,0.35)]"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <div className="sb-container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="SiteBazaar home">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-ink font-display text-base font-extrabold text-marigold"
          >
            SB
          </span>
          <span className="display-tight text-[1.4rem] font-extrabold leading-none">SiteBazaar</span>
        </Link>

        <nav ref={nav} aria-label="Primary" className="relative hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "py-5 text-sm font-medium transition-colors",
                isActive(pathname, item.href) ? "text-ink" : "text-muted-ink hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
          <span
            ref={marker}
            aria-hidden="true"
            className="invisible absolute bottom-0 left-0 h-0.5 bg-cobalt"
            style={{ width: 0 }}
          />
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden rounded-full px-5 md:inline-flex">
            <Link href="/sell">List your site</Link>
          </Button>
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="h-11 gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-cobalt md:hidden">
          <Menu className="size-5" />
          Menu
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 border-l-0 bg-ink p-0 text-white">
        <SheetHeader className="p-6">
          <SheetTitle className="display-tight text-3xl font-bold text-white">SiteBazaar</SheetTitle>
          <SheetDescription className="text-white/60">Websites, sold by the lot.</SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col px-6">
          {[{ href: "/", label: "Home" }, ...NAV].map((item) => {
            const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b border-white/10 py-4 font-display text-2xl font-semibold",
                    active ? "text-marigold" : "text-white hover:text-marigold"
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
