import { STORAGE_KEYS } from "@/lib/storage/keys";
import { readLocal, writeLocal } from "@/lib/storage/local";

export type FavoriteId = string;

export function getFavorites(): FavoriteId[] {
  return readLocal<FavoriteId[]>(STORAGE_KEYS.favorites, []);
}

export function setFavorites(ids: FavoriteId[]) {
  writeLocal(STORAGE_KEYS.favorites, ids);
}

export function toggleFavorite(id: string) {
  const current = getFavorites();
  const exists = current.includes(id);
  const next = exists ? current.filter((x) => x !== id) : [id, ...current];
  setFavorites(next);
  return { next, saved: !exists };
}
