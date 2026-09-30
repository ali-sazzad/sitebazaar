import Link from "next/link";
import type { Listing } from "@/lib/mock/listings";
import { SitePreview } from "@/components/listing/site-preview";
import { effectivePrice, lotNumber, money } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ListingCard({ listing, className }: { listing: Listing; className?: string }) {
  const lot = lotNumber(listing.id);

  return (
    <Link
      href={`/listing/${listing.id}`}
      data-flip-id={listing.id}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-ink/40",
        className
      )}
    >
      <div className="relative border-b">
        <SitePreview
          id={listing.id}
          category={listing.category}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {listing.isAuction ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-marigold px-2.5 py-1 text-xs font-semibold text-ink">
            <span className="size-1.5 rounded-full bg-ink" aria-hidden="true" />
            Live auction
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-3 text-xs text-muted-ink">
          <span>{lot ? `Lot ${lot}` : listing.category}</span>
          <span>{listing.category}</span>
        </div>

        <h3 className="mt-2 text-lg font-semibold leading-snug">{listing.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-ink">{listing.shortPitch}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-muted-ink">
              {listing.isAuction ? `Current bid, ${listing.bidCount} bids` : "Buy now"}
            </p>
            <p className="tabular font-display text-2xl font-semibold">
              ${money(effectivePrice(listing))}
            </p>
          </div>
          <p className="text-right text-xs text-muted-ink">{listing.techStack.slice(0, 2).join(", ")}</p>
        </div>
      </div>
    </Link>
  );
}
