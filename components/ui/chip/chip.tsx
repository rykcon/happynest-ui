// src/components/ui/chips/chips.tsx
import { Badge } from "../../shadcn/ui/badge";
import { cn } from "../../../lib/utils";

export function Chip(props: { label: string; value?: string | null; className?: string }) {
  const v = props.value ?? "";
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full px-3 py-1 text-xs", props.className)}
      title={v || undefined}
    >
      {props.label}
      {v && v !== "Yes" ? <span className="ml-2 text-muted-foreground">({v})</span> : null}
    </Badge>
  );
}
