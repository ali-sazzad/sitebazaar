"use client";

import { useEffect, useState } from "react";

/** Current time, ticking every `ms`. Null until mounted so SSR and hydration agree. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, ms);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [ms]);
  return now;
}
