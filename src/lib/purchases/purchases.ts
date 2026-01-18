import { readLocal, writeLocal } from "@/lib/storage/local";

const KEY = "sb:purchases:v1";

export type Purchase = {
  id: string;
  listingId: string;
  title: string;
  price: number;
  createdAt: string; // ISO
};

export function getPurchases(): Purchase[] {
  return readLocal<Purchase[]>(KEY, []);
}

export function addPurchase(input: Omit<Purchase, "id" | "createdAt">) {
  const current = getPurchases();
  const next: Purchase = {
    ...input,
    id: `p_${Math.random().toString(16).slice(2)}_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeLocal(KEY, [next, ...current]);
  return next;
}
