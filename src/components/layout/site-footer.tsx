import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t sb-border">
      <div className="sb-container py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold">SiteBazaar</p>
            <p className="mt-1 max-w-md text-sm sb-muted">
              Frontend-only marketplace demo: listings, filters, simulated bidding,
              favorites, and a dashboard — designed to look like a real SaaS product.
            </p>
          </div>

          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Product</p>
              <Link className="sb-muted hover:text-slate-900" href="/marketplace">
                Marketplace
              </Link>
              <Link className="sb-muted hover:text-slate-900" href="/sell">
                Sell a Site
              </Link>
              <Link className="sb-muted hover:text-slate-900" href="/dashboard">
                Dashboard
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Trust (Mock)</p>
              <p className="sb-muted">Verified sellers</p>
              <p className="sb-muted">Secure escrow</p>
              <p className="sb-muted">Buyer protection</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t sb-border pt-6 text-xs sb-muted">
          <p>© {new Date().getFullYear()} SiteBazaar (demo)</p>
          <p>
            Built with Next.js + Tailwind + shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
}
