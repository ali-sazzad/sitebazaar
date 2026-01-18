import { readLocal, writeLocal } from "@/lib/storage/local";

const KEY = "sb:userListings:v1";

export type UserListingDraft = {
  id: string;
  title: string;
  category: "Portfolio" | "Ecommerce" | "SaaS" | "Blog" | "Agency";
  techStack: ("Next.js" | "React" | "Vue" | "HTML")[];
  price: number;
  isAuction: boolean;
  endsAt?: string; // ISO
  shortPitch: string;
  tags: string[];
  screenshots: string[]; // mock URLs
  createdAt: string; // ISO
};

export function getUserListings(): UserListingDraft[] {
  return readLocal<UserListingDraft[]>(KEY, []);
}

export function addUserListing(draft: Omit<UserListingDraft, "id" | "createdAt">) {
  const current = getUserListings();
  const full: UserListingDraft = {
    ...draft,
    id: `ul_${Math.random().toString(16).slice(2)}_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const next = [full, ...current];
  writeLocal(KEY, next);
  return full;
}
