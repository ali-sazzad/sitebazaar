"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight, Home, Store, BadgeDollarSign, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

/**
 * Replaceable nav items (edit labels/routes anytime)
 */
const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/sell", label: "Sell a Site", icon: BadgeDollarSign },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b sb-border bg-white/80 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>

      <div className="sb-container flex h-16 items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white font-semibold"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
            }}
            aria-hidden="true"
          >
            SB
          </span>

          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-slate-900">SiteBazaar</p>
            <p className="truncate text-xs text-slate-600">Buy & sell websites</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  active
                    ? "text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                      }
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop primary CTA */}
          <Button
            asChild
            className="hidden rounded-full text-white md:inline-flex"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
            }}
          >
            <Link href="/marketplace">Browse</Link>
          </Button>

          {/* Mobile Menu */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden rounded-xl border-slate-200 bg-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-slate-900" />
        </Button>
      </SheetTrigger>

      {/* IMPORTANT: force solid background + strong contrast */}
      <SheetContent side="right" className="w-85 p-0 bg-white/70 text-slate-900">
        {/* Header strip with subtle gradient (NOT washed out) */}
        <div className="px-5 pb-5 pt-6 border-b border-slate-200">
          <div
            className="rounded-2xl p-4"
            style={{
              background:
                "radial-gradient(800px 220px at 10% 0%, hsla(var(--sb-grad-a) / .35), transparent 60%), radial-gradient(700px 220px at 90% 0%, hsla(var(--sb-grad-b) / .16), transparent 60%), linear-gradient(180deg, hsla(var(--sb-grad-a) / .06), transparent 70%)",
            }}
          >
            <SheetHeader>
              <SheetTitle className="text-base text-slate-900">SiteBazaar</SheetTitle>
            </SheetHeader>

            <p className="mt-1 text-md text-slate-600">
              Browse listings, auctions, and your dashboard.
            </p>

            {/* Strong CTAs (white text on gradient) */}
            <div className="mt-4 grid grid-cols-2 gap-2">
  <SheetClose asChild>
    <Button
      asChild
      className="rounded-xl text-white"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
      }}
    >
      <Link href="/marketplace">
        Browse <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  </SheetClose>

  <SheetClose asChild>
    <Button
      asChild
      variant="outline"
      className="rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
    >
      <Link href="/sell">Sell</Link>
    </Button>
  </SheetClose>
</div>

          </div>
        </div>

        {/* Nav list (cards for visibility) */}
        <nav className="px-4 pb-6 pt-4" aria-label="Mobile">
          <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500">
            MENU
          </p>

          <ul className="space-y-2">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        active
                          ? "text-white border-transparent"
                          : "bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100"
                      )}
                      style={
                        active
                          ? {
                              background:
                                "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                            }
                          : undefined
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid h-9 w-9 place-items-center rounded-xl border",
                            active
                              ? "border-white/25 bg-white/15"
                              : "border-slate-200 bg-white"
                          )}
                          aria-hidden="true"
                        >
                          <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-900")} />
                        </span>
                        {item.label}
                      </span>

                      <span className={cn("text-xs", active ? "text-white/90" : "text-slate-500")}>
                        →
                      </span>
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>

          {/* Tip (more contrast) */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Tip</p>
            <p className="mt-1 text-sm text-slate-600">
              Mobile-first UI: bigger tap targets, clear active states, and no cramped nav.
            </p>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
