"use client";

import * as React from "react";

import { Textarea as BaseTextarea } from "../../ui/textarea";
import { cn } from "../../../lib/utils";

type TextareaProps = React.ComponentProps<typeof BaseTextarea> & {
  hint?: React.ReactNode;
  error?: boolean;
  success?: boolean;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hint, error, success, ...props }, ref) => {
    const tone = error
      ? "border-destructive focus-visible:ring-destructive/20"
      : success
        ? "border-success-500 focus-visible:ring-success-500/20"
        : "";

    return (
      <div className="space-y-1.5">
        <BaseTextarea
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
Textarea.displayName = "Textarea";

export { Textarea };
