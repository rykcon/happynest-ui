// src/components/ui/surface/SurfaceShell.tsx
"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../../shadcn/ui/drawer";
import { useLockBodyScroll } from "../sheet/useLockBodyScroll";
import { SkeletonLoader } from "../state";
import { cn } from "../../../lib/utils";

export type SurfaceWidth = "sm" | "md" | "lg" | "xl";

type TitleAs = "h1" | "h2" | "h3" | "div";

export type SurfaceHeaderSize = "compact" | "default";

type SurfaceShellProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  title: React.ReactNode;
  description?: React.ReactNode;

  width?: SurfaceWidth;

  headerRight?: React.ReactNode;
  headerBottom?: React.ReactNode;

  footer?: React.ReactNode;
  children: React.ReactNode;

  className?: string;
  bodyClassName?: string;

  headerClassName?: string;
  footerClassName?: string;

  stickyHeader?: boolean;
  stickyFooter?: boolean;

  titleAs?: TitleAs;
  a11yTitle?: string;

  /** NEW: makes header feel “page-like” and reduces redundancy with in-body titles */
  headerSize?: SurfaceHeaderSize; // default "default"

  /** NEW: allow tight icon toolbars without changing layout structure */
  headerTools?: React.ReactNode; // sits next to title row, before headerRight (use for icon buttons)

  /** NEW: fine-grain tweaks */
  titleClassName?: string;
  descriptionClassName?: string;
  headerInnerClassName?: string; // adjust padding without custom markup

  /** NEW: loading skeleton */
  loading?: boolean;
  skeleton?: React.ReactNode;
};

function SurfaceShell(props: SurfaceShellProps) {
  const {
    open,
    onOpenChange,
    title,
    description,
    width = "md",

    headerRight,
    headerTools,
    headerBottom,
    footer,

    children,
    className,
    bodyClassName,

    headerClassName,
    footerClassName,

    stickyHeader = true,
    stickyFooter = true,

    titleAs = "h2",
    a11yTitle,

    headerSize = "default",
    titleClassName,
    descriptionClassName,
    headerInnerClassName,
    loading = false,
    skeleton,
  } = props;

  useLockBodyScroll(open);

  const titleText = typeof title === "string" ? title : a11yTitle ?? "Panel";
  const TitleTag: any = titleAs;

  const headerPad = headerSize === "compact" ? "py-3 px-6" : "py-4 px-6"; 
  const titleTone =
    headerSize === "compact"
      ? "text-xl sm:text-2xl"
      : "text-2xl sm:text-3xl";

  const descTone =
    headerSize === "compact" ? "text-xs" : "text-sm";

  const defaultSkeleton = (
    <div className="space-y-4">
      <SkeletonLoader variant="text" rows={1} width="55%" />
      <SkeletonLoader variant="text" rows={2} />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonLoader className="h-24 w-full" />
        <SkeletonLoader className="h-24 w-full" />
      </div>
      <SkeletonLoader className="h-32 w-full" />
      <div className="flex gap-3">
        <SkeletonLoader className="h-9 w-24" />
        <SkeletonLoader className="h-9 w-24" />
      </div>
    </div>
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        className={cn(
          "p-0 h-[100dvh] max-h-[100dvh] max-w-full",
          "bg-card text-foreground border-l border-border",
          "data-[vaul-drawer-direction=right]:max-w-none data-[vaul-drawer-direction=right]:sm:max-w-none",
          "data-[vaul-drawer-direction=right]:w-[420px] data-[vaul-drawer-direction=right]:sm:w-[520px]",
          width === "md" ? "data-[vaul-drawer-direction=right]:w-[520px] data-[vaul-drawer-direction=right]:sm:w-[720px]" : "",
          width === "lg" ? "data-[vaul-drawer-direction=right]:w-[640px] data-[vaul-drawer-direction=right]:sm:w-[860px]" : "",
          width === "xl" ? "data-[vaul-drawer-direction=right]:w-[720px] data-[vaul-drawer-direction=right]:sm:w-[980px]" : "",
          "data-[state=open]:animate-in data-[state=open]:duration-200 data-[state=open]:ease-out",
          "data-[state=open]:slide-in-from-right",
          "data-[state=closed]:animate-out data-[state=closed]:duration-150 data-[state=closed]:ease-in",
          "data-[state=closed]:slide-out-to-right",
          "motion-reduce:transition-none motion-reduce:transform-none",
          className,
        )}
      >
        <DrawerTitle className="sr-only">{titleText}</DrawerTitle>
        {description ? (
          <DrawerDescription className="sr-only">
            {typeof description === "string" ? description : ""}
          </DrawerDescription>
        ) : null}

        <div className="flex h-full flex-col">
          <div
            className={cn(
              "border-b border-border",
              stickyHeader
                ? "sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
                : "",
              headerClassName,
            )}
          >
            <div className={cn(headerPad, headerInnerClassName)}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <TitleTag
                    className={cn(
                      "truncate leading-tight",
                      titleAs === "div" ? "font-semibold" : "",
                      titleAs !== "div" ? titleTone : "",
                      titleClassName,
                    )}
                  >
                    {title}
                  </TitleTag>

                  {description ? (
                    <div
                      className={cn(
                        "text-muted-foreground",
                        descTone,
                        descriptionClassName,
                      )}
                    >
                      {description}
                    </div>
                  ) : null}
                </div>

                {headerTools || headerRight ? (
                  <div className="ml-auto shrink-0 flex items-center gap-2">
                    {headerTools ? <div>{headerTools}</div> : null}
                    {headerRight ? <div>{headerRight}</div> : null}
                  </div>
                ) : null}
              </div>

              {headerBottom ? <div className="mt-3">{headerBottom}</div> : null}
            </div>
          </div>

          <div className={cn("flex-1 overflow-y-auto overscroll-contain py-4 px-6", bodyClassName)}>
            {loading ? (skeleton ?? defaultSkeleton) : children}
          </div>

          {footer ? (
            <div
              className={cn(
                "border-t border-border",
                stickyFooter
                  ? "sticky bottom-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
                  : "",
                footerClassName,
              )}
            >
              <div className="py-4 px-6">{footer}</div>
            </div>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function DrawerShell(props: SurfaceShellProps) {
  return <SurfaceShell {...props} />;
}

export function PanelShell(props: SurfaceShellProps) {
  return <SurfaceShell {...props} />;
}
