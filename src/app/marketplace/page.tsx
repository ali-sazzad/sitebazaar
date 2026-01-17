export const metadata = { title: "Marketplace" };

export default function MarketplacePage() {
  return (
    <div className="sb-container py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Marketplace</h1>
      <p className="mt-2 sb-muted">
        Sprint 2 will add search, filters, sort, listing cards, skeleton loaders, and empty states.
      </p>

      <div className="mt-6 rounded-2xl border sb-border bg-white/70 p-6">
        <p className="text-sm font-semibold">Coming in Sprint 2</p>
        <ul className="mt-3 list-disc pl-5 text-sm sb-muted">
          <li>Search + filters + sort</li>
          <li>ListingCard component</li>
          <li>Skeleton loader grid</li>
          <li>Persist last used filters (localStorage)</li>
        </ul>
      </div>
    </div>
  );
}
