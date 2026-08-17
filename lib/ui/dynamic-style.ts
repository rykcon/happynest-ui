import type { CSSProperties } from "react";

type HnVarName = `--${string}`;
type HnVarValue = string | number | null | undefined;

/**
 * Typed helper for inline CSS variable maps used by dynamic UI layout.
 * Keep dynamic DOM style usage constrained to this helper.
 */
export function hnVars<T extends HnVarName>(
  vars: Partial<Record<T, HnVarValue>>,
): CSSProperties {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (typeof value !== "string" && typeof value !== "number") continue;
    out[key] = value;
  }
  return out as CSSProperties;
}
