"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/sell", label: "Sell a Site" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b sb-border bg-white/70 backdrop-blur">
      <div className="sb-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-white"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
            }}
            aria-hidden="true"
          >
            SB
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">SiteBazaar</p>
            <p className="text-xs sb-muted">Buy & sell websites</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
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

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="rounded-full"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
            }}
          >
            <Link href="/marketplace">Browse</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
