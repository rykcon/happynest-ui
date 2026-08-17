// src/components/ui/toast/useToastQueue.ts
"use client";

import { useCallback, useMemo } from "react";
import { toast as sonnerToast } from "sonner";
import type { ToastProps } from "./Toast";

export function useToastQueue() {
  const dismiss = useCallback((id: string) => {
    sonnerToast.dismiss(id);
  }, []);

  const show = useCallback((toast: ToastProps & { timeoutMs?: number }) => {
    const base = {
      description: toast.description,
      duration: toast.timeoutMs ?? 6000,
      action: toast.actionLabel
        ? {
            label: toast.actionLabel,
            onClick: () => toast.onAction?.(),
          }
        : undefined,
    };

    const id =
      toast.tone === "success"
        ? sonnerToast.success(toast.title, base)
        : toast.tone === "error"
          ? sonnerToast.error(toast.title, base)
          : sonnerToast(toast.title, base);

    return String(id);
  }, []);

  const addToast = useCallback(
    (toast: ToastProps & { timeoutMs?: number }) => show(toast),
    [show]
  );

  const success = useCallback(
    (title: string, description?: string) =>
      show({ title, description, tone: "success" }),
    [show]
  );

  const error = useCallback(
    (title: string, description?: string) =>
      show({ title, description, tone: "error" }),
    [show]
  );

  const info = useCallback(
    (title: string, description?: string) =>
      show({ title, description, tone: "info" }),
    [show]
  );

  return useMemo(
    () => ({ toasts: [], show, addToast, success, error, info, dismiss }),
    [show, addToast, success, error, info, dismiss]
  );
}
