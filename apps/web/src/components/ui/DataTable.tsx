import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  getRowHoverClass?: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  getRowHoverClass,
  emptyMessage = "No results found.",
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-sm text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto overscroll-x-contain", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-6 py-3 text-xs font-semibold tracking-wide text-subtle uppercase",
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={keyExtractor(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-border-subtle transition-colors duration-150",
                rowIndex % 2 === 0 ? "bg-surface-1/45" : "bg-transparent",
                onRowClick &&
                  cn(
                    "cursor-pointer",
                    getRowHoverClass?.(row) ??
                      "hover:border-accent/20 hover:bg-accent-subtle/40",
                  ),
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn("px-6 py-3.5 text-foreground", column.className)}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
