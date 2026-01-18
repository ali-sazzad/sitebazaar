import { STORAGE_KEYS } from "@/lib/storage/keys";
import { readLocal, writeLocal } from "@/lib/storage/local";

export type Bid = {
  id: string;        // unique
  listingId: string;
  amount: number;
  createdAt: string; // ISO
  bidder: "You" | "Other";
};

export type BidStore = Record<string, Bid[]>; // listingId -> bids[]

export function getBidStore(): BidStore {
  return readLocal<BidStore>(STORAGE_KEYS.bids, {});
}

export function setBidStore(store: BidStore) {
  writeLocal(STORAGE_KEYS.bids, store);
}

export function getBidsForListing(listingId: string): Bid[] {
  const store = getBidStore();
  return store[listingId] ?? [];
}

export function addBid(listingId: string, amount: number, bidder: Bid["bidder"]): Bid {
  const store = getBidStore();
  const list = store[listingId] ?? [];

  const bid: Bid = {
    id: `bid_${Math.random().toString(16).slice(2)}_${Date.now()}`,
    listingId,
    amount,
    createdAt: new Date().toISOString(),
    bidder,
  };

  const next = [bid, ...list];
  store[listingId] = next;
  setBidStore(store);

  return bid;
}
