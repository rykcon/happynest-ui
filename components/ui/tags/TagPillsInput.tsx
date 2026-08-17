// src/components/ui/tags/TagPillsInput.tsx
"use client";

import * as React from "react";
import { Badge } from "../../shadcn/ui/badge";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { cn } from "../../../lib/utils";


function normalizeTag(v: string) {
  return v
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^#/, "")
    .toLowerCase();
}

export function TagPillsInput(props: {
  label?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  disabled?: boolean;
}) {
  const [input, setInput] = React.useState("");

  const tags = Array.from(
    new Set((props.value ?? []).map((t) => normalizeTag(t)).filter(Boolean)),
  );

  function add(raw: string) {
    const t = normalizeTag(raw);
    if (!t) return;
    if (tags.includes(t)) return;
    props.onChange([...tags, t]);
    setInput("");
  }

  function remove(tag: string) {
    props.onChange(tags.filter((t) => t !== tag));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (props.disabled) return;

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
      return;
    }
    if (e.key === "Backspace" && !input && tags.length) {
      e.preventDefault();
      remove(tags[tags.length - 1]);
      return;
    }
  }

  const sugg = (props.suggestions ?? []).filter((s) => {
    const n = normalizeTag(s);
    return n && !tags.includes(n) && n.includes(normalizeTag(input));
  });

  return (
    <div className="space-y-2">
      {props.label ? (
        <Label className="text-xs font-semibold text-muted-foreground">{props.label}</Label>
      ) : null}

      <div
        className={cn(
          "rounded-xl border border-border bg-card px-2 py-2",
          props.disabled ? "opacity-60" : "",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-sm text-foreground"
            >
              <span className="max-w-[220px] truncate">{t}</span>
              <button
                type="button"
                aria-label={`Remove ${t}`}
                className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => remove(t)}
                disabled={props.disabled}
              >
                ×
              </button>
            </span>
          ))}

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={props.placeholder ?? "Type a tag and press Enter…"}
            disabled={props.disabled}
            className="h-9 min-w-[180px] flex-1 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => add(input)}
            disabled={props.disabled || !normalizeTag(input)}
          >
            Add
          </Button>
        </div>

        {input && sugg.length ? (
          <div className="mt-2 flex flex-wrap gap-2 px-1">
            {sugg.slice(0, 8).map((s) => {
              const n = normalizeTag(s);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => add(n)}
                  disabled={props.disabled}
                  className="rounded-full"
                >
                  <Badge variant="secondary" className="rounded-full">
                    {n}
                  </Badge>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
