import type { Listing, ListingCategory } from "@/lib/mock/listings";

export type SortKey = "price" | "endingSoon" | "newest" | "popular";

export type BrowseFilters = {
  query: string;
  category: ListingCategory | "All";
  tech: "All" | "Next.js" | "React" | "Vue" | "HTML";
  auctionOnly: boolean;
  priceMin: number;
  priceMax: number;
  sort: SortKey;
};

export type BrowseResult = {
  items: Listing[];
  total: number;
};
