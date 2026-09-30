"use client";

import Link from "next/link";
import { listings } from "@/lib/mock/listings";
import { lotNumber, money, shortTitle, timeLeft } from "@/lib/format";
import { useNow } from "@/lib/use-now";
import { SitePreview } from "@/components/listing/site-preview";
import { Skeleton } from "@/components/ui/skeleton";

const AUCTIONS = [...listings]
  .filter((l) => l.isAuction)
  .sort((a, b) => Date.parse(a.endsAt) - Date.parse(b.endsAt));

export function ClosingSoon() {
  const now = useNow();

  return (
    <section className="border-y bg-card">
      <div className="sb-container py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl font-bold sm:text-5xl">Closing soon</h2>
          <Link href="/marketplace" className="text-sm font-medium text-cobalt hover:underline">
            See every lot
          </Link>
        </div>

        <ol className="mt-10 divide-y border-y">
          {AUCTIONS.map((l) => {
            const left = now === null ? null : Date.parse(l.endsAt) - now;
            const urgent = left !== null && left < 864e5;
            return (
              <li key={l.id}>
                <Link
                  href={`/auctions/${l.id}`}
                  className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-4 sm:grid-cols-[7rem_4rem_1fr_auto_auto] sm:gap-6"
                >
                  <div className="overflow-hidden rounded-md border">
                    <SitePreview id={l.id} category={l.category} />
                  </div>
                  <span className="hidden text-sm text-muted-ink sm:block">Lot {lotNumber(l.id)}</span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl font-semibold group-hover:text-cobalt">
                      {shortTitle(l.title)}
                    </p>
                    <p className="text-sm text-muted-ink">
                      {l.category}, {l.bidCount} bids
                    </p>
                  </div>
                  <p className="tabular hidden font-display text-2xl font-semibold sm:block">
                    ${money(l.currentBid)}
                  </p>
                  <p
                    className={`tabular min-w-24 text-right text-sm font-semibold ${
                      urgent ? "text-destructive" : "text-ink"
                    }`}
                  >
                    {left === null ? <Skeleton className="ml-auto h-4 w-20" /> : timeLeft(left)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
