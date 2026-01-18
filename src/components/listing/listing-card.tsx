import Link from "next/link";
import { Listing } from "@/lib/mock/listings";
import { Card } from "@/components/ui/card";

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function ListingCard({ listing }: { listing: Listing }) {
  const price = listing.isAuction ? listing.currentBid : listing.price;

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl"
    >
      <Card className="sb-card overflow-hidden transition hover:-translate-y-0.5">
        {/* mock image */}
        <div
          className="h-36 w-full"
          style={{
            background:
              "linear-gradient(135deg, hsla(var(--sb-grad-a)/.18), hsla(var(--sb-grad-b)/.14))",
          }}
        />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{listing.title}</p>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                {listing.shortPitch}
              </p>
            </div>

            <span
              className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
              style={{
                background: listing.isAuction
                  ? "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))"
                  : "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
              }}
            >
              {listing.isAuction ? "Auction" : "Buy Now"}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {listing.techStack.slice(0, 3).map((t) => (
              <span key={t} className="sb-chip">
                {t}
              </span>
            ))}
            <span className="sb-chip">{listing.category}</span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-500">Price</p>
              <p className="text-lg font-semibold text-slate-900">
                ${money(price)}
              </p>
            </div>
            <p className="text-xs text-slate-500">
              {listing.isAuction ? `${listing.bidCount} bids` : "Instant"}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
