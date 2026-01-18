import { listings } from "@/lib/mock/listings";

export function getListingById(id: string) {
  return listings.find((l) => l.id === id) ?? null;
}
