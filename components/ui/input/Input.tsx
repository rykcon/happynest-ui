// src/components/ui/input/Input.tsx
"use client";

import * as React from "react";

import { cn } from "../../../lib/utils";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /**
   * Match Button sizing (height + horizontal padding + font size).
   * Button: sm=h-9, md=h-10, lg=h-11
   */
  size?: InputSize;

  /**
   * Optional adornments. If provided, we keep consistent height and
   * switch to left/right padding that accounts for the adornments.
   */
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;

  /**
   * Optional wrapper className (applies to the relative container).
   */
  wrapperClassName?: string;
};

const base =
  "flex w-full rounded-md border border-input bg-background text-foreground shadow-theme-xs ring-offset-background " +
  "placeholder:text-muted-foreground transition-colors " +
  "file:border-0 file:bg-transparent file:text-sm file:font-medium " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const sizes: Record<InputSize, { input: string; startSlot: string; endSlot: string }> = {
  sm: {
    input: "h-9 text-sm",
    startSlot: "h-9 w-10",
    endSlot: "h-9 w-12",
  },
  md: {
    input: "h-10 text-sm",
    startSlot: "h-10 w-10",
    endSlot: "h-10 w-12",
  },
  lg: {
    input: "h-11 text-sm",
    startSlot: "h-11 w-12",
    endSlot: "h-11 w-14",
  },
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      startAdornment,
      endAdornment,
      size = "lg", // default aligns with existing HeaderSearch (h-11)
      type = "text",
      ...props
    },
    ref,
  ) => {
    const sz = sizes[size];

    // Default horizontal padding matches Button:
    // sm px-3, md px-4, lg px-5
    // For adorned inputs, we reserve space for slots (start/end).
    const pad =
      startAdornment || endAdornment
        ? cn(
            startAdornment ? "pl-10" : size === "sm" ? "pl-3" : size === "md" ? "pl-4" : "pl-5",
            endAdornment ? "pr-12" : size === "sm" ? "pr-3" : size === "md" ? "pr-4" : "pr-5",
          )
        : cn(size === "sm" ? "px-3" : size === "md" ? "px-4" : "px-5");

    const inputEl = (
      <input
        ref={ref}
        type={type}
        className={cn(base, sz.input, pad, className)}
        {...props}
      />
    );

    if (!startAdornment && !endAdornment) return inputEl;

    return (
      <div className={cn("relative", wrapperClassName)}>
        {startAdornment ? (
          <div
            className={cn(
              "pointer-events-none absolute left-0 top-0 flex items-center justify-center",
              "text-muted-foreground",
              sz.startSlot,
            )}
          >
            {startAdornment}
          </div>
        ) : null}

        {inputEl}

        {endAdornment ? (
          <div
            className={cn(
              "absolute right-0 top-0 flex items-center justify-center",
              "text-muted-foreground",
              sz.endSlot,
            )}
          >
            {endAdornment}
          </div>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
