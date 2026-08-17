// src/components/ui/alerts/AlertProvider.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import { onAlertRequest, type AlertPayload } from "./alert";

type AlertState = AlertPayload & {
  id: number;
  kind: "alert" | "confirm";
  resolve: (value: boolean) => void;
};

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = React.useState<AlertState | null>(null);

  React.useEffect(() => {
    return onAlertRequest((req) => {
      setAlert(req);
    });
  }, []);

  function close(result: boolean) {
    if (alert) {
      alert.resolve(result);
    }
    setAlert(null);
  }

  return (
    <>
      {children}
      <Dialog open={!!alert} onOpenChange={(open) => (!open ? close(false) : null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{alert?.title ?? "Please confirm"}</DialogTitle>
            <DialogDescription>{alert?.message ?? ""}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {alert?.kind === "confirm" ? (
              <Button variant="outline" onClick={() => close(false)}>
                {alert?.cancelLabel ?? "Cancel"}
              </Button>
            ) : null}
            <Button
              variant={alert?.tone === "danger" ? "destructive" : "default"}
              onClick={() => close(true)}
            >
              {alert?.confirmLabel ?? "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
