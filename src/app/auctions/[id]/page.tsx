"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { getListingById } from "@/lib/mock/get-listing";
import { addBid, getBidsForListing, type Bid } from "@/lib/bids/bids";
import { makeMockHistory, minIncrement, rivalDelay } from "@/lib/auction/auction";
import { lotNumber, money, shortTitle, timeLeft } from "@/lib/format";
import { useNow } from "@/lib/use-now";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

import { SitePreview } from "@/components/listing/site-preview";
import { NotFoundPanel } from "@/components/listing/not-found-panel";
import { CountUp } from "@/components/motion/count-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const newestFirst = (a: Bid, b: Bid) => Date.parse(b.createdAt) - Date.parse(a.createdAt);

export default function AuctionPage() {
  const { id } = useParams<{ id: string }>();
  const listing = useMemo(() => getListingById(id), [id]);
  const now = useNow();

  const [history, setHistory] = useState<Bid[]>([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rivalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const latestId = useRef<string | null>(null);

  useEffect(() => {
    if (!listing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load stored bids once
    setHistory([...getBidsForListing(listing.id), ...makeMockHistory(listing)].sort(newestFirst));
  }, [listing]);

  useEffect(() => () => {
    if (rivalTimer.current) clearTimeout(rivalTimer.current);
  }, []);

  // Slide each new bid into the top of the history.
  useGSAP(
    () => {
      const top = history[0];
      if (!top || !list.current) return;
      const isNew = latestId.current !== null && latestId.current !== top.id;
      latestId.current = top.id;
      if (!isNew || prefersReducedMotion()) return;
      const row = list.current.firstElementChild;
      if (row) gsap.from(row, { height: 0, autoAlpha: 0, x: -24, duration: 0.5 });
    },
    { dependencies: [history], scope: list }
  );

  if (!listing) return <NotFoundPanel title="This auction doesn't exist" />;
  if (!listing.isAuction) {
    return (
      <NotFoundPanel
        title="This lot isn't at auction"
        body="It's sold at a fixed price instead."
        href={`/listing/${listing.id}`}
        cta="See the lot"
      />
    );
  }

  const endsAt = Date.parse(listing.endsAt);
  const left = now === null ? null : endsAt - now;
  const ended = left !== null && left <= 0;
  const currentBid = Math.max(listing.currentBid, ...history.map((b) => b.amount));
  const inc = minIncrement(currentBid);
  const minAllowed = currentBid + inc;
  const leading = history[0]?.bidder === "You";

  const place = (value: number) => {
    if (ended) return setError("Bidding has closed on this lot.");
    if (!Number.isFinite(value) || value < minAllowed) {
      return setError(`Bid at least $${money(minAllowed)}. Bids go up in steps of $${money(inc)}.`);
    }
    setError(null);
    setAmount("");
    const bid = addBid(listing.id, value, "You");
    setHistory((h) => [bid, ...h]);
    toast.success(`Bid placed: $${money(value)}`);

    // Sometimes a rival bidder answers a few seconds later.
    if (rivalTimer.current) clearTimeout(rivalTimer.current);
    const delay = rivalDelay();
    if (delay !== null) {
      rivalTimer.current = setTimeout(() => {
        const rival = addBid(listing.id, value + minIncrement(value), "Other");
        setHistory((h) => [rival, ...h]);
        toast("You've been outbid");
      }, delay);
    }
  };

  const quick = [minAllowed, minAllowed + inc, minAllowed + inc * 4];

  return (
    <div className="sb-container py-10">
      <Link
        href={`/listing/${listing.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-ink hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Lot details
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-sm text-muted-ink">
            Lot {lotNumber(listing.id)}, {listing.category}
          </p>
          <h1 className="display-tight mt-2 text-6xl font-bold sm:text-7xl">{shortTitle(listing.title)}</h1>
          <p className="mt-4 max-w-md text-muted-ink">{listing.shortPitch}</p>
          <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
            <SitePreview id={listing.id} category={listing.category} />
          </div>
        </div>

        <div className="space-y-6">
          <section aria-label="Bidding" className="rounded-2xl bg-ink p-6 text-white sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Current bid</p>
                <CountUp value={currentBid} flash className="mt-1 block font-display text-6xl font-bold sm:text-7xl" />
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">{ended ? "Closed" : "Closes in"}</p>
                <p
                  className={cn(
                    "tabular mt-1 font-display text-2xl font-semibold",
                    left !== null && left < 864e5 && !ended ? "text-marigold" : "text-white"
                  )}
                >
                  {left === null ? " " : timeLeft(left, true)}
                </p>
              </div>
            </div>

            {history.length > 0 ? (
              <p
                className={cn(
                  "mt-6 rounded-lg px-4 py-3 text-sm font-medium",
                  leading ? "bg-marigold text-ink" : "bg-white/10 text-white"
                )}
                role="status"
              >
                {leading ? "You're the highest bidder." : "Another bidder is ahead. Raise your bid to lead."}
              </p>
            ) : null}

            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                place(Number(amount));
              }}
            >
              <Label htmlFor="bid" className="text-sm text-white/80">
                Your bid, at least ${money(minAllowed)}
              </Label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Input
                  id="bid"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder={money(minAllowed)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "bid-error" : undefined}
                  disabled={ended}
                  className="tabular h-12 border-white/20 bg-white/5 text-lg text-white placeholder:text-white/40"
                />
                <Button
                  type="submit"
                  disabled={ended || now === null}
                  className="h-12 rounded-full bg-marigold px-7 text-base text-ink hover:bg-white"
                >
                  Place bid
                </Button>
              </div>
              {error ? (
                <p id="bid-error" className="mt-2 text-sm text-marigold">
                  {error}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {quick.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={ended || now === null}
                    onClick={() => place(q)}
                    className="tabular rounded-full border border-white/20 px-4 py-1.5 text-sm hover:border-marigold hover:text-marigold disabled:opacity-40"
                  >
                    Bid ${money(q)}
                  </button>
                ))}
              </div>
            </form>
          </section>

          <section aria-labelledby="history-title" className="rounded-2xl border bg-card p-6">
            <div className="flex items-baseline justify-between">
              <h2 id="history-title" className="text-xl font-semibold">
                Bid history
              </h2>
              <p className="text-sm text-muted-ink">{history.length} bids</p>
            </div>
            <ol ref={list} className="mt-4 divide-y">
              {history.slice(0, 8).map((b) => (
                <li key={b.id} className="grid grid-cols-[1fr_auto_6rem] items-center gap-4 overflow-hidden py-3 text-sm">
                  <span className={b.bidder === "You" ? "font-semibold text-cobalt" : "text-muted-ink"}>
                    {b.bidder === "You" ? "You" : "Another bidder"}
                  </span>
                  <span className="tabular font-semibold">${money(b.amount)}</span>
                  <span className="tabular text-right text-muted-ink" suppressHydrationWarning>
                    {new Date(b.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted-ink">Your bids are saved in this browser.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
