import type { Listing } from "@/lib/mock/listings";
import type { BrowseFilters, BrowseResult, SortKey } from "@/lib/browse/types";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function getEffectivePrice(l: Listing) {
  return l.isAuction ? l.currentBid : l.price;
}

function sortItems(items: Listing[], sort: SortKey) {
  const copy = [...items];

  if (sort === "price") {
    copy.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    return copy;
  }

  if (sort === "endingSoon") {
    copy.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
    return copy;
  }

  if (sort === "newest") {
    copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return copy;
  }

  // popular
  copy.sort((a, b) => b.views - a.views);
  return copy;
}

export function applyBrowsePipeline(listings: Listing[], f: BrowseFilters): BrowseResult {
  const q = normalize(f.query);

  let items = listings.filter((l) => {
    // query: title + pitch + tags
    const haystack = normalize([l.title, l.shortPitch, l.tags.join(" ")].join(" "));
    const matchQuery = q.length === 0 ? true : haystack.includes(q);

    const matchCategory = f.category === "All" ? true : l.category === f.category;

    const matchTech =
      f.tech === "All" ? true : l.techStack.includes(f.tech);

    const matchAuction = f.auctionOnly ? l.isAuction : true;

    const price = getEffectivePrice(l);
    const matchPrice = price >= f.priceMin && price <= f.priceMax;

    return matchQuery && matchCategory && matchTech && matchAuction && matchPrice;
  });

  items = sortItems(items, f.sort);

  return { items, total: items.length };
}
