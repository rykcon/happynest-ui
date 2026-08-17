// src/components/ui/table/table-menus.tsx
"use client";

import * as React from "react";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../shadcn/ui/dropdown-menu";
import { ChevronDownIcon, ChevronUpIcon, CloseLineIcon, MenuDots, SliderIcon, TableIcon } from "../../../icons";
import { moveSort } from "./sort";
import type { SortStateMulti } from "./sort";
import type { TableColumnDef } from "./columns";
import { cn } from "../../../lib/utils";


export type SortOption<K extends string> = {
  key: K;
  label: string;
};

export function TableSortMenu<K extends string>({
  sort,
  onChange,
  options,
  label = "Sort",
  className,
}: {
  sort: SortStateMulti<K>;
  onChange: (next: SortStateMulti<K>) => void;
  options: SortOption<K>[];
  label?: string;
  className?: string;
}) {
  const dragKeyRef = React.useRef<K | null>(null);
  const dragFromRef = React.useRef<"active" | "inactive" | null>(null);

  const optionMap = React.useMemo(() => {
    const map = new Map<K, SortOption<K>>();
    for (const opt of options) map.set(opt.key, opt);
    return map;
  }, [options]);

  const addSort = (key: K) => {
    if (sort.some((s) => s.key === key)) return;
    onChange([...sort, { key, dir: "asc" }]);
  };

  const toggleDir = (key: K) => {
    onChange(sort.map((s) => (s.key === key ? { ...s, dir: s.dir === "asc" ? "desc" : "asc" } : s)));
  };

  const removeSort = (key: K) => {
    onChange(sort.filter((s) => s.key !== key));
  };

  const clearAll = () => onChange([]);

  const available = options.filter((opt) => !sort.some((s) => s.key === opt.key));

  const ensureActiveDrop = (fromKey: K, toIdx: number | null) => {
    if (sort.some((s) => s.key === fromKey)) {
      const fromIdx = sort.findIndex((s) => s.key === fromKey);
      if (fromIdx === -1) return;
      const target = toIdx == null ? sort.length - 1 : toIdx;
      if (fromIdx === target) return;
      onChange(moveSort(sort, fromIdx, target));
      return;
    }
    const next = [...sort];
    const insertAt = toIdx == null ? next.length : Math.max(0, Math.min(toIdx, next.length));
    next.splice(insertAt, 0, { key: fromKey, dir: "asc" });
    onChange(next);
  };

  const ensureInactiveDrop = (fromKey: K) => {
    if (!sort.some((s) => s.key === fromKey)) return;
    onChange(sort.filter((s) => s.key !== fromKey));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          <SliderIcon className="h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
      <div className="px-2 py-2">
        <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Active Sorts
        </div>
        <div
          className="flex flex-col gap-1"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const fromKey = dragKeyRef.current ?? (e.dataTransfer.getData("text/plain") as K);
            if (!fromKey) return;
            ensureActiveDrop(fromKey, null);
            dragKeyRef.current = null;
            dragFromRef.current = null;
          }}
        >
          {sort.length ? (
            sort.map((s, idx) => (
              <div
                key={s.key}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2 py-1.5 text-sm"
                draggable={false}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromKey = dragKeyRef.current ?? (e.dataTransfer.getData("text/plain") as K);
                  if (!fromKey) return;
                  ensureActiveDrop(fromKey, idx);
                  dragKeyRef.current = null;
                  dragFromRef.current = null;
                }}
              >
                <span
                  className="text-muted-foreground cursor-grab"
                  draggable
                  onDragStart={(e) => {
                    dragKeyRef.current = s.key;
                    dragFromRef.current = "active";
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(s.key));
                  }}
                  onDragEnd={() => {
                    dragKeyRef.current = null;
                    dragFromRef.current = null;
                  }}
                >
                  <MenuDots className="h-4 w-4" />
                </span>
                <span className="flex-1 truncate text-xs font-medium text-foreground">
                  {optionMap.get(s.key)?.label ?? s.key}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleDir(s.key)}
                  aria-label={`Toggle ${s.key} direction`}
                >
                  {s.dir === "asc" ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeSort(s.key)}
                  aria-label={`Remove ${s.key}`}
                >
                  <CloseLineIcon className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 px-2 py-2 text-xs text-muted-foreground">
              Drag a sort here.
            </div>
          )}
        </div>

        <div className="mt-3 px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add Sort</div>
        <div
          className="flex flex-col gap-1 px-2 pb-1"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const fromKey = dragKeyRef.current ?? (e.dataTransfer.getData("text/plain") as K);
            if (!fromKey) return;
            ensureInactiveDrop(fromKey);
            dragKeyRef.current = null;
            dragFromRef.current = null;
          }}
        >
          {available.length ? (
            available.map((opt) => (
              <div
                key={opt.key}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/40"
                draggable={false}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromKey = dragKeyRef.current ?? (e.dataTransfer.getData("text/plain") as K);
                  if (!fromKey) return;
                  if (sort.some((s) => s.key === fromKey)) ensureInactiveDrop(fromKey);
                  else ensureActiveDrop(fromKey, sort.length);
                  dragKeyRef.current = null;
                  dragFromRef.current = null;
                }}
                onClick={() => addSort(opt.key)}
              >
                <span
                  className="text-muted-foreground cursor-grab"
                  draggable
                  onDragStart={(e) => {
                    dragKeyRef.current = opt.key;
                    dragFromRef.current = "inactive";
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(opt.key));
                  }}
                  onDragEnd={() => {
                    dragKeyRef.current = null;
                    dragFromRef.current = null;
                  }}
                >
                  <MenuDots className="h-4 w-4" />
                </span>
                <span className="flex-1 truncate text-xs font-medium">{opt.label}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">All available sorts added.</span>
          )}
        </div>

        {sort.length ? (
          <div className="mt-2 flex justify-end px-2">
            <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        ) : null}
      </div>
    </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TableColumnMenu<K extends string>({
  columns,
  isVisible,
  toggleColumn,
  moveColumn,
  moveColumnTo,
  resetColumns,
  label = "Columns",
  className,
}: {
  columns: TableColumnDef<K>[];
  isVisible: (key: K) => boolean;
  toggleColumn: (key: K) => void;
  moveColumn: (key: K, dir: "up" | "down") => void;
  moveColumnTo?: (key: K, index: number) => void;
  resetColumns: () => void;
  label?: string;
  className?: string;
}) {
  const dragKeyRef = React.useRef<K | null>(null);
  const dragFromRef = React.useRef<"visible" | "hidden" | null>(null);

  const visibleCols = columns.filter((c) => isVisible(c.key));
  const hiddenCols = columns.filter((c) => !isVisible(c.key));

  const ensureVisibleDrop = (fromKey: K, toIdx: number | null) => {
    if (!isVisible(fromKey)) toggleColumn(fromKey);
    const fromIdx = columns.findIndex((c) => c.key === fromKey);
    const visibleOrder = visibleCols.map((c) => c.key);
    const currentIdx = visibleOrder.indexOf(fromKey);
    const target = toIdx == null ? visibleOrder.length - 1 : Math.max(0, Math.min(toIdx, visibleOrder.length - 1));
    if (currentIdx === -1 || currentIdx === target) return;
    if (moveColumnTo) moveColumnTo(fromKey, target);
    else if (currentIdx < target) {
      for (let i = currentIdx; i < target; i += 1) moveColumn(fromKey, "down");
    } else {
      for (let i = currentIdx; i > target; i -= 1) moveColumn(fromKey, "up");
    }
  };

  const ensureHiddenDrop = (fromKey: K) => {
    if (isVisible(fromKey)) toggleColumn(fromKey);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          <TableIcon className="h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
      <div className="px-2 py-2">
        <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Visible</div>
        <div
          className="flex flex-col gap-1"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const fromKey = dragKeyRef.current ?? (e.dataTransfer.getData("text/plain") as K);
            if (!fromKey) return;
            ensureVisibleDrop(fromKey, null);
            dragKeyRef.current = null;
            dragFromRef.current = null;
          }}
        >
          {visibleCols.length ? (
            visibleCols.map((col, idx) => (
              <div
                key={col.key}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2 py-1.5",
                  !col.locked ? "hover:bg-muted/40" : "",
                )}
                draggable={false}
                onDragOver={(e) => {
                  if (col.locked) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  if (col.locked) return;
                  e.preventDefault();
                  const fromKey = dragKeyRef.current ?? (e.dataTransfer.getData("text/plain") as K);
                  if (!fromKey || fromKey === col.key) return;
                  ensureVisibleDrop(fromKey, idx);
                  dragKeyRef.current = null;
                  dragFromRef.current = null;
                }}
              >
                <span
                  className="text-muted-foreground cursor-grab"
                  draggable={!col.locked}
                  onDragStart={(e) => {
                    if (col.locked) return;
                    dragKeyRef.current = col.key;
                    dragFromRef.current = "visible";
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(col.key));
                  }}
                  onDragEnd={() => {
                    dragKeyRef.current = null;
                    dragFromRef.current = null;
                  }}
                >
                  <MenuDots className="h-4 w-4" />
                </span>
                <Checkbox
                  checked
                  onCheckedChange={() => toggleColumn(col.key)}
                  disabled={col.locked}
                />
                <span className="flex-1 truncate text-xs font-medium text-foreground">{col.label}</span>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/10 px-2 py-2 text-xs text-muted-foreground">
              Drag columns here.
            </div>
          )}
        </div>

        <div className="mt-3 px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hidden</div>
        <div
          className="flex flex-col gap-1"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const fromKey = dragKeyRef.current ?? (e.dataTransfer.getData("text/plain") as K);
            if (!fromKey) return;
            ensureHiddenDrop(fromKey);
            dragKeyRef.current = null;
            dragFromRef.current = null;
          }}
        >
          {hiddenCols.length ? (
            hiddenCols.map((col) => (
              <div
                key={col.key}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/10 px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted/40"
                draggable={false}
                onDragOver={(e) => {
                  if (col.locked) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  if (col.locked) return;
                  e.preventDefault();
                  const fromKey = dragKeyRef.current ?? (e.dataTransfer.getData("text/plain") as K);
                  if (!fromKey || fromKey === col.key) return;
                  if (isVisible(fromKey)) ensureHiddenDrop(fromKey);
                  else ensureVisibleDrop(fromKey, visibleCols.length);
                  dragKeyRef.current = null;
                  dragFromRef.current = null;
                }}
                onClick={() => toggleColumn(col.key)}
              >
                <span
                  className="text-muted-foreground cursor-grab"
                  draggable={!col.locked}
                  onDragStart={(e) => {
                    if (col.locked) return;
                    dragKeyRef.current = col.key;
                    dragFromRef.current = "hidden";
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(col.key));
                  }}
                  onDragEnd={() => {
                    dragKeyRef.current = null;
                    dragFromRef.current = null;
                  }}
                >
                  <MenuDots className="h-4 w-4" />
                </span>
                <Checkbox checked={false} onCheckedChange={() => toggleColumn(col.key)} disabled={col.locked} />
                <span className="flex-1 truncate text-xs font-medium">{col.label}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">All columns visible.</span>
          )}
        </div>
        <div className="mt-2 flex justify-end px-2">
          <Button type="button" variant="ghost" size="sm" onClick={resetColumns}>
            Reset
          </Button>
        </div>
      </div>
    </DropdownMenuContent>
    </DropdownMenu>
  );
}
