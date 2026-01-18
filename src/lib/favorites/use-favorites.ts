/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { getFavorites, toggleFavorite } from "@/lib/favorites/favorites";

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getFavorites());
  }, []);

  const set = (next: string[]) => setIds(next);

  const isFav = useMemo(() => {
    const s = new Set(ids);
    return (id: string) => s.has(id);
  }, [ids]);

  const toggle = (id: string) => {
    const res = toggleFavorite(id);
    set(res.next);
    return res.saved;
  };

  return { ids, isFav, toggle, set };
}
