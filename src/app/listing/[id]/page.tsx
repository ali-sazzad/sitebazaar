"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";

import { getListingById } from "@/lib/mock/get-listing";
import { pushRecent } from "@/lib/recent/recent";
import { lotNumber, money, timeLeft } from "@/lib/format";
import { useNow } from "@/lib/use-now";

import { BuyNowModal } from "@/components/checkout/buy-now-modal";
import { SitePreview } from "@/components/listing/site-preview";
import { FavoriteButton } from "@/components/listing/favorite-button";
import { NotFoundPanel } from "@/components/listing/not-found-panel";
import { Button } from "@/components/ui/button";

const INCLUDED: Record<string, string[]> = {
  SaaS: ["Landing page", "Pricing", "FAQ", "Sign-up flow", "Legal pages"],
  Ecommerce: ["Storefront", "Product page", "Cart", "Checkout", "Order confirmation"],
  Portfolio: ["Home", "Project index", "Case study template", "About", "Contact"],
  Agency: ["Home", "Services", "Case studies", "Team", "Contact"],
  Blog: ["Post index", "Article template", "Tag pages", "Author page", "Newsletter sign-up"],
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const listing = useMemo(() => getListingById(id), [id]);
  const now = useNow(30_000);

  useEffect(() => {
    if (listing) pushRecent(listing.id);
  }, [listing]);

  if (!listing) return <NotFoundPanel title="This lot doesn't exist" />;

  const listed = new Date(listing.createdAt);

  return (
    <div className="sb-container py-10">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-ink hover:text-ink">
        <ArrowLeft className="size-4" />
        All lots
      </Link>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-muted-ink">
        <span>Lot {lotNumber(listing.id)}</span>
        <span>{listing.category}</span>
        <span>{listing.views.toLocaleString("en-US")} views</span>
      </div>
      <h1 className="mt-2 max-w-4xl text-4xl font-bold leading-[1.05] sm:text-6xl">{listing.title}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_30px_60px_-30px_rgba(15,27,61,0.35)]">
            <SitePreview id={listing.id} category={listing.category} />
          </div>

          <p className="mt-8 max-w-prose text-xl leading-relaxed">{listing.shortPitch}</p>

          <dl className="mt-10 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-ink">Built with</dt>
              <dd className="mt-1 font-medium">{listing.techStack.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-ink">Highlights</dt>
              <dd className="mt-1 font-medium">{listing.tags.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-ink">Pages included</dt>
              <dd className="mt-1 font-medium">{INCLUDED[listing.category].join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-ink">Listed</dt>
              <dd className="mt-1 font-medium" suppressHydrationWarning>
                {listed.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </dd>
            </div>
          </dl>
        </div>

        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-card p-6">
            {listing.isAuction ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-ink">Current bid, {listing.bidCount} bids</p>
                  <span className="rounded-full bg-marigold px-2.5 py-1 text-xs font-semibold">
                    {now === null ? "Live" : `${timeLeft(Date.parse(listing.endsAt) - now)} left`}
                  </span>
                </div>
                <p className="tabular mt-2 font-display text-5xl font-bold">${money(listing.currentBid)}</p>
                <Button asChild className="mt-6 h-12 w-full rounded-full text-base">
                  <Link href={`/auctions/${listing.id}`}>Bid on this lot</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-ink">Buy now price</p>
                <p className="tabular mt-2 font-display text-5xl font-bold">${money(listing.price)}</p>
                <div className="mt-6">
                  <BuyNowModal listingId={listing.id} title={listing.title} price={listing.price} />
                </div>
              </>
            )}
            <FavoriteButton listingId={listing.id} className="mt-3 w-full" />
            <p className="mt-5 text-sm leading-relaxed text-muted-ink">
              Payment is held in escrow until the code, domain and hosting have moved to you.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border bg-card p-6">
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-display text-xl font-bold text-white"
            >
              {listing.seller.name[0]}
            </span>
            <div>
              <p className="font-semibold">{listing.seller.name}</p>
              <p className="flex items-center gap-1 text-sm text-muted-ink">
                <Star className="size-3.5 fill-marigold text-marigold" aria-hidden="true" />
                {listing.seller.rating.toFixed(1)} seller rating
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
