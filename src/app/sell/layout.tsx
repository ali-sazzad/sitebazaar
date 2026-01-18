import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell a Site",
  description:
    "Create a website listing (frontend-only) with validation and auction options.",
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
