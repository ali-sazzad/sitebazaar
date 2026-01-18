import type { BrowseFilters } from "@/lib/browse/types";

export const DEFAULT_FILTERS: BrowseFilters = {
  query: "",
  category: "All",
  tech: "All",
  auctionOnly: false,
  priceMin: 0,
  priceMax: 500,
  sort: "popular",
};
