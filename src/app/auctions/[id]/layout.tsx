import type { Metadata } from "next";
import { getListingById } from "@/lib/mock/get-listing";
import { listings } from "@/lib/mock/listings";
import { shortTitle } from "@/lib/format";

// Pre-render every lot (fixed-price ones show a "not at auction" panel) so the site can be exported as static files.
export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const l = getListingById((await params).id);
  return { title: l ? `Auction: ${shortTitle(l.title)}` : "Auction not found", description: l ? `Bid on ${l.title}. ${l.shortPitch}` : undefined };
}

export default function AuctionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
