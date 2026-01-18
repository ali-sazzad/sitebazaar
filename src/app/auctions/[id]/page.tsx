/* eslint-disable react-hooks/purity */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Gavel, TrendingUp } from "lucide-react";

import { getListingById } from "@/lib/mock/get-listing";
import { addBid, getBidsForListing, type Bid } from "@/lib/bids/bids";
import {
  formatTimeLeft,
  makeMockHistory,
  minIncrement,
  money,
} from "@/lib/auction/auction";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AuctionPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const listing = useMemo(() => (id ? getListingById(id) : null), [id]);

  // hydration-safe: only render time/locale after mount
  const [mounted, setMounted] = useState(false);

  const [now, setNow] = useState(Date.now());
  const [userBid, setUserBid] = useState<string>("");
  const [history, setHistory] = useState<Bid[]>([]);
  const [status, setStatus] = useState<"winning" | "outbid" | "idle">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  // tick every second for countdown (only matters after mount)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // load initial history (mock + stored)
  useEffect(() => {
    if (!listing) return;

    const stored = getBidsForListing(listing.id);
    const mock = makeMockHistory(listing);

    // merge and sort newest first
    const merged = [...stored, ...mock].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setHistory(merged);

    const top = merged[0];
    setStatus(top?.bidder === "You" ? "winning" : "outbid");
  }, [listing]);

  if (!listing) {
    return (
      <div className="sb-container py-10">
        <Card className="sb-card p-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Auction not found
          </h1>
          <p className="mt-2 text-slate-600">This listing id doesn’t exist.</p>
          <Button asChild className="mt-4 rounded-full">
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (!listing.isAuction) {
    return (
      <div className="sb-container py-10">
        <Card className="sb-card p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Not an auction</h1>
          <p className="mt-2 text-slate-600">
            This listing is Buy Now only. View it on the listing page.
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link href={`/listing/${listing.id}`}>Go to Listing</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // hydration-safe: don’t compute/render time until mounted
  const endMs = mounted ? new Date(listing.endsAt).getTime() - now : 0;
  const ended = mounted ? endMs <= 0 : false;

  // current bid = highest from history OR listing.currentBid
  const currentBid = Math.max(listing.currentBid, ...history.map((b) => b.amount), 0);

  const inc = minIncrement(currentBid);
  const minAllowed = currentBid + inc;

  const placeBid = () => {
    if (!mounted) return; // avoid doing time-based logic before mount
    if (ended) {
      toast("Auction ended");
      return;
    }

    const amount = Number(userBid);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast("Enter a valid amount");
      return;
    }

    if (amount < minAllowed) {
      toast(`Minimum bid is $${money(minAllowed)} (increment +$${inc})`);
      return;
    }

    // add your bid
    const bid = addBid(listing.id, amount, "You");
    const nextHistory = [bid, ...history].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setHistory(nextHistory);
    setStatus("winning");
    setUserBid("");
    toast.success("Bid placed");

    // simulate another bidder outbidding you sometimes
    const willOutbid = Math.random() < 0.45;
    if (willOutbid) {
      const delay = 1200 + Math.floor(Math.random() * 1800);
      setTimeout(() => {
        const otherAmount = amount + inc;
        const otherBid = addBid(listing.id, otherAmount, "Other");
        setHistory((prev) =>
          [otherBid, ...prev].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        setStatus("outbid");
        toast("You were outbid");
      }, delay);
    }
  };

  return (
    <div className="sb-container py-10">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/listing/${listing.id}`}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to listing
          </span>
        </Link>

        <Badge
          style={{
            background:
              status === "winning"
                ? "hsla(var(--sb-grad-b) / .16)"
                : "hsla(var(--sb-warm) / .18)",
            color: "hsl(var(--sb-text))",
          }}
        >
          {status === "winning"
            ? "You are winning"
            : status === "outbid"
            ? "Outbid"
            : "Auction"}
        </Badge>
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
        <span className="inline-flex items-center gap-2">
          <Gavel className="h-6 w-6" />
          Auction
        </span>
      </h1>

      <p className="mt-2 text-slate-600">{listing.title}</p>

      <Separator className="my-6" />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left: current + bid box */}
        <Card className="sb-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Current bid</p>
              <p className="mt-2 text-4xl font-semibold text-slate-900">
                ${money(currentBid)}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Minimum increment:{" "}
                <span className="font-semibold">+${money(inc)}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Time left</p>
              <p
                className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white"
                style={{
                  background: ended
                    ? "linear-gradient(135deg, #64748b, #94a3b8)"
                    : "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))",
                }}
              >
                {mounted ? formatTimeLeft(endMs) : "—"}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Ends: {mounted ? new Date(listing.endsAt).toLocaleString() : "—"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Place a bid</p>
            <p className="mt-1 text-sm text-slate-600">
              Minimum bid:{" "}
              <span className="font-semibold">${money(minAllowed)}</span>
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                inputMode="numeric"
                value={userBid}
                onChange={(e) => setUserBid(e.target.value)}
                placeholder={`Enter $${money(minAllowed)} or more`}
              />

              <Button
                onClick={placeBid}
                disabled={!mounted || ended}
                className="rounded-xl text-white h-11 font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                }}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Place Bid
              </Button>
            </div>

            {mounted && ended && (
              <p className="mt-3 text-sm font-semibold text-slate-700">
                This auction has ended.
              </p>
            )}
          </div>
        </Card>

        {/* Right: bid history */}
        <Card className="sb-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Bid history</p>
            <Badge
              style={{
                background: "hsla(var(--sb-grad-a) / .12)",
                color: "hsl(var(--sb-text))",
              }}
            >
              {history.length} bids
            </Badge>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bidder</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-slate-600">
                      No bids yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  history.slice(0, 8).map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-semibold">
                        {b.bidder === "You" ? (
                          <span
                            className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                            style={{
                              background: "hsla(var(--sb-grad-b)/.16)",
                            }}
                          >
                            You
                          </span>
                        ) : (
                          <span className="text-slate-700">Other</span>
                        )}
                      </TableCell>

                      <TableCell className="font-semibold text-slate-900">
                        ${money(b.amount)}
                      </TableCell>

                      <TableCell className="text-right text-slate-600 text-sm">
                        {mounted ? new Date(b.createdAt).toLocaleTimeString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Mock data + your bids are stored locally.
          </p>
        </Card>
      </div>
    </div>
  );
}
