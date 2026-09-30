import type { Bid } from "@/lib/bids/bids";
import type { Listing } from "@/lib/mock/listings";

/** Smallest allowed raise over the current bid: small steps for small lots, bigger for bigger. */
export function minIncrement(current: number) {
  if (current < 200) return 10;
  if (current < 500) return 20;
  if (current < 1000) return 50;
  return 100;
}

/** A few earlier bids under the current price so every auction has some history. */
export function makeMockHistory(listing: Listing): Bid[] {
  const base = listing.currentBid || listing.price || 100;
  const now = Date.now();
  const hours = (h: number) => new Date(now - h * 36e5).toISOString();

  const bids: Bid[] = [
    { id: `${listing.id}-m1`, listingId: listing.id, amount: base - 40, createdAt: hours(6), bidder: "Other" },
    { id: `${listing.id}-m2`, listingId: listing.id, amount: base - 20, createdAt: hours(4), bidder: "Other" },
    { id: `${listing.id}-m3`, listingId: listing.id, amount: base, createdAt: hours(2), bidder: "Other" },
  ];

  return bids.filter((b) => b.amount > 0);
}

/** Simulated competition: ms until a rival outbids you, or null if nobody answers. */
export function rivalDelay(): number | null {
  return Math.random() < 0.45 ? 1500 + Math.random() * 2000 : null;
}
