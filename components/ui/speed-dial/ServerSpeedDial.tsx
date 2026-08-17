// src/components/ui/speed-dial/ServerSpeedDial.tsx
"use client";

import { useRouter } from "next/navigation";
import { SpeedDial, type SpeedDialAction } from "./SpeedDial";
import { PlusCircleIcon } from "../../../icons";

export type ServerSpeedDialAction = Omit<SpeedDialAction, "onClick"> & {
  href?: string;
  onClick?: () => void;
};

export function ServerSpeedDial({
  actions,
  triggerLabel = "Quick Actions",
  size = "md" as const,
}: {
  actions: ServerSpeedDialAction[];
  triggerLabel?: string;
  size?: "sm" | "md" | "lg";
}) {
  const router = useRouter();

  const clientActions: SpeedDialAction[] = actions.map((action) => ({
    ...action,
    onClick: action.onClick || (action.href ? () => router.push(action.href!) : () => {}),
  }));

  return (
    <SpeedDial
      triggerLabel={triggerLabel}
      triggerIcon={<PlusCircleIcon className="h-5 w-5" />}
      size={size}
      variant="sticky"
      actions={clientActions}
    />
  );
}
