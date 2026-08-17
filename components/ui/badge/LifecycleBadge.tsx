// src/components/ui/badge/LifecycleBadge.tsx
"use client";

import { Badge } from "../../shadcn/ui/badge";

/**
 * Unified lifecycle badge component for all entity types
 * Supports: Person, Deal, Listing, Appointment
 */

export type PersonLifecycle = "client" | "pending" | "next_up" | "lead" | "cold";
export type DealLifecycle = "potential" | "pending" | "closed_won" | "closed_lost";
export type ListingLifecycle = "pre_listing" | "active" | "pending" | "closed_sold" | "closed_other";
export type AppointmentLifecycle = "upcoming" | "completed" | "outcome_needed" | "cancelled" | "no_show";

export type Lifecycle = PersonLifecycle | DealLifecycle | ListingLifecycle | AppointmentLifecycle;

interface LifecycleBadgeConfig {
  variant: "solid" | "light";
  color: "success" | "info" | "warning" | "primary" | "error" | "dark";
  label: string;
}

function getPersonLifecycleBadge(lc: PersonLifecycle): LifecycleBadgeConfig {
  switch (lc) {
    case "client":
      return { variant: "solid", color: "success", label: "Client" };
    case "pending":
      return { variant: "solid", color: "warning", label: "Pending" };
    case "next_up":
      return { variant: "light", color: "info", label: "Next Up" };
    case "lead":
      return { variant: "light", color: "primary", label: "Lead" };
    case "cold":
      return { variant: "light", color: "dark", label: "Cold" };
  }
}

function getDealLifecycleBadge(lc: DealLifecycle): LifecycleBadgeConfig {
  switch (lc) {
    case "potential":
      return { variant: "light", color: "info", label: "Potential" };
    case "pending":
      return { variant: "solid", color: "warning", label: "Pending" };
    case "closed_won":
      return { variant: "solid", color: "success", label: "Closed Won" };
    case "closed_lost":
      return { variant: "light", color: "error", label: "Closed Lost" };
  }
}

function getListingLifecycleBadge(lc: ListingLifecycle): LifecycleBadgeConfig {
  switch (lc) {
    case "pre_listing":
      return { variant: "light", color: "primary", label: "Pre-Listing" };
    case "active":
      return { variant: "solid", color: "info", label: "Active" };
    case "pending":
      return { variant: "solid", color: "warning", label: "Pending" };
    case "closed_sold":
      return { variant: "solid", color: "success", label: "Sold" };
    case "closed_other":
      return { variant: "light", color: "dark", label: "Closed" };
  }
}

function getAppointmentLifecycleBadge(lc: AppointmentLifecycle): LifecycleBadgeConfig {
  switch (lc) {
    case "upcoming":
      return { variant: "solid", color: "info", label: "Upcoming" };
    case "completed":
      return { variant: "solid", color: "success", label: "Completed" };
    case "outcome_needed":
      return { variant: "solid", color: "warning", label: "Outcome Needed" };
    case "cancelled":
      return { variant: "light", color: "dark", label: "Cancelled" };
    case "no_show":
      return { variant: "light", color: "error", label: "No Show" };
  }
}

export interface LifecycleBadgeProps {
  lifecycle: Lifecycle | null | undefined;
  type: "person" | "deal" | "listing" | "appointment";
  className?: string;
}

export function LifecycleBadge(props: LifecycleBadgeProps) {
  if (!props.lifecycle) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  let config: LifecycleBadgeConfig;

  switch (props.type) {
    case "person":
      config = getPersonLifecycleBadge(props.lifecycle as PersonLifecycle);
      break;
    case "deal":
      config = getDealLifecycleBadge(props.lifecycle as DealLifecycle);
      break;
    case "listing":
      config = getListingLifecycleBadge(props.lifecycle as ListingLifecycle);
      break;
    case "appointment":
      config = getAppointmentLifecycleBadge(props.lifecycle as AppointmentLifecycle);
      break;
    default:
      return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <Badge
      variant={config.variant}
      className={`rounded-lg ${props.className || ""}`}
    >
      {config.label}
    </Badge>
  );
}
