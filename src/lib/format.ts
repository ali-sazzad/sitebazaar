import { listings, type Listing } from "@/lib/mock/listings";

const usd = new Intl.NumberFormat("en-US");

export function money(n: number) {
  return usd.format(n);
}

/** Price shown for a listing: the live bid for auctions, the fixed price otherwise. */
export function effectivePrice(l: Listing) {
  return l.isAuction ? l.currentBid : l.price;
}

/** Stable catalogue number, like an auction house lot. */
export function lotNumber(id: string) {
  const i = listings.findIndex((l) => l.id === id);
  return i === -1 ? null : i + 1;
}

/** Deterministic hue per listing so its preview keeps the same colours everywhere. */
export function hueFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}

/** "Aurora — SaaS Landing + Pricing (Next.js)" -> "Aurora" */
export function shortTitle(title: string) {
  return title.split(" — ")[0];
}

/** Remaining time as a compact countdown, e.g. "1d 4h 12m". */
export function timeLeft(ms: number, withSeconds = false) {
  if (ms <= 0) return "Ended";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const tail = withSeconds ? ` ${sec}s` : "";
  if (d > 0) return `${d}d ${h}h ${m}m${tail}`;
  if (h > 0) return `${h}h ${m}m${tail}`;
  return `${m}m ${sec}s`;
}
