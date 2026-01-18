import type { Listing } from "@/lib/mock/listings";
import { listings } from "@/lib/mock/listings";

const byId = new Map<string, Listing>(listings.map((l) => [l.id, l]));

export function listingFromId(id: string) {
  return byId.get(id) ?? null;
}

export function listingsFromIds(ids: string[]) {
  return ids.map((id) => byId.get(id)).filter(Boolean) as Listing[];
}
