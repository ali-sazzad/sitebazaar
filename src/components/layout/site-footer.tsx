import Link from "next/link";

const LINKS = [
  { href: "/marketplace", label: "Browse lots" },
  { href: "/sell", label: "List a site" },
  { href: "/dashboard", label: "Your dashboard" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="sb-container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="display-tight text-4xl font-bold sm:text-5xl">SiteBazaar</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Websites, sold by the lot. This is a frontend demo: listings, bids and
            purchases live in your browser&apos;s local storage, and no money changes hands.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm md:items-end">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-white/80 hover:text-marigold">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="sb-container flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SiteBazaar demo</p>
          <p>Next.js, GSAP, Tailwind CSS, shadcn/ui</p>
        </div>
      </div>
    </footer>
  );
}
