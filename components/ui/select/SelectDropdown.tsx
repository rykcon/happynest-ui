"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/ui/select";
import { cn } from "../../../lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  sublabel?: string | null;
  disabled?: boolean;
};

export interface SelectDropdownProps {
  value: string;
  onChange: (next: string) => void;
  options: SelectOption[];

  placeholder?: string;
  disabled?: boolean;

  /** Optional UI/UX */
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;

  /** Token-friendly sizing */
  size?: "sm" | "md";

  className?: string;
  menuClassName?: string;
  buttonClassName?: string;
}

const CLEAR_VALUE = "__clear__";

export function SelectDropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
  searchable = false,
  searchPlaceholder = "Search…",
  clearable = false,
  size = "md",
  className,
  menuClassName,
  buttonClassName,
}: SelectDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const hasEmptyOption = options.some((opt) => opt.value === "");
  const internalValue =
    value === "" && hasEmptyOption ? "__empty__" : value || undefined;
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const needle = query.trim().toLowerCase();
    return options.filter((opt) => {
      const hay = `${opt.label} ${opt.sublabel ?? ""} ${opt.value}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [options, query, searchable]);

  return (
    <div className={cn("w-full", className)}>
      <Select
        value={internalValue}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
        onValueChange={(next) => {
          if (next === CLEAR_VALUE) {
            onChange("");
            return;
          }
          if (next === "__empty__") {
            onChange("");
            return;
          }
          onChange(next);
        }}
        disabled={disabled}
      >
        <SelectTrigger size={size === "sm" ? "sm" : "default"} className={cn("w-full", buttonClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={menuClassName}>
          {searchable ? (
            <div className="p-2">
              <input
                value={query ?? ""}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(event) => event.stopPropagation()}
              />
            </div>
          ) : null}
          {clearable ? (
            <SelectItem value={CLEAR_VALUE}>Clear selection</SelectItem>
          ) : null}
          {filteredOptions.length ? (
            filteredOptions.map((opt) => {
            const mappedValue = opt.value === "" ? "__empty__" : opt.value;
            return (
              <SelectItem key={`${opt.value || "empty"}-${opt.label}`} value={mappedValue} disabled={opt.disabled}>
              <span className="flex flex-col">
                <span>{opt.label}</span>
                {opt.sublabel ? (
                  <span className="text-xs text-muted-foreground">{opt.sublabel}</span>
                ) : null}
              </span>
              </SelectItem>
            );
          })
          ) : (
            <div className="px-2 py-2 text-sm text-muted-foreground">No options found.</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectDropdown;
