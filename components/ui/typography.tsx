"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn("scroll-m-20 text-4xl font-bold tracking-tight", className)} {...props} />
  ),
);
H1.displayName = "H1";

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("scroll-m-20 text-3xl font-semibold tracking-tight", className)} {...props} />
  ),
);
H2.displayName = "H2";

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
  ),
);
H3.displayName = "H3";

const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("leading-7 text-muted-foreground", className)} {...props} />
  ),
);
P.displayName = "P";

const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-lg text-muted-foreground", className)} {...props} />
  ),
);
Lead.displayName = "Lead";

const Muted = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
Muted.displayName = "Muted";

export { H1, H2, H3, P, Lead, Muted };
