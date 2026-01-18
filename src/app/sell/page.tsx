/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addUserListing } from "@/lib/listings/user-listings";

const categories = ["Portfolio", "Ecommerce", "SaaS", "Blog", "Agency"] as const;
const techs = ["Next.js", "React", "Vue", "HTML"] as const;

type FormState = {
  title: string;
  category: (typeof categories)[number] | "";
  techStack: string[]; // store as strings in form
  price: string;
  isAuction: boolean;
  endsAt: string; // datetime-local string
  shortPitch: string;
  tags: string; // comma separated
  screenshots: string; // comma separated URLs
};

export default function SellPage() {
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "",
    techStack: ["Next.js", "React"], // default
    price: "199",
    isAuction: false,
    endsAt: "",
    shortPitch: "",
    tags: "clean, responsive, modern",
    screenshots: "",
  });

  const errors = useMemo(() => validate(form), [form]);

  const canSubmit = Object.keys(errors).length === 0;

  const submit = () => {
    if (!canSubmit) {
      toast("Please fix the errors");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);

    const screenshots = form.screenshots
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 6);

    const draft = addUserListing({
      title: form.title.trim(),
      category: form.category as any,
      techStack: form.techStack as any,
      price: Number(form.price),
      isAuction: form.isAuction,
      endsAt: form.isAuction ? new Date(form.endsAt).toISOString() : undefined,
      shortPitch: form.shortPitch.trim(),
      tags,
      screenshots,
    });

    toast.success("Listing draft saved (local)");
    // light reset (keep some defaults)
    setForm((p) => ({
      ...p,
      title: "",
      shortPitch: "",
      screenshots: "",
      endsAt: "",
    }));

    console.log("Saved draft:", draft);
  };

  return (
    <div className="sb-container py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Sell a Website
          </h1>
          <p className="mt-2 text-slate-600">
            Frontend-only form. We save your listing draft to localStorage.
          </p>
        </div>

        <Badge
          style={{
            background: "hsla(var(--sb-grad-a) / .12)",
            color: "hsl(var(--sb-text))",
          }}
        >
          Mock upload • Mock escrow • Real UX
        </Badge>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Form */}
        <Card className="sb-card p-6">
          <div className="grid gap-5">
            {/* Title */}
            <Field label="Title" error={errors.title}>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Premium SaaS landing page (Next.js + Tailwind)"
              />
            </Field>

            {/* Category + Price */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" error={errors.category}>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v as any }))}
                >
                  <SelectTrigger className="bg-white/90 border-slate-200 hover:bg-white">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 shadow-xl">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Price (AUD)" error={errors.price}>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="199"
                />
              </Field>
            </div>

            {/* Tech stack chips */}
            <div>
              <p className="text-sm font-semibold text-slate-900">Tech stack</p>
              <p className="mt-1 text-sm text-slate-600">
                Pick at least 1.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {techs.map((t) => {
                  const active = form.techStack.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          techStack: active
                            ? p.techStack.filter((x) => x !== t)
                            : [...p.techStack, t],
                        }))
                      }
                      className={[
                        "rounded-full px-3 py-1 text-sm font-semibold border transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        active
                          ? "text-white border-transparent"
                          : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                      style={
                        active
                          ? {
                              background:
                                "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                            }
                          : undefined
                      }
                      aria-pressed={active}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              {errors.techStack ? (
                <p className="mt-2 text-sm text-red-600">{errors.techStack}</p>
              ) : null}
            </div>

            {/* Pitch */}
            <Field label="Short pitch" error={errors.shortPitch}>
              <Textarea
                value={form.shortPitch}
                onChange={(e) => setForm((p) => ({ ...p, shortPitch: e.target.value }))}
                placeholder="2–3 lines describing what makes this website valuable…"
                className="min-h-27.5"
              />
            </Field>

            {/* Tags */}
            <Field label="Tags (comma separated)" error={errors.tags}>
              <Input
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="clean, responsive, seo, fast"
              />
            </Field>

            {/* Screenshots */}
            <Field label="Screenshot URLs (comma separated) — mock" error={errors.screenshots}>
              <Input
                value={form.screenshots}
                onChange={(e) => setForm((p) => ({ ...p, screenshots: e.target.value }))}
                placeholder="https://…/1.png, https://…/2.png"
              />
            </Field>

            {/* Auction toggle */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Auction</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Turn on bidding instead of fixed price.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, isAuction: !p.isAuction }))}
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: form.isAuction
                      ? "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))"
                      : "rgba(15, 23, 42, .08)",
                    color: form.isAuction ? "white" : "rgba(15, 23, 42, .9)",
                  }}
                  aria-pressed={form.isAuction}
                >
                  {form.isAuction ? "ON" : "OFF"}
                </button>
              </div>

              {form.isAuction && (
                <div className="mt-4">
                  <Field label="Auction end date/time" error={errors.endsAt}>
                    <Input
                      type="datetime-local"
                      value={form.endsAt}
                      onChange={(e) => setForm((p) => ({ ...p, endsAt: e.target.value }))}
                    />
                  </Field>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" className="rounded-xl" onClick={() => setForm((p) => ({ ...p, title: "", shortPitch: "", endsAt: "", screenshots: "" }))}>
                Clear
              </Button>
              <Button
                className="rounded-xl text-white h-11 font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                }}
                onClick={submit}
                disabled={!canSubmit}
              >
                Save listing draft
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview card */}
        <Card className="sb-card p-6">
          <p className="text-sm font-semibold text-slate-900">Preview</p>
          <p className="mt-1 text-sm text-slate-600">
            This is what your listing data looks like (mock preview).
          </p>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">
              {form.title || "Your listing title…"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {form.shortPitch || "Your short pitch will appear here."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(form.category ? [form.category] : ["Category"]).map((x) => (
                <span key={x} className="sb-chip">{x}</span>
              ))}
              {form.techStack.slice(0, 3).map((t) => (
                <span key={t} className="sb-chip">{t}</span>
              ))}
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-500">Price</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${Number(form.price || 0).toLocaleString()}
                </p>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                style={{
                  background: form.isAuction
                    ? "linear-gradient(135deg, hsl(var(--sb-warm)), hsl(var(--sb-grad-a)))"
                    : "linear-gradient(135deg, hsl(var(--sb-grad-a)), hsl(var(--sb-grad-b)))",
                }}
              >
                {form.isAuction ? "Auction" : "Buy Now"}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Validation</p>
            <p className="mt-1 text-sm text-slate-600">
              {canSubmit ? "Looks good ✅" : "Fix the errors to save ❌"}
            </p>
          </div>

          <Button asChild variant="outline" className="mt-5 rounded-xl w-full">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function validate(f: FormState) {
  const e: Record<string, string> = {};

  if (f.title.trim().length < 6) e.title = "Title must be at least 6 characters.";
  if (!f.category) e.category = "Pick a category.";
  const priceNum = Number(f.price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) e.price = "Enter a valid price.";
  if (!f.techStack || f.techStack.length === 0) e.techStack = "Pick at least 1 tech stack item.";
  if (f.shortPitch.trim().length < 10) e.shortPitch = "Short pitch must be at least 10 characters.";

  const tags = f.tags.split(",").map((t) => t.trim()).filter(Boolean);
  if (tags.length === 0) e.tags = "Add at least 1 tag.";

  const urls = f.screenshots.split(",").map((u) => u.trim()).filter(Boolean);
  if (urls.length > 0) {
    const bad = urls.find((u) => !/^https?:\/\/.+/i.test(u));
    if (bad) e.screenshots = "Screenshot URLs must start with http(s):// (mock).";
  }

  if (f.isAuction) {
    if (!f.endsAt) e.endsAt = "Choose an auction end date/time.";
    else {
      const end = new Date(f.endsAt).getTime();
      if (!Number.isFinite(end) || end < Date.now() + 1000 * 60 * 10) {
        e.endsAt = "End time must be at least 10 minutes from now.";
      }
    }
  }

  return e;
}
