import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NotFoundPanel({
  title,
  body = "The link may be out of date, or the lot was withdrawn.",
  href = "/marketplace",
  cta = "Browse all lots",
}: {
  title: string;
  body?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="sb-container py-24">
      <h1 className="display-tight text-5xl font-bold">{title}</h1>
      <p className="mt-4 max-w-md text-muted-ink">{body}</p>
      <Button asChild className="mt-8 h-12 rounded-full px-7">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}
