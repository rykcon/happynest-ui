// src/components/form/SelectMenu.tsx
"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { cn } from "../../lib/utils";

type Option = { value: string; label: string; disabled?: boolean };

export function SelectMenu(props: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  allowClear?: boolean; // default true
  clearLabel?: string;  // default "—"
  className?: string;
}) {
  const {
    value,
    onChange,
    options,
    placeholder = "Select…",
    allowClear = true,
    clearLabel = "—",
    className,
  } = props;

  const CLEAR = "__clear__";

  // Radix: use undefined (not "") to show placeholder
  const radixValue = value === "" ? undefined : value;

  const normalized = React.useMemo(() => {
    const out: Option[] = [];
    if (allowClear) out.push({ value: CLEAR, label: clearLabel });

    for (const o of options ?? []) {
      // Never allow empty string as an item value
      if (!o || o.value === "") continue;
      out.push(o);
    }
    return out;
  }, [options, allowClear, clearLabel]);

  return (
    <Select.Root
      value={radixValue}
      onValueChange={(v) => onChange(v === CLEAR ? "" : v)}
    >
      <Select.Trigger
        className={cn(
          "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
          "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
          className,
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-2 opacity-70">▾</Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="z-[200] overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          <Select.Viewport className="p-1">
            {normalized.map((o) => (
              <Select.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm",
                  "text-foreground outline-none",
                  "data-[highlighted]:bg-muted data-[disabled]:opacity-50",
                )}
              >
                <Select.ItemText>{o.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}