// src/components/ui/table/columns.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type TableColumnDef<K extends string> = {
  key: K;
  label: string;
  defaultVisible?: boolean;
  locked?: boolean;
};

type ColumnState<K extends string> = {
  order: K[];
  hidden: Set<K>;
};

function syncOrder<K extends string>(current: K[], nextKeys: K[]) {
  const next = current.filter((k) => nextKeys.includes(k));
  const missing = nextKeys.filter((k) => !next.includes(k));
  return [...next, ...missing];
}

export function useTableColumns<K extends string>(
  columns: TableColumnDef<K>[],
  opts?: { storageKey?: string },
) {
  const keys = useMemo(() => columns.map((c) => c.key), [columns]);

  // Always use defaults for initial state to avoid hydration mismatch
  const [state, setState] = useState<ColumnState<K>>(() => ({
    order: keys,
    hidden: new Set(columns.filter((c) => c.defaultVisible === false).map((c) => c.key)),
  }));

  // Load from localStorage after mount (client-only)
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    if (!opts?.storageKey || isHydrated) return;

    try {
      const raw = window.localStorage.getItem(opts.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { order?: K[]; hidden?: K[] };
        const order = Array.isArray(parsed.order) ? parsed.order.filter((k) => keys.includes(k)) : keys;
        const hidden = new Set(
          Array.isArray(parsed.hidden)
            ? parsed.hidden.filter((k) => keys.includes(k))
            : columns.filter((c) => c.defaultVisible === false).map((c) => c.key),
        );
        setState({ order, hidden });
      }
    } catch {}

    setIsHydrated(true);
  }, [opts?.storageKey, isHydrated, keys, columns]);

  const colMap = useMemo(() => {
    const map = new Map<K, TableColumnDef<K>>();
    for (const col of columns) map.set(col.key, col);
    return map;
  }, [columns]);

  const order = useMemo(() => syncOrder(state.order, keys), [state.order, keys]);

  const hidden = state.hidden;

  const isVisible = useCallback((key: K) => !hidden.has(key), [hidden]);

  const visibleKeys = useMemo(() => order.filter((k) => !hidden.has(k)), [order, hidden]);

  const toggleColumn = useCallback(
    (key: K) => {
      const col = colMap.get(key);
      if (col?.locked) return;
      setState((curr) => {
        const nextHidden = new Set(curr.hidden);
        if (nextHidden.has(key)) nextHidden.delete(key);
        else nextHidden.add(key);
        return { ...curr, hidden: nextHidden };
      });
    },
    [colMap],
  );

  const moveColumn = useCallback((key: K, dir: "up" | "down") => {
    setState((curr) => {
      const idx = curr.order.indexOf(key);
      if (idx === -1) return curr;
      const next = [...curr.order];
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return curr;
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return { ...curr, order: next };
    });
  }, []);

  const moveColumnTo = useCallback((key: K, toIndex: number) => {
    setState((curr) => {
      const fromIdx = curr.order.indexOf(key);
      if (fromIdx === -1) return curr;
      const next = [...curr.order];
      const target = Math.max(0, Math.min(toIndex, next.length - 1));
      if (fromIdx === target) return curr;
      const [item] = next.splice(fromIdx, 1);
      next.splice(target, 0, item);
      return { ...curr, order: next };
    });
  }, []);

  const resetColumns = useCallback(() => {
    setState({
      order: keys,
      hidden: new Set(columns.filter((c) => c.defaultVisible === false).map((c) => c.key)),
    });
  }, [columns, keys]);

  // persist
  useEffect(() => {
    if (!opts?.storageKey || typeof window === "undefined") return;
    try {
      const payload = JSON.stringify({
        order: state.order,
        hidden: Array.from(state.hidden),
      });
      window.localStorage.setItem(opts.storageKey, payload);
    } catch {}
  }, [opts?.storageKey, state.order, state.hidden]);

  return {
    columns,
    order,
    visibleKeys,
    isVisible,
    toggleColumn,
    moveColumn,
    moveColumnTo,
    resetColumns,
  };
}
