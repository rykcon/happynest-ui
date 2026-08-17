"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../shadcn/ui/table";

export type DataTableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
}: {
  columns: ReadonlyArray<DataTableColumn<T>>;
  data: ReadonlyArray<T>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={String(col.key)} className="font-semibold text-muted-foreground">
              {col.header}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col) => (
              <TableCell key={String(col.key)}>
                {col.render ? col.render(row) : String(row[col.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
