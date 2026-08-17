// src/components/ui/layout/SplitLayout.tsx
import type * as React from "react";
import { cn } from "../../../lib/utils";

export type SplitRatio = "2-1" | "3-1" | "1-1";

const GRID: Record<SplitRatio, { grid: string; main: string; aside: string }> = {
  "2-1": { grid: "grid grid-cols-1 lg:grid-cols-3 gap-4", main: "lg:col-span-2", aside: "lg:col-span-1" },
  "3-1": { grid: "grid grid-cols-1 lg:grid-cols-4 gap-4", main: "lg:col-span-3", aside: "lg:col-span-1" },
  "1-1": { grid: "grid grid-cols-1 lg:grid-cols-2 gap-4", main: "", aside: "" },
};

export function SplitLayout(props: {
  ratio?: SplitRatio;
  className?: string;
  children: React.ReactNode;
}) {
  const { ratio = "2-1", className, children } = props;
  return <div className={cn(GRID[ratio].grid, className)}>{children}</div>;
}

export function SplitMain(props: React.HTMLAttributes<HTMLDivElement> & { ratio?: SplitRatio }) {
  const { ratio = "2-1", className, ...rest } = props;
  return <div className={cn(GRID[ratio].main, className)} {...rest} />;
}

export function SplitAside(props: React.HTMLAttributes<HTMLDivElement> & { ratio?: SplitRatio }) {
  const { ratio = "2-1", className, ...rest } = props;
  return <div className={cn(GRID[ratio].aside, className)} {...rest} />;
}