import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing",
  description:
    "Listing details, screenshots, and buy-now / auction actions.",
};

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
