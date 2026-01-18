"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getListingById } from "@/lib/mock/get-listing";
import { pushRecent } from "@/lib/recent/recent";

import { BuyNowModal } from "@/components/checkout/buy-now-modal";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useFavorites } from "@/lib/favorites/use-favorites";
import { toast } from "sonner";
import { Heart } from "lucide-react";

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const listing = useMemo(() => (id ? getListingById(id) : null), [id]);

  const [activeShot, setActiveShot] = useState(0);

  const fav = useFavorites();
  const saved = listing ? fav.isFav(listing.id) : false;

  // persist recently viewed
  useEffect(() => {
    if (listing) pushRecent(listing.id);
  }, [listing]);

  if (!listing) {
    return (
      <div className="sb-container py-10">
        <div className="rounded-2xl border sb-border bg-white/70 p-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Listing not found
          </h1>
          <p className="mt-2 text-slate-600">
            This listing doesn’t exist (mock data). Go back to the marketplace.
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const price = listing.isAuction ? listing.currentBid : listing.price;

  return (
    <div className="sb-container py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="sb-chip">{listing.category}</span>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white"
              style={{
                background: listing.isAuction
                  ? "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))"
                  : "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
              }}
            >
              {listing.isAuction ? "Auction" : "Buy Now"}
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            {listing.title}
          </h1>
          <p className="mt-2 text-slate-600">{listing.shortPitch}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            style={{
              background: "hsla(var(--sb-grad-a) / .12)",
              color: "hsl(var(--sb-text))",
            }}
          >
            Seller: {listing.seller.name} • {listing.seller.rating.toFixed(1)}★
          </Badge>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Gallery */}
        <Card className="sb-card p-4">
          <div
            className="rounded-2xl border sb-border overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, hsla(var(--sb-grad-a)/.18), hsla(var(--sb-grad-b)/.14))",
            }}
          >
            {/* mock hero shot */}
            <div className="h-65 w-full" />
          </div>

          {/* Thumbs (mock) */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveShot(i)}
                className={[
                  "h-20 rounded-2xl border transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  i === activeShot
                    ? "border-transparent"
                    : "border-slate-200 hover:bg-slate-50",
                ].join(" ")}
                style={
                  i === activeShot
                    ? {
                        background:
                          "linear-gradient(135deg, hsla(var(--sb-grad-a)/.20), hsla(var(--sb-grad-b)/.16))",
                      }
                    : { background: "white" }
                }
                aria-label={`Screenshot ${i + 1}`}
              />
            ))}
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-900">Tech stack</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {listing.techStack.map((t) => (
                <span key={t} className="sb-chip">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Pages included" value="6–10 (mock)" />
            <MiniStat label="Performance" value="92/100 (mock)" />
            <MiniStat label="Support" value="7 days (mock)" />
          </div>
        </Card>

        {/* Right column: CTA + seller card */}
        <div className="space-y-6">
          <Card className="sb-card p-5">
            <p className="text-sm font-semibold text-slate-900">Price</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              ${money(price)}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              {listing.isAuction
                ? `Current bid • ${listing.bidCount} bids`
                : "Buy now • Instant checkout (mock)"}
            </p>

            <div className="mt-5 grid gap-2">
              {listing.isAuction ? (
                <Button
                  asChild
                  className="h-11 rounded-full text-white font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))",
                  }}
                >
                  <Link href={`/auctions/${listing.id}`}>Go to Auction</Link>
                </Button>
              ) : (
                // ✅ FIX: Use BuyNowModal instead of alert button
                <BuyNowModal
                  listingId={listing.id}
                  title={listing.title}
                  price={listing.price}
                />
              )}

              <Button
                variant="outline"
                className="h-11 rounded-full cursor-pointer border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                onClick={() => {
                  const didSave = fav.toggle(listing.id);
                  toast(didSave ? "Saved to favorites" : "Removed from favorites");
                }}
              >
                <Heart
                  className="mr-2 h-4 w-4"
                  fill={saved ? "currentColor" : "none"}
                />
                {saved ? "Saved" : "Save to Favorites"}
              </Button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Trust (mock)</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>• Verified seller badge</li>
                <li>• Secure escrow UI</li>
                <li>• Buyer protection policy</li>
              </ul>
            </div>
          </Card>

          <Card className="sb-card p-5">
            <p className="text-sm font-semibold text-slate-900">Seller</p>
            <div className="mt-3 flex items-start gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl text-white font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                }}
                aria-hidden="true"
              >
                {listing.seller.name.slice(0, 1)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{listing.seller.name}</p>
                <p className="text-sm text-slate-600">
                  Rating {listing.seller.rating.toFixed(1)}★ • 42 sales (mock)
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-2">
              <Button variant="outline" className="rounded-xl">
                Message seller (mock)
              </Button>
              <Button variant="outline" className="rounded-xl">
                View seller profile (mock)
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-10">
        <Link
          className="text-sm text-slate-600 hover:text-slate-900"
          href="/marketplace"
        >
          ← Back to Marketplace
        </Link>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border sb-border bg-white/70 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
