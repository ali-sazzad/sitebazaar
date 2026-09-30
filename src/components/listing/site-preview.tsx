import type { ListingCategory } from "@/lib/mock/listings";
import { hueFor } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * A miniature, generated wireframe of the site being sold. Each category gets a
 * layout that reads like that kind of website; colours are seeded from the listing id.
 */
export function SitePreview({
  id,
  category,
  className,
}: {
  id: string;
  category: ListingCategory;
  className?: string;
}) {
  const h = hueFor(id);
  const vars = {
    "--p-bg": `hsl(${h} 45% 97%)`,
    "--p-ink": `hsl(${h} 45% 18%)`,
    "--p-accent": `hsl(${h} 78% 52%)`,
    "--p-soft": `hsl(${h} 55% 88%)`,
    "--p-line": `hsl(${h} 20% 82%)`,
  } as React.CSSProperties;

  return (
    <div
      aria-hidden="true"
      style={vars}
      className={cn(
        "relative flex aspect-[16/10] w-full flex-col overflow-hidden bg-[var(--p-bg)]",
        className
      )}
    >
      <div className="flex h-[9%] min-h-2.5 items-center gap-[1.5%] border-b border-[var(--p-line)] px-[3%]">
        <span className="size-[3.5%] min-w-1 rounded-full bg-[var(--p-line)]" />
        <span className="size-[3.5%] min-w-1 rounded-full bg-[var(--p-line)]" />
        <span className="size-[3.5%] min-w-1 rounded-full bg-[var(--p-line)]" />
        <span className="ml-[3%] h-[40%] w-[38%] rounded-full bg-[var(--p-line)]/70" />
      </div>
      <div className="relative flex-1 p-[5%]">{LAYOUTS[category]}</div>
    </div>
  );
}

const bar = "rounded-[2px] bg-[var(--p-ink)]";
const line = "rounded-[2px] bg-[var(--p-line)]";
const accent = "rounded-[3px] bg-[var(--p-accent)]";
const soft = "rounded-[4px] bg-[var(--p-soft)]";

const LAYOUTS: Record<ListingCategory, React.ReactNode> = {
  SaaS: (
    <div className="flex h-full flex-col items-center gap-[6%]">
      <div className={cn(bar, "h-[9%] w-[62%]")} />
      <div className={cn(line, "h-[5%] w-[44%]")} />
      <div className={cn(accent, "h-[9%] w-[22%]")} />
      <div className="grid w-full flex-1 grid-cols-3 gap-[4%]">
        <div className={soft} />
        <div className="rounded-[4px] border-2 border-[var(--p-accent)] bg-white/60" />
        <div className={soft} />
      </div>
    </div>
  ),
  Ecommerce: (
    <div className="flex h-full flex-col gap-[6%]">
      <div className="flex items-center justify-between">
        <div className={cn(bar, "h-[10%] min-h-1.5 w-[24%]")} />
        <div className={cn(accent, "h-2 w-[12%]")} />
      </div>
      <div className="grid flex-1 grid-cols-4 gap-[4%]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-[8%]">
            <div className={cn(soft, "flex-1")} />
            <div className={cn(line, "h-[10%]")} />
          </div>
        ))}
      </div>
    </div>
  ),
  Portfolio: (
    <div className="grid h-full grid-cols-[1fr_1.4fr] gap-[5%]">
      <div className="flex flex-col justify-end gap-[8%] pb-[6%]">
        <div className={cn(bar, "h-[14%] w-[90%]")} />
        <div className={cn(bar, "h-[14%] w-[70%]")} />
        <div className={cn(line, "h-[6%] w-[60%]")} />
      </div>
      <div className="grid grid-rows-[1.3fr_1fr] gap-[6%]">
        <div className={cn(accent, "rounded-[4px] opacity-80")} />
        <div className="grid grid-cols-2 gap-[6%]">
          <div className={soft} />
          <div className={soft} />
        </div>
      </div>
    </div>
  ),
  Blog: (
    <div className="mx-auto flex h-full w-[70%] flex-col gap-[5%]">
      <div className={cn(accent, "h-[5%] w-[16%]")} />
      <div className={cn(bar, "h-[10%] w-full")} />
      <div className={cn(bar, "h-[10%] w-[75%]")} />
      <div className="mt-[3%] flex flex-col gap-[7%]">
        {[100, 96, 100, 88, 94, 60].map((w, i) => (
          <div key={i} className={cn(line, "h-1")} style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  ),
  Agency: (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-[6%]">
        <div className={cn(bar, "h-[16%] min-h-2 w-[85%]")} />
        <div className="flex items-center gap-[3%]">
          <div className={cn(bar, "h-[16%] min-h-2 w-[50%]")} />
          <div className="aspect-square h-4 rounded-full bg-[var(--p-accent)]" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[4%]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className={cn(soft, "aspect-[4/3]")} />
            <div className={cn(line, "h-1 w-[70%]")} />
          </div>
        ))}
      </div>
    </div>
  ),
};
