/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listings } from "@/lib/mock/listings";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  const featured = listings.slice(0, 6);

  return (
    <div className="sb-hero">
      <section className="sb-container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <Badge className="mb-3" style={{ background: "hsla(var(--sb-accent) / .12)", color: "hsl(var(--sb-text))" }}>
              Marketplace demo • Frontend-only
            </Badge>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Buy & sell websites that{" "}
              <span className="sb-gradient-text">look ready to ship</span>.
            </h1>

            <p className="mt-4 text-base sb-muted md:text-lg">
              SiteBazaar is a colorful marketplace UI showcasing routing, filters,
              simulated bidding, localStorage persistence, and polished UX.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                }}
              >
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full">
                <Link href="/sell">Sell a Site</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="sb-chip">Verified Sellers (mock)</span>
              <span className="sb-chip">Secure Escrow (mock)</span>
              <span className="sb-chip">Buyer Protection (mock)</span>
            </div>
          </div>

          <Card className="sb-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Hot right now</p>
              <Link className="text-sm sb-muted hover:text-slate-900" href="/marketplace">
                View all →
              </Link>
            </div>

            <div className="mt-4 grid gap-3">
              {featured.map((l: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; shortPitch: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; techStack: any[]; isAuction: any; currentBid: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; bidCount: any; }) => (
                <Link
                  key={l.id}
                  href={`/listing/${l.id}`}
                  className="rounded-xl border sb-border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{l.title}</p>
                      <p className="mt-1 text-sm sb-muted">{l.shortPitch}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {l.techStack.slice(0, 3).map((t: any, index: number) => (
                          <span key={index} className="sb-chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      {l.isAuction ? (
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))",
                          }}
                        >
                          Auction
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
  Buy Now
</span>
                      )}
                      <p className="mt-2 text-sm font-semibold">
                        ${l.isAuction ? l.currentBid : l.price}
                      </p>
                      <p className="text-xs sb-muted">
                        {l.isAuction ? `${l.bidCount} bids` : "Instant purchase"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="sb-container pb-14">
        <div className="grid gap-3 md:grid-cols-5">
          {["Portfolio", "Ecommerce", "SaaS", "Blog", "Agency"].map((c) => (
            <Link
              key={c}
              href={`/marketplace?category=${encodeURIComponent(c)}`}
              className="rounded-2xl border sb-border bg-white/70 p-4 text-sm font-semibold transition hover:bg-white"
            >
              {c} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
