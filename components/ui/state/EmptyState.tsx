// src/components/ui/state/EmptyState.tsx
"use client";

import * as React from "react";
import { Button } from "../button";
import { cn } from "../../../lib/utils";

/**
 * EmptyState - Display when no data is available
 *
 * Usage:
 * <EmptyState
 *   icon={<InboxIcon />}
 *   title="No deals yet"
 *   description="Create your first deal to get started"
 *   action={{ label: "New Deal", onClick: handleCreate }}
 * />
 */

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export interface EmptyStateProps {
  /** Icon to display */
  icon?: React.ReactNode;

  /** Title text */
  title: string;

  /** Description text */
  description?: string;

  /** Primary action button */
  action?: EmptyStateAction;

  /** Secondary action button */
  secondaryAction?: EmptyStateAction;

  /** Custom content below description */
  children?: React.ReactNode;

  /** Optional className */
  className?: string;

  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export function EmptyState(props: EmptyStateProps) {
  const {
    icon,
    title,
    description,
    action,
    secondaryAction,
    children,
    className,
    size = "md",
  } = props;

  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "h-8 w-8",
      title: "text-sm",
      description: "text-xs",
    },
    md: {
      container: "py-12",
      icon: "h-12 w-12",
      title: "text-base",
      description: "text-sm",
    },
    lg: {
      container: "py-16",
      icon: "h-16 w-16",
      title: "text-lg",
      description: "text-base",
    },
  }[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeClasses.container,
        className,
      )}
    >
      {icon && (
        <div
          className={cn(sizeClasses.icon, "mb-4 text-muted-foreground")}
        >
          {icon}
        </div>
      )}

      <h3
        className={cn(sizeClasses.title, "font-medium text-foreground")}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(sizeClasses.description, "mt-2 max-w-sm text-muted-foreground")}
        >
          {description}
        </p>
      )}

      {children && <div className="mt-4">{children}</div>}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button
              variant={action.variant || "primary"}
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "outline"}
              onClick={secondaryAction.onClick}
              icon={secondaryAction.icon}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * NoResults - Empty state for search/filter with no results
 *
 * Usage:
 * <NoResults
 *   searchQuery="John Doe"
 *   onClear={() => setQuery("")}
 * />
 */
export interface NoResultsProps {
  /** Search query that returned no results */
  searchQuery?: string;

  /** Filter description */
  filterDescription?: string;

  /** Clear filters/search handler */
  onClear?: () => void;

  /** Optional className */
  className?: string;
}

export function NoResults(props: NoResultsProps) {
  const { searchQuery, filterDescription, onClear, className } = props;

  let description = "Try adjusting your search or filters.";
  if (searchQuery) {
    description = `No results found for "${searchQuery}". ${description}`;
  } else if (filterDescription) {
    description = `No results match ${filterDescription}. ${description}`;
  }

  return (
    <EmptyState
      title="No results found"
      description={description}
      action={
        onClear
          ? {
              label: "Clear filters",
              onClick: onClear,
              variant: "outline",
            }
          : undefined
      }
      size="sm"
      className={className}
    />
  );
}
