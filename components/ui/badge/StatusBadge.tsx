// src/components/badges/StatusBadge.tsx
"use client";

import * as React from "react";
import { Badge } from "../../shadcn/ui/badge";

type Domain = "person_stage" | "listing_status";

type BadgeProps = React.ComponentProps<typeof Badge>;

type StatusBadgeProps = Omit<BadgeProps, "children"> & {
  domain: Domain;
  value: string | null | undefined;
  label?: string; // optional override
};

/**
 * Normalize strings so "Under Contract", "under_contract", "UNDER-CONTRACT" map the same.
 */
function norm(v: string) {
  return v
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
}

type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "neutral"
  | "inverse";

type BadgeVariant = "light" | "solid" | "outline";

type Preset = {
  label: string;
  color: BadgeColor;
  variant?: BadgeVariant;
};

const PERSON_STAGE: Record<string, Preset> = {
  // You can tune these to match your actual stage names.
  new: { label: "New", color: "info" },
  lead: { label: "Lead", color: "info" },
  nurture: { label: "Nurture", color: "neutral" },
  warm: { label: "Warm", color: "warning" },
  hot: { label: "Hot", color: "warning", variant: "solid" },
  appointment_set: { label: "Appointment Set", color: "primary" },
  appointment_completed: { label: "Appointment Complete", color: "primary" },
  active_client: { label: "Active Client", color: "success" },
  under_contract: { label: "Under Contract", color: "success", variant: "solid" },
  closed: { label: "Closed", color: "success", variant: "solid" },
  lost: { label: "Lost", color: "error" },
  junk: { label: "Junk", color: "neutral", variant: "outline" },
  do_not_contact: { label: "DNC", color: "error", variant: "outline" },
};

const LISTING_STATUS: Record<string, Preset> = {
  coming_soon: { label: "Coming Soon", color: "info" },
  active: { label: "Active", color: "success" },
  contingent: { label: "Contingent", color: "warning" },
  pending: { label: "Pending", color: "warning", variant: "solid" },
  under_contract: { label: "Under Contract", color: "warning", variant: "solid" },
  temp_off_market: { label: "Temp Off Market", color: "neutral" },
  withdrawn: { label: "Withdrawn", color: "neutral", variant: "outline" },
  expired: { label: "Expired", color: "neutral", variant: "outline" },
  canceled: { label: "Canceled", color: "neutral", variant: "outline" },
  sold: { label: "Sold", color: "success", variant: "solid" },
};

function titleize(raw: string) {
  const s = raw.replace(/[_-]+/g, " ").trim();
  return s.length ? s.replace(/\b\w/g, (m) => m.toUpperCase()) : "—";
}

function presetFor(domain: Domain, raw: string): Preset | null {
  const k = norm(raw);
  if (domain === "person_stage") return PERSON_STAGE[k] ?? null;
  return LISTING_STATUS[k] ?? null;
}

export function StatusBadge({
  domain,
  value,
  label,
  variant = "light",
  className,
  ...rest
}: StatusBadgeProps) {
  const v = (value ?? "").trim();
  if (!v) {
    return (
      <Badge
        variant="outline"
        className={className}
        {...rest}
      >
        —
      </Badge>
    );
  }

  const p = presetFor(domain, v);

  return (
    <Badge
      variant={p?.variant ?? variant}
      className={className}
      title={p?.label ?? label ?? v}
      {...rest}
    >
      {label ?? p?.label ?? titleize(v)}
    </Badge>
  );
}

export default StatusBadge;
