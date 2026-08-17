"use client";

import * as React from "react";

import { Input as BaseInput, type InputProps, type InputSize } from "../../ui/input";
import { cn } from "../../../lib/utils";

type ShadcnInputProps = InputProps & {
  hint?: React.ReactNode;
  error?: boolean;
  success?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, ShadcnInputProps>(
  ({ className, hint, error, success, ...props }, ref) => {
    const tone = error
      ? "border-destructive focus-visible:ring-destructive/20"
      : success
        ? "border-success-500 focus-visible:ring-success-500/20"
        : "";

    return (
      <div className="space-y-1.5">
        <BaseInput
          ref={ref}
          aria-invalid={error || undefined}
          className={cn(tone, className)}
          {...props}
        />
        {hint ? (
          <div className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {hint}
          </div>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
export type { InputProps, InputSize };
