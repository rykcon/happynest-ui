// src/components/ui/surface/surface-primitives.tsx
import type * as React from "react";
import { cn } from "../../../lib/utils";

export type SurfaceVariant = "primary" | "plain" | "glass" | "outline" | "elevated" | "bare" | "muted";
export type SurfaceTone = "primary" | "muted";

function cardVariantClass(v: SurfaceVariant | undefined) {
  switch (v) {
    case "plain":
      return "card--plain";
    case "glass":
      return "card--glass";
    case "outline":
      return "card--outlined";
    case "elevated":
      return "card--elevated";
    case "bare":
      return "card--bare";
    case "muted":
      return "card--muted";
    case "primary":
    default:
      return "";
  }
}

function panelVariantClass(v: SurfaceVariant | undefined) {
  switch (v) {
    case "plain":
      return "panel--plain";
    case "glass":
      return "panel--glass";
    case "outline":
      return "panel--outlined";
    case "elevated":
      return "panel--elevated";
    case "bare":
      return "panel--bare";
    case "muted": 
      return "panel--muted";
    case "primary":
    default:
      return "";
  }
}

function toneClass(t: SurfaceTone | undefined) {
  switch (t) {
    case "muted":
      return "surface-muted";
    case "primary":
    default:
      return "";
  }
}

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
  tone?: SurfaceTone;
};

export function Card({
  className,
  variant = "primary",
  tone = "primary",
  ...props
}: CardProps) {
  return (
    <div
      className={cn("card", cardVariantClass(variant), toneClass(tone), className)}
      {...props}
    />
  );
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
};

export function CardHeader({
  className,
  title,
  subtitle,
  action,
  children,
  ...props
}: CardHeaderProps) {
  const hasStructured = title || subtitle || action;

  return (
    <div className={cn("surface-header", className)} {...props}>
      {hasStructured ? (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            {title ? (
              <h1 className="truncate text-title-xs font-semibold text-foreground">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <div className="mt-0.5 text-xs text-muted-foreground">
                {subtitle}
              </div>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface-stack", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface-footer surface-divider pt-3", className)} {...props} />;
}

export type PanelProps = React.HTMLAttributes<HTMLElement> & {
  variant?: SurfaceVariant;
  tone?: SurfaceTone;
};

export function Panel({
  className,
  variant = "primary",
  tone = "primary",
  ...props
}: PanelProps) {
  return (
    <section
      className={cn("panel", panelVariantClass(variant), toneClass(tone), className)}
      {...props}
    />
  );
}

export function Inset({
  className,
  variant = "primary",
  tone = "muted",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
  tone?: SurfaceTone;
}) {
  return (
    <div
      className={cn(
        "inset",
        variant ? `inset--${variant}` : "",
        tone ? `inset--${tone}` : "",
        className,
      )}
      {...props}
    />
  );
}