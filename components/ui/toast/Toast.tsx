// src/components/ui/toast/Toast.tsx
"use client";

import { CloseIcon } from "../../../icons";

export type ToastTone = "info" | "success" | "error";

export type ToastProps = {
  title: string;
  description?: string;
  tone?: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
};

export function Toast(props: ToastProps) {
  const tone = props.tone ?? "info";
  const toneStyles =
    tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900"
      : tone === "error"
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : "border-border/60 bg-background text-foreground";

  return (
    <div
      data-testid="toast"
      className={`flex items-start gap-3 rounded-lg border px-3 py-2 shadow-theme-md ${toneStyles}`}
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{props.title}</div>
        {props.description ? (
          <div className="mt-1 text-xs text-foreground/70">{props.description}</div>
        ) : null}
        {props.actionLabel ? (
          <button
            type="button"
            className="mt-2 inline-flex rounded-md border border-border/60 px-2 py-0.5 text-[11px] text-foreground/80 hover:bg-muted"
            onClick={props.onAction}
          >
            {props.actionLabel}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        className="rounded-md border border-border/60 p-1 text-foreground/60 hover:text-foreground"
        onClick={props.onClose}
        aria-label="Dismiss"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
