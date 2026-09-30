"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { addPurchase } from "@/lib/purchases/purchases";
import { money } from "@/lib/format";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  listingId: string;
  title: string;
  price: number;
};

const FEE_RATE = 0.03;

export function BuyNowModal({ listingId, title, price }: Props) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"review" | "paying" | "sold">("review");
  const stamp = useRef<HTMLDivElement>(null);

  const fee = Math.round(price * FEE_RATE);
  const total = price + fee;

  const pay = async () => {
    setStage("paying");
    await new Promise((r) => setTimeout(r, 700));
    addPurchase({ listingId, title, price: total });
    setStage("sold");
    toast.success(`Purchased ${title.split(" — ")[0]}`);
  };

  // The hammer comes down: stamp the lot as sold.
  useGSAP(
    () => {
      if (stage !== "sold" || !stamp.current) return;
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        stamp.current,
        { scale: 2.4, rotation: -24, autoAlpha: 0 },
        { scale: 1, rotation: -8, autoAlpha: 1, duration: 0.5, ease: "back.out(2.2)" }
      );
    },
    { dependencies: [stage] }
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setStage("review");
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-12 w-full rounded-full text-base">Buy now</Button>
      </DialogTrigger>

      <DialogContent className="bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {stage === "sold" ? "It's yours" : "Buy this site"}
          </DialogTitle>
          <DialogDescription>
            {stage === "sold"
              ? "We'll hold payment in escrow until the handover is done. This is a demo, so nothing was charged."
              : "Demo checkout. No payment details are needed and nothing is charged."}
          </DialogDescription>
        </DialogHeader>

        <div className="relative rounded-xl border bg-paper p-5">
          <p className={`font-semibold leading-snug ${stage === "sold" ? "pr-24" : ""}`}>{title}</p>
          <dl className="tabular mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-ink">Price</dt>
              <dd>${money(price)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-ink">Escrow fee (3%)</dt>
              <dd>${money(fee)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>${money(total)}</dd>
            </div>
          </dl>

          {stage === "sold" ? (
            <div
              ref={stamp}
              aria-hidden="true"
              className="absolute right-4 top-4 -rotate-[8deg] rounded-md border-[3px] border-destructive px-3 py-1 font-display text-2xl font-extrabold uppercase text-destructive"
            >
              Sold
            </div>
          ) : null}
        </div>

        <DialogFooter className="gap-2">
          {stage === "sold" ? (
            <Button asChild className="rounded-full">
              <Link href="/dashboard">View in dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="rounded-full" onClick={pay} disabled={stage === "paying"}>
                {stage === "paying" ? "Paying" : `Pay $${money(total)}`}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
