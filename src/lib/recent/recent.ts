import { STORAGE_KEYS } from "@/lib/storage/keys";
import { readLocal, writeLocal } from "@/lib/storage/local";

export type RecentItem = {
  id: string;
  viewedAt: string; // ISO
};

const LIMIT = 8;

export function getRecents(): RecentItem[] {
  return readLocal<RecentItem[]>(STORAGE_KEYS.recentlyViewed, []);
}

export function pushRecent(id: string) {
  const now = new Date().toISOString();
  const current = getRecents();

  // remove if exists (so it goes to top)
  const without = current.filter((x) => x.id !== id);
  const next = [{ id, viewedAt: now }, ...without].slice(0, LIMIT);

  writeLocal(STORAGE_KEYS.recentlyViewed, next);
}
