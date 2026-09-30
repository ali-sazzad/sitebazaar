"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

const THEME_COLOR = { light: "#f3f4ef", dark: "#0b1226" };

// True only in the browser, without a setState-in-effect round trip.
const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const icons = useRef<HTMLSpanElement>(null);
  const dark = mounted && resolvedTheme === "dark";

  // Keep the phone browser bar in step with the page.
  useEffect(() => {
    if (!mounted) return;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? THEME_COLOR.dark : THEME_COLOR.light);
  }, [dark, mounted]);

  const toggle = () => {
    setTheme(dark ? "light" : "dark");
    if (icons.current && !prefersReducedMotion()) {
      gsap.fromTo(
        icons.current,
        { rotation: -90, scale: 0.6 },
        { rotation: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }
      );
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={mounted ? dark : undefined}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "grid size-11 place-items-center rounded-full border border-rule text-ink transition-colors hover:border-ink/40 hover:bg-paper-deep",
        className
      )}
    >
      {/* The visible icon follows the .dark class, so server and client render the same markup. */}
      <span ref={icons} className="grid place-items-center">
        <Moon className="size-5 dark:hidden" />
        <Sun className="hidden size-5 dark:block" />
      </span>
    </button>
  );
}
