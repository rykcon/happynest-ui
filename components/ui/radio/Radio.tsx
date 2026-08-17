// src/components/ui/radio/Radio.tsx
"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";

export function Radio(props: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const { id, name, value, checked, onChange, label, disabled, className } = props;

  return (
    <div className={cn("inline-flex items-center gap-2 whitespace-nowrap", className)}>
      <RadioGroup
        name={name}
        value={checked ? value : ""}
        onValueChange={onChange}
        className="gap-0"
      >
        <RadioGroupItem id={id} value={value} disabled={disabled} />
      </RadioGroup>
      <Label
        htmlFor={id}
        className={cn(
          "cursor-pointer text-sm font-medium whitespace-nowrap",
          disabled ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {label}
      </Label>
    </div>
  );
}
