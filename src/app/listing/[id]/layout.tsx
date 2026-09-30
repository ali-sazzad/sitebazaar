import type { Metadata } from "next";
import { getListingById } from "@/lib/mock/get-listing";
import { shortTitle } from "@/lib/format";

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
