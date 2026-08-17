// src/components/ui/state/LoadingStates.tsx
"use client";

import * as React from "react";
import { hnVars } from "../../../lib/ui/dynamic-style";
import { cn } from "../../../lib/utils";

/**
 * Spinner - Animated loading spinner
 *
 * Usage:
 * <Spinner size="md" />
 * <Spinner size="lg" color="blue" />
 */

export interface SpinnerProps {
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";

  /** Color variant */
  color?: "gray" | "blue" | "white";

  /** Optional className */
  className?: string;
}

export function Spinner(props: SpinnerProps) {
  const { size = "md", color = "blue", className } = props;

  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4",
  }[size];

  const colorClasses = {
    gray: "border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300",
    blue: "border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400",
    white: "border-white/30 border-t-white",
  }[color];

  return (
    <div
      className={cn("inline-block animate-spin rounded-full", sizeClasses, colorClasses, className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * LoadingOverlay - Full-page or container loading overlay
 *
 * Usage:
 * <LoadingOverlay message="Loading deals..." />
 */

export interface LoadingOverlayProps {
  /** Loading message */
  message?: string;

  /** Show as full-page overlay */
  fullPage?: boolean;

  /** Optional className */
  className?: string;
}

export function LoadingOverlay(props: LoadingOverlayProps) {
  const { message = "Loading...", fullPage, className } = props;

  const positionClasses = fullPage
    ? "fixed inset-0 z-50"
    : "absolute inset-0 z-10";

  return (
    <div
      className={cn(
        positionClasses,
        "flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm font-medium text-foreground">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * SkeletonLoader - Placeholder for loading content
 *
 * Usage:
 * <SkeletonLoader />
 * <SkeletonLoader variant="circle" className="h-12 w-12" />
 * <SkeletonLoader variant="text" rows={3} />
 */

export interface SkeletonLoaderProps {
  /** Shape variant */
  variant?: "rect" | "circle" | "text";

  /** Number of rows (for text variant) */
  rows?: number;

  /** Width (for rect/text) */
  width?: string;

  /** Height (for rect) */
  height?: string;

  /** Optional className */
  className?: string;
}

export function SkeletonLoader(props: SkeletonLoaderProps) {
  const { variant = "rect", rows = 1, width, height, className } = props;

  const baseClasses = "animate-pulse bg-muted";
  const widthClass = width ? "w-[var(--hn-width)]" : "";
  const heightClass = height ? "h-[var(--hn-height)]" : "";

  if (variant === "circle") {
    return (
      <div
        className={cn(
          baseClasses,
          "rounded-full",
          className || "h-12 w-12",
          widthClass,
          heightClass,
        )}
        style={hnVars({ "--hn-width": width, "--hn-height": height })}
      />
    );
  }

  if (variant === "text") {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              "h-4 rounded",
              i === rows - 1 && rows > 1 ? "w-2/3" : width ? "w-[var(--hn-width)]" : "w-full",
            )}
            style={hnVars({ "--hn-width": i === rows - 1 && rows > 1 ? undefined : width })}
          />
        ))}
      </div>
    );
  }

  // rect
  return (
    <div
      className={cn(baseClasses, "rounded", className || "h-32 w-full", widthClass, heightClass)}
      style={hnVars({ "--hn-width": width, "--hn-height": height })}
    />
  );
}

/**
 * TableSkeleton - Loading skeleton for table rows
 *
 * Usage:
 * <TableSkeleton columns={5} rows={10} />
 */

export interface TableSkeletonProps {
  /** Number of columns */
  columns: number;

  /** Number of rows to show */
  rows?: number;

  /** Optional className */
  className?: string;
}

export function TableSkeleton(props: TableSkeletonProps) {
  const { columns, rows = 5, className } = props;

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader
              key={colIndex}
              className={colIndex === 0 ? "h-12 flex-1" : "h-12 w-24"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * CardSkeleton - Loading skeleton for card layouts
 *
 * Usage:
 * <CardSkeleton />
 * <CardSkeleton variant="horizontal" />
 */

export interface CardSkeletonProps {
  /** Layout variant */
  variant?: "vertical" | "horizontal";

  /** Show image placeholder */
  showImage?: boolean;

  /** Optional className */
  className?: string;
}

export function CardSkeleton(props: CardSkeletonProps) {
  const { variant = "vertical", showImage = true, className } = props;

  if (variant === "horizontal") {
    return (
      <div
        className={cn(
          "flex gap-4 rounded-lg border border-border p-4",
          className,
        )}
      >
        {showImage && <SkeletonLoader className="h-24 w-24 flex-shrink-0" />}
        <div className="flex-1 space-y-3">
          <SkeletonLoader variant="text" rows={1} width="60%" />
          <SkeletonLoader variant="text" rows={2} />
          <div className="flex gap-2">
            <SkeletonLoader className="h-6 w-16" />
            <SkeletonLoader className="h-6 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 rounded-lg border border-border p-4", className)}>
      {showImage && <SkeletonLoader className="h-48 w-full" />}
      <SkeletonLoader variant="text" rows={1} width="70%" />
      <SkeletonLoader variant="text" rows={2} />
      <div className="flex gap-2">
        <SkeletonLoader className="h-6 w-16" />
        <SkeletonLoader className="h-6 w-16" />
      </div>
    </div>
  );
}
