"use client";

import { useRef } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { useFavorites } from "@/lib/favorites/use-favorites";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FavoriteButton({ listingId, className }: { listingId: string; className?: string }) {
  const fav = useFavorites();
  const saved = fav.isFav(listingId);
  const icon = useRef<SVGSVGElement>(null);

  const onClick = () => {
    const didSave = fav.toggle(listingId);
    toast(didSave ? "Saved to your watchlist" : "Removed from your watchlist");
    if (didSave && icon.current && !prefersReducedMotion()) {
      gsap.fromTo(
        icon.current,
        { scale: 0.4, rotation: -20 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1.1, 0.4)" }
      );
    }
  };

  return (
    <Button
      variant="outline"
      aria-pressed={saved}
      onClick={onClick}
      className={cn("h-12 rounded-full bg-transparent text-base", className)}
    >
      <Heart
        ref={icon}
        className={cn("size-5", saved && "fill-destructive text-destructive")}
      />
      {saved ? "On your watchlist" : "Add to watchlist"}
    </Button>
  );
}
