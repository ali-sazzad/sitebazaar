import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ListingSkeleton() {
  return (
    <Card className="sb-card overflow-hidden">
      <Skeleton className="h-36 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </Card>
  );
}
