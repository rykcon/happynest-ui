"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"

type TableProps = React.ComponentProps<"table"> & {
  dense?: boolean
  striped?: boolean
  hoverable?: boolean
  fitContent?: boolean
}

function Table({
  className,
  dense,
  striped,
  hoverable,
  fitContent,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm",
          dense ? "[&_td]:py-1.5 [&_th]:h-8" : "",
          striped ? "[&_tbody_tr:nth-child(even)]:bg-muted/30" : "",
          hoverable ? "[&_tbody_tr:hover]:bg-muted/50" : "",
          fitContent ? "w-max" : "",
          className
        )}
        {...props}
      />
    </div>
  )
}

type TableHeaderProps = React.ComponentProps<"thead"> & {
  sticky?: boolean
}

function TableHeader({ className, sticky, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr:hover]:bg-transparent",
        sticky ? "sticky top-0 z-10 bg-background" : "",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

type TableRowProps = React.ComponentProps<"tr"> & {
  clickable?: boolean
  selected?: boolean
}

function TableRow({ className, clickable = false, selected = false, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-selected={selected ? "true" : undefined}
      className={cn(
        "group/table-row border-b hover:bg-muted data-[state=selected]:bg-muted data-[selected=true]:bg-muted",
        clickable ? "cursor-pointer" : "",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

type TableCellTone = "default" | "muted" | "strong"
type TableCellAlign = "left" | "center" | "right"
type TableCellProps = React.ComponentProps<"td"> & {
  isHeader?: boolean
  align?: TableCellAlign
  tone?: TableCellTone
  sticky?: boolean
  stickySide?: "left" | "right"
}

function TableCell({
  className,
  isHeader = false,
  align = "left",
  tone = "default",
  sticky = false,
  stickySide = "left",
  ...props
}: TableCellProps) {
  const Comp: any = isHeader ? "th" : "td"
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"
  const toneClass =
    tone === "strong"
      ? "text-foreground font-semibold"
      : tone === "muted"
        ? "text-muted-foreground"
        : ""
  const stickyClass = sticky
    ? cn(
        "sticky",
        stickySide === "left" ? "left-0" : "right-0",
        isHeader ? "z-40" : "z-30",
        isHeader ? "" : "group-hover/table-row:bg-muted group-data-[selected=true]/table-row:bg-muted"
      )
    : ""

  return (
    <Comp
      data-slot={isHeader ? "table-head" : "table-cell"}
      className={cn(
        isHeader
          ? "h-10 px-2 align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0"
          : "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        alignClass,
        toneClass,
        stickyClass,
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
