import type { Metadata } from "next";
import { getListingById } from "@/lib/mock/get-listing";
import { listings } from "@/lib/mock/listings";
import { shortTitle } from "@/lib/format";

// Pre-render every lot so the site can be exported as static files.
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
  return { title: l ? shortTitle(l.title) : "Lot not found", description: l ? l.shortPitch : undefined };
}

export default function ListingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
