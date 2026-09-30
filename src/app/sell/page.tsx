"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Clock } from "lucide-react";

import type { ListingCategory } from "@/lib/mock/listings";
import { addUserListing, type UserListingDraft } from "@/lib/listings/user-listings";
import { money } from "@/lib/format";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

import { SitePreview } from "@/components/listing/site-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES: ListingCategory[] = ["SaaS", "Ecommerce", "Portfolio", "Agency", "Blog"];
const TECHS: UserListingDraft["techStack"] = ["Next.js", "React", "Vue", "HTML"];

type FormState = {
  title: string;
  category: ListingCategory | "";
  techStack: UserListingDraft["techStack"];
  price: string;
  isAuction: boolean;
  endsDate: string; // YYYY-MM-DD, local
  endsTime: string; // HH:mm, local
  shortPitch: string;
  tags: string; // comma separated
  screenshots: string; // comma separated URLs
};

const EMPTY: FormState = {
  title: "",
  category: "",
  techStack: ["Next.js", "React"],
  price: "199",
  isAuction: false,
  endsDate: "",
  endsTime: "",
  shortPitch: "",
  tags: "responsive, fast, SEO ready",
  screenshots: "",
};

/** Closing time as a datetime-local value, or "" until both parts are chosen. */
const endsAtOf = (f: FormState) => (f.endsDate && f.endsTime ? `${f.endsDate}T${f.endsTime}` : "");

const splitList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function SellPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState(false);
  const auctionPanel = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const errors = useMemo(() => validate(form), [form]);
  const valid = Object.keys(errors).length === 0;
  const show = (k: string) => (touched ? errors[k] : undefined);
  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  // Open and close the auction settings by animating their height.
  useGSAP(
    () => {
      const el = auctionPanel.current;
      if (!el) return;
      const vars = form.isAuction
        ? { height: "auto", autoAlpha: 1 }
        : { height: 0, autoAlpha: 0 };
      if (firstRun.current || prefersReducedMotion()) gsap.set(el, vars);
      else gsap.to(el, { ...vars, duration: 0.4, ease: "power2.inOut" });
      firstRun.current = false;
    },
    { dependencies: [form.isAuction] }
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) {
      toast.error("Some details need fixing before you can list this site");
      return;
    }
    addUserListing({
      title: form.title.trim(),
      category: form.category as ListingCategory,
      techStack: form.techStack,
      price: Number(form.price),
      isAuction: form.isAuction,
      endsAt: form.isAuction ? new Date(endsAtOf(form)).toISOString() : undefined,
      shortPitch: form.shortPitch.trim(),
      tags: splitList(form.tags).slice(0, 8),
      screenshots: splitList(form.screenshots).slice(0, 6),
    });
    toast.success("Listing saved to your dashboard");
    setForm({ ...EMPTY, category: form.category, techStack: form.techStack });
    setTouched(false);
  };

  return (
    <div className="sb-container py-12">
      <h1 className="display-tight text-5xl font-bold sm:text-6xl">List your site</h1>
      <p className="mt-3 max-w-lg text-muted-ink">
        Tell buyers what they&apos;re getting. You can sell at a fixed price or open an auction.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={submit} noValidate className="space-y-7">
          <Field id="title" label="Site name and one-line description" error={show("title")}>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="Harbor — booking site for surf schools (Next.js)"
              className="h-11 bg-card"
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-semibold">Kind of site</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c} active={form.category === c} onClick={() => set({ category: c })}>
                  {c}
                </Chip>
              ))}
            </div>
            <FieldError message={show("category")} />
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">Built with</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TECHS.map((t) => {
                const active = form.techStack.includes(t);
                return (
                  <Chip
                    key={t}
                    active={active}
                    onClick={() =>
                      set({ techStack: active ? form.techStack.filter((x) => x !== t) : [...form.techStack, t] })
                    }
                  >
                    {t}
                  </Chip>
                );
              })}
            </div>
            <FieldError message={show("techStack")} />
          </fieldset>

          <Field id="pitch" label="What makes it worth buying" error={show("shortPitch")}>
            <Textarea
              id="pitch"
              value={form.shortPitch}
              onChange={(e) => set({ shortPitch: e.target.value })}
              placeholder="Two or three sentences on traffic, features, or what's already done."
              className="min-h-28 bg-card"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="tags" label="Tags, separated by commas" error={show("tags")}>
              <Input id="tags" value={form.tags} onChange={(e) => set({ tags: e.target.value })} className="h-11 bg-card" />
            </Field>
            <Field id="shots" label="Screenshot links (optional)" error={show("screenshots")}>
              <Input
                id="shots"
                value={form.screenshots}
                onChange={(e) => set({ screenshots: e.target.value })}
                placeholder="https://…"
                className="h-11 bg-card"
              />
            </Field>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor="auction" className="text-base font-semibold">
                  Sell at auction
                </Label>
                <p className="mt-1 text-sm text-muted-ink">
                  Buyers bid until the closing time. Otherwise it sells at your fixed price.
                </p>
              </div>
              <Switch id="auction" checked={form.isAuction} onCheckedChange={(isAuction) => set({ isAuction })} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="price"
                label={form.isAuction ? "Starting bid (USD)" : "Price (USD)"}
                error={show("price")}
                className="mt-5"
              >
                <Input
                  id="price"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => set({ price: e.target.value.replace(/[^\d]/g, "") })}
                  className="tabular h-11 bg-paper"
                />
              </Field>
              <div ref={auctionPanel} className="overflow-hidden">
                <fieldset className="pt-5">
                  <legend className="text-sm font-semibold">Auction closes</legend>
                  {/* Phones: separate date and time pickers with visible icons */}
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
                    <PickerInput
                      icon={<CalendarDays />}
                      label="Closing date"
                      type="date"
                      value={form.endsDate}
                      onChange={(endsDate) => set({ endsDate })}
                      disabled={!form.isAuction}
                    />
                    <PickerInput
                      icon={<Clock />}
                      label="Closing time"
                      type="time"
                      value={form.endsTime}
                      onChange={(endsTime) => set({ endsTime })}
                      disabled={!form.isAuction}
                    />
                  </div>
                  {/* Larger screens: one combined picker */}
                  <div className="mt-2 hidden sm:block">
                    <PickerInput
                      icon={<CalendarDays />}
                      label="Closing date and time"
                      type="datetime-local"
                      value={endsAtOf(form)}
                      onChange={(v) => {
                        const [endsDate = "", endsTime = ""] = v.split("T");
                        set({ endsDate, endsTime: endsTime.slice(0, 5) });
                      }}
                      disabled={!form.isAuction}
                    />
                  </div>
                  <FieldError message={show("endsAt")} />
                </fieldset>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="h-12 rounded-full px-7 text-base">
              List this site
            </Button>
            <Button type="button" variant="outline" className="h-12 rounded-full bg-transparent px-6" onClick={() => { setForm(EMPTY); setTouched(false); }}>
              Start over
            </Button>
          </div>
        </form>

        <aside aria-label="Preview" className="h-fit lg:sticky lg:top-24">
          <p className="text-sm font-semibold">How buyers will see it</p>
          <div className="mt-3 overflow-hidden rounded-xl border bg-card">
            <div className="relative border-b">
              <SitePreview id={form.title || "draft"} category={form.category || "SaaS"} />
              {form.isAuction ? (
                <span className="absolute left-3 top-3 rounded-full bg-marigold px-2.5 py-1 text-xs font-semibold">
                  Live auction
                </span>
              ) : null}
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-ink">{form.category || "Pick a kind of site"}</p>
              <p className={cn("mt-2 text-lg font-semibold leading-snug", !form.title && "text-muted-ink")}>
                {form.title || "Your site's name"}
              </p>
              <p className="mt-1 line-clamp-3 text-sm text-muted-ink">
                {form.shortPitch || "Your description appears here."}
              </p>
              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-ink">{form.isAuction ? "Starting bid" : "Buy now"}</p>
                  <p className="tabular font-display text-2xl font-semibold">${money(Number(form.price || 0))}</p>
                </div>
                <p className="text-right text-xs text-muted-ink">{form.techStack.slice(0, 2).join(", ")}</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-ink">
            Listings you save appear on your <Link href="/dashboard" className="text-cobalt underline-offset-2 hover:underline">dashboard</Link>.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-md border px-3.5 py-2 text-sm transition-colors",
        active ? "border-ink bg-ink text-white" : "bg-card hover:border-ink/40"
      )}
    >
      {children}
    </button>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      <FieldError message={error} />
    </div>
  );
}

