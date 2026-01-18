import type { Bid } from "@/lib/bids/bids";
import type { Listing } from "@/lib/mock/listings";

export function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatTimeLeft(ms: number) {
  if (ms <= 0) return "Ended";

  const totalSeconds = Math.floor(ms / 1000);

  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  // Always show seconds so it "runs" visually
  if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}


export function minIncrement(current: number) {
  // simple rule: small increments for small numbers, bigger for bigger
  if (current < 200) return 10;
  if (current < 500) return 20;
  if (current < 1000) return 50;
  return 100;
}

export function makeMockHistory(listing: Listing): Bid[] {
  // deterministic-ish mock bids around currentBid
  const base = listing.currentBid || listing.price || 100;
  const now = Date.now();

  const bids: Bid[] = [
    { id: "m1", listingId: listing.id, amount: base - 40, createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString(), bidder: "Other" },
    { id: "m2", listingId: listing.id, amount: base - 20, createdAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(), bidder: "Other" },
    { id: "m3", listingId: listing.id, amount: base - 10, createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(), bidder: "Other" },
  ];

  // keep only positive amounts
  return bids.filter((b) => b.amount > 0);
}
