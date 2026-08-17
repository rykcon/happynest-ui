// src/components/ui/metrics/VolumeDisplay.tsx
"use client";

/**
 * Standardized volume and commission display
 * Used in Deals, Listings, and Person metrics
 */

import { cn } from "../../../lib/utils";

export function formatCurrency(amount: number | null | undefined, compact = false): string {
  if (amount == null || amount === 0) return "—";

  if (compact) {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface VolumeDisplayProps {
  volume: number | null | undefined;
  commission?: number | null | undefined;
  compact?: boolean;
  showCommission?: boolean;
  className?: string;
}

export function VolumeDisplay(props: VolumeDisplayProps) {
  const hasVolume = (props.volume || 0) > 0;
  const hasCommission = props.showCommission && (props.commission || 0) > 0;

  if (!hasVolume && !hasCommission) {
    return <span className={cn("text-muted-foreground", props.className)}>—</span>;
  }

  return (
    <div className={cn("flex flex-col gap-0.5", props.className)}>
      {hasVolume && (
        <div className="text-sm font-medium text-foreground">
          {formatCurrency(props.volume, props.compact)}
        </div>
      )}
      {hasCommission && (
        <div className="text-xs text-muted-foreground">
          {formatCurrency(props.commission, props.compact)} comm
        </div>
      )}
    </div>
  );
}

export interface VolumeBreakdownProps {
  potential?: number;
  pending?: number;
  closed?: number;
  compact?: boolean;
  className?: string;
}

export function VolumeBreakdown(props: VolumeBreakdownProps) {
  const hasPotential = (props.potential || 0) > 0;
  const hasPending = (props.pending || 0) > 0;
  const hasClosed = (props.closed || 0) > 0;

  if (!hasPotential && !hasPending && !hasClosed) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className={cn("flex flex-wrap gap-x-3 gap-y-1 text-xs", props.className)}>
      {hasPotential && (
        <div>
          <span className="font-medium text-info">
            {formatCurrency(props.potential, props.compact)}
          </span>
          <span className="text-muted-foreground"> potential</span>
        </div>
      )}
      {hasPending && (
        <div>
          <span className="font-medium text-warning">
            {formatCurrency(props.pending, props.compact)}
          </span>
          <span className="text-muted-foreground"> pending</span>
        </div>
      )}
      {hasClosed && (
        <div>
          <span className="font-medium text-success">
            {formatCurrency(props.closed, props.compact)}
          </span>
          <span className="text-muted-foreground"> closed</span>
        </div>
      )}
    </div>
  );
}
