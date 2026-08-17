// src/components/ui/alerts/alert.tsx
"use client";

export type AlertPayload = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
};

type AlertRequest = AlertPayload & {
  id: number;
  kind: "alert" | "confirm";
  resolve: (value: boolean) => void;
};

type Listener = (req: AlertRequest) => void;

const listeners = new Set<Listener>();
let seq = 1;

function emit(req: AlertRequest) {
  for (const l of listeners) l(req);
}

export function onAlertRequest(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function showAlert(payload: AlertPayload) {
  return new Promise<void>((resolve) => {
    emit({
      id: seq++,
      kind: "alert",
      resolve: () => resolve(),
      ...payload,
    });
  });
}

export function showConfirm(payload: AlertPayload) {
  return new Promise<boolean>((resolve) => {
    emit({
      id: seq++,
      kind: "confirm",
      resolve,
      ...payload,
    });
  });
}
