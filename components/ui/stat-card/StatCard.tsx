// src/components/ui/stat-card/StatCard.tsx
"use client";

import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";

export type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  onClick?: () => void;
};

export function StatCard({ label, value, sub, tone = "default", onClick }: StatCardProps) {
  const statCardVariants = cva("w-full rounded-xl border p-4 text-left", {
    variants: {
      tone: {
        success:
          "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10",
        danger:
          "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20",
        warning:
          "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10",
        info:
          "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10",
        default: "border-border bg-card text-card-foreground",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  });

  const clickable = !!onClick;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={cn(
        statCardVariants({ tone }),
        clickable ? "cursor-pointer hover:opacity-95" : "cursor-default",
      )}
    >
      <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
      {sub ? (
        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
          {sub}
        </div>
      ) : null}
    </button>
  );
}
