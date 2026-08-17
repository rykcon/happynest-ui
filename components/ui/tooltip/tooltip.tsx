// src/components/ui/tooltip/Tooltip.tsx
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../../lib/utils";

type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

type TooltipCtx = {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
};

const TooltipContext = React.createContext<TooltipCtx | null>(null);

function useTooltipCtx() {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip components must be used within <TooltipRoot>.");
  return ctx;
}

function parsePlacement(
  placement?: Placement,
): { side: TooltipCtx["side"]; align: TooltipCtx["align"] } {
  if (!placement) return { side: "top", align: "start" };
  const [sideRaw, alignRaw] = placement.split("-");
  const side: TooltipCtx["side"] =
    sideRaw === "top" || sideRaw === "right" || sideRaw === "bottom" || sideRaw === "left"
      ? sideRaw
      : "top";
  const align: TooltipCtx["align"] = alignRaw === "start" || alignRaw === "end" ? alignRaw : "center";
  return { side, align };
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={150}>{children}</TooltipPrimitive.Provider>;
}

export function TooltipRoot(props: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  placement?: Placement;
  offsetPx?: number;
}) {
  const { side, align } = parsePlacement(props.placement);
  const value = React.useMemo(
    () => ({
      side,
      align,
      sideOffset: props.offsetPx ?? 8,
    }),
    [side, align, props.offsetPx],
  );

  return (
    <TooltipContext.Provider value={value}>
      <TooltipPrimitive.Root open={props.open} onOpenChange={props.onOpenChange}>
        {props.children}
      </TooltipPrimitive.Root>
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipVariant = "default" | "muted" | "inverse";

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    title?: string;
    description?: string;
    href?: string;
    linkLabel?: string;
    children?: React.ReactNode;
    variant?: TooltipVariant;
  }
>(({ title, description, href, linkLabel, children, variant = "default", className, ...props }, ref) => {
  const ctx = useTooltipCtx();
  const hasRich = Boolean(title) || Boolean(description) || Boolean(href);

  // Token-first styling. These classes should be backed by globals.css tokens.
  const variantClass =
    variant === "inverse"
      ? "tooltip tooltip--inverse"
      : variant === "muted"
        ? "tooltip tooltip--muted"
        : "tooltip";

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        side={ctx.side}
        align={ctx.align}
        sideOffset={ctx.sideOffset}
        className={cn(
          variantClass,
          "pointer-events-none z-[1000] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
      >
        {hasRich ? (
          <>
            {title ? <div className="tooltip-title">{title}</div> : null}
            {description ? <div className="tooltip-description">{description}</div> : null}
            {href ? (
              <a href={href} className="tooltip-link">
                {linkLabel ?? "Learn more"}
              </a>
            ) : null}
          </>
        ) : (
          children
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export function Tooltip(props: {
  children: React.ReactElement;

  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;

  variant?: TooltipVariant;
  className?: string;
  placement?: Placement;
  offsetPx?: number;
}) {
  return (
    <TooltipProvider>
      <TooltipRoot placement={props.placement} offsetPx={props.offsetPx}>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent
          title={props.title}
          description={props.description}
          href={props.href}
          linkLabel={props.linkLabel}
          variant={props.variant}
          className={props.className}
        />
      </TooltipRoot>
    </TooltipProvider>
  );
}