function PickerInput({
  icon,
  label,
  type,
  value,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  type: "date" | "time" | "datetime-local";
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative">
      <Input
        aria-label={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="sb-picker h-11 bg-paper pr-3"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-px right-px grid rounded-r-md bg-paper pl-2 pr-3 place-items-center text-muted-ink [&_svg]:size-4"
      >
        {icon}
      </span>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-destructive">{message}</p> : null;
}

function validate(f: FormState) {
  const e: Record<string, string> = {};

  if (f.title.trim().length < 6) e.title = "Give the site a name of at least 6 characters.";
  if (!f.category) e.category = "Choose what kind of site this is.";

  const price = Number(f.price);
  if (!Number.isFinite(price) || price <= 0) e.price = "Enter a price above $0.";

  if (f.techStack.length === 0) e.techStack = "Choose at least one technology.";
  if (f.shortPitch.trim().length < 10) e.shortPitch = "Write at least 10 characters so buyers know what it is.";
  if (splitList(f.tags).length === 0) e.tags = "Add at least one tag.";

  const bad = splitList(f.screenshots).find((u) => !/^https?:\/\/.+/i.test(u));
  if (bad) e.screenshots = "Screenshot links must start with http:// or https://.";

  if (f.isAuction) {
    const endsAt = endsAtOf(f);
    const end = Date.parse(endsAt);
    if (!f.endsDate) e.endsAt = "Choose the day the auction closes.";
    else if (!f.endsTime) e.endsAt = "Choose the time the auction closes.";
    else if (!endsAt || !Number.isFinite(end)) e.endsAt = "Choose when the auction closes.";
    else if (end < Date.now() + 10 * 60_000) e.endsAt = "Set a closing time at least 10 minutes from now.";
  }

  return e;
}
