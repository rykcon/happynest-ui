// src/components/ui/icon-button/IconButton.tsx
"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";


export type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  icon: React.ReactNode;
  label: string; // for aria-label + tooltip text
  active?: boolean;
  size?: "sm" | "md";
};

const sizes: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
};

export default function IconButton({
  icon,
  label,
  active,
  size = "md",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        // tokenized base
        "btn-base inline-flex items-center justify-center p-0",
        "border border-border bg-background hover:bg-muted",
        "text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-60",
        sizes[size],
        active ? "bg-foreground text-background hover:bg-foreground" : "",
        className,
      )}
      {...rest}
    >
      <span className="inline-flex items-center justify-center">{icon}</span>
    </button>
  );
}