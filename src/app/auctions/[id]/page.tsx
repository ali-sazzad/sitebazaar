export const metadata = { title: "Auction" };

export default function AuctionPage() {
  return (
    <div className="sb-container py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Auction / Bidding</h1>
      <p className="mt-2 sb-muted">
        Sprint 3 will add countdown UI, bid validation (min increment), bid history, and winning/outbid states.
      </p>
    </div>
  );
}
