// src/components/ui/toggle/ToggleSwitch.tsx
"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import { Label } from "../label";
import { Switch } from "../switch";

export function ToggleSwitch(props: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { checked, onChange, label, disabled, className } = props;
  const switchId = React.useId();

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Switch
        id={switchId}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={label ?? "Toggle"}
      />
      {label ? (
        <Label
          htmlFor={switchId}
          className={cn("cursor-pointer", disabled ? "text-muted-foreground" : "text-foreground")}
        >
          {label}
        </Label>
      ) : null}
    </div>
  );
}
