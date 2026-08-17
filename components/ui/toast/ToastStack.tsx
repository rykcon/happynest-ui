// src/components/ui/toast/ToastStack.tsx
"use client";

import { Toaster } from "sonner";

export function ToastStack(_props: {
  toasts: unknown[];
  onDismiss: (id: string) => void;
  className?: string;
}) {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "border border-border bg-background text-foreground shadow-theme-md",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-foreground",
        },
      }}
    />
  );
}
