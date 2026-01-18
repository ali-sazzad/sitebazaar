import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auction",
  description:
    "Place bids with validation and see bid history (frontend-only).",
};

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
