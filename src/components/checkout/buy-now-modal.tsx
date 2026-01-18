"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  listingId: string;
  title: string;
  price: number;
};

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function BuyNowModal({ listingId, title, price }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fees = useMemo(() => Math.round(price * 0.03), [price]); // mock 3%
  const total = price + fees;

  const confirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setOpen(false);

    toast.success("Purchase complete (mock).");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-11 w-full rounded-full cursor-pointer text-white font-semibold active:scale-[0.99]"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
          }}
        >
          Buy Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-130 bg-white/75">
        <DialogHeader>
          <DialogTitle>Confirm purchase</DialogTitle>
          <DialogDescription>
            Frontend-only demo checkout (no real payment).
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate-600">Listing</p>
              <p className="mt-1 font-semibold text-slate-900 line-clamp-2">
                {title}
              </p>
            </div>
            <Badge
              style={{
                background: "hsla(var(--sb-grad-a) / .12)",
                color: "hsl(var(--sb-text))",
              }}
            >
              Mock checkout
            </Badge>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <Row label="Price" value={`$${money(price)}`} />
            <Row label="Marketplace fee (mock)" value={`$${money(fees)}`} />
            <div className="h-px bg-slate-200" />
            <Row label="Total" value={`$${money(total)}`} strong />
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            className="rounded-full text-white"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
            }}
            onClick={confirm}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm (mock)"}
          </Button>
        </DialogFooter>

        <p className="mt-2 text-xs text-slate-500">
          Listing ID: <span className="font-mono">{listingId}</span>
        </p>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={strong ? "font-semibold text-slate-900" : "text-slate-900"}>
        {value}
      </span>
    </div>
  );
}
