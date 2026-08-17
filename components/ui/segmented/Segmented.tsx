// src/components/ui/segmented/Segmented.tsx
"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { useIsMobile } from "../../../hooks/use-mobile";
import { cn } from "../../../lib/utils";

export type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  kind?: "divider";
};

export type SegmentedProps = {
  value: string;
  onChange: (value: string) => void;
  options: SegmentedOption[];
  trailing?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  maxVisible?: number;
  maxVisibleMobile?: number;
  overflowLabel?: React.ReactNode;
};

export function Segmented({
  value,
  onChange,
  options,
  trailing,
  className,
  buttonClassName,
  maxVisible,
  maxVisibleMobile,
  overflowLabel = "More",
}: SegmentedProps) {
  const isMobile = useIsMobile();
  const activeMax = isMobile && maxVisibleMobile ? maxVisibleMobile : maxVisible;

  const selectable = options.filter((o) => o.kind !== "divider");
  const visibleValues = new Set(
    activeMax && selectable.length > activeMax
      ? selectable.slice(0, activeMax).map((o) => o.value)
      : selectable.map((o) => o.value),
  );
  const overflowOptions =
    activeMax && selectable.length > activeMax
      ? selectable.slice(activeMax)
      : [];

  const visibleOptions = options.filter((o, idx) => {
    if (o.kind === "divider") {
      // Only keep divider if it separates two visible items.
      const prev = [...options]
        .slice(0, idx)
        .reverse()
        .find((opt) => opt.kind !== "divider");
      const next = options.slice(idx + 1).find((opt) => opt.kind !== "divider");
      if (!prev || !next) return false;
      return visibleValues.has(prev.value) && visibleValues.has(next.value);
    }
    return visibleValues.has(o.value);
  });

  const activeOverflow = overflowOptions.find((o) => o.value === value);

  return (
    <Tabs value={value} onValueChange={onChange} className={cn("inline-flex", className)}>
      <div className="inline-flex items-center gap-2">
        <TabsList className="rounded-xl border border-gray-200 bg-white p-1 text-muted-foreground dark:border-white/[0.08] dark:bg-white/[0.03]">
          {visibleOptions.map((o) => {
            if (o.kind === "divider") {
              return (
                <span
                  key={`${o.value}-divider`}
                  className="mx-1 h-5 w-px self-center bg-border"
                  aria-hidden="true"
                />
              );
            }
            return (
              <TabsTrigger
                key={o.value}
                value={o.value}
                className={cn(
                  "h-8 rounded-lg px-3 font-medium",
                  buttonClassName ?? "text-sm",
                )}
              >
                {o.label}
              </TabsTrigger>
            );
          })}
          {overflowOptions.length ? (
            <>
              <span className="mx-1 h-5 w-px self-center bg-border" aria-hidden="true" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-muted/60",
                      buttonClassName ?? "text-sm",
                    )}
                  >
                    <MoreHorizontalIcon className="h-4 w-4" />
                    <span className="max-w-[120px] truncate">{activeOverflow?.label ?? overflowLabel}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-40">
                  {overflowOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onSelect={() => onChange(opt.value)}
                      className={cn(value === opt.value ? "bg-muted" : "")}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </TabsList>
        {trailing ? <div className="flex items-center">{trailing}</div> : null}
      </div>
    </Tabs>
  );
}
