// src/components/ui/table/sort.ts
"use client";

import { useMemo, useState } from "react";

export type SortDir = "asc" | "desc";
export type SortState<K extends string> = { key: K; dir: SortDir } | null;
export type SortEntry<K extends string> = { key: K; dir: SortDir };
export type SortStateMulti<K extends string> = SortEntry<K>[];

export function nextSort<K extends string>(curr: SortState<K>, key: K): SortState<K> {
  if (!curr || curr.key !== key) return { key, dir: "asc" };
  if (curr.dir === "asc") return { key, dir: "desc" };
  return null; // third click clears sort
}

export function nextSortMulti<K extends string>(curr: SortStateMulti<K>, key: K): SortStateMulti<K> {
  const idx = curr.findIndex((s) => s.key === key);
  if (idx === -1) return [...curr, { key, dir: "asc" }];
  const entry = curr[idx];
  if (entry.dir === "asc") {
    const next = [...curr];
    next[idx] = { ...entry, dir: "desc" };
    return next;
  }
  // third click clears sort
  return curr.filter((s) => s.key !== key);
}

export function moveSort<K extends string>(curr: SortStateMulti<K>, from: number, to: number): SortStateMulti<K> {
  if (from === to) return curr;
  const next = [...curr];
  const [item] = next.splice(from, 1);
  if (!item) return curr;
  next.splice(to, 0, item);
  return next;
}

export function normalizeSort<K extends string>(sort: SortState<K> | SortStateMulti<K>): SortStateMulti<K> {
  if (!sort) return [];
  if (Array.isArray(sort)) return sort;
  return [sort];
}

function cmp(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === "number" && typeof b === "number") return a - b;

  if (typeof a === "string" && typeof b === "string") {
    const ad = Date.parse(a);
    const bd = Date.parse(b);
    const aIsDate = !Number.isNaN(ad);
    const bIsDate = !Number.isNaN(bd);
    if (aIsDate && bIsDate) return ad - bd;
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function useSortedRows<T, K extends string>(
  rows: T[],
  sort: SortState<K> | SortStateMulti<K>,
  accessors: Record<K, (row: T) => unknown>,
) {
  return useMemo(() => {
    const sorts = normalizeSort(sort);
    if (!sorts.length) return rows;

    const sorted = [...rows].sort((ra, rb) => {
      for (const { key, dir } of sorts) {
        const get = accessors[key];
        const res = cmp(get(ra), get(rb));
        if (res !== 0) return dir === "asc" ? res : -res;
      }
      return 0;
    });

    return sorted;
  }, [rows, sort, accessors]);
}

export function useSortState<K extends string>(initial: SortState<K> = null) {
  const [sort, setSort] = useState<SortState<K>>(initial);
  return { sort, setSort };
}

export function useSortStateMulti<K extends string>(initial: SortStateMulti<K> = []) {
  const [sort, setSort] = useState<SortStateMulti<K>>(initial);
  return { sort, setSort };
}
