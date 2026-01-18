"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={[
        "fixed bottom-6 right-6 z-50 transition-all duration-200",
        "supports-[padding:env(safe-area-inset-bottom)]:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
    >
      <Button
        onClick={goTop}
        aria-label="Back to top"
        className="h-11 rounded-full px-4 text-white shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
        }}
      >
        <ArrowUp className="mr-2 h-4 w-4" />
        Top
      </Button>
    </div>
  );
}
