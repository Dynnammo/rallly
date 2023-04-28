import { ChevronDownIcon, ChevronRightIcon } from "@rallly/icons";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";

export const DatesTable = <
  T extends { start: Date },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends ColumnDef<T, any>,
>(props: {
  columns: C[];
  data: T[];
  footer?: React.ReactNode;
  enableTableFooter?: boolean;
  layout?: "fixed" | "auto";
  className?: string;
}) => {
  const table = useReactTable<T>({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    // pagination
    initialState: {
      grouping: ["group"],
      columnVisibility: { group: false },
      expanded: true,
    },
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className={props.className}>
      <table
        className={clsx(
          "border-collapse bg-white",
          props.layout === "auto" ? "w-full table-auto" : "table-fixed",
        )}
      >
        <tbody>
          {table.getRowModel().rows.map((row, i) => {
            if (row.getIsGrouped()) {
              return (
                <tr key={row.id}>
                  <th
                    className="whitespace-nowrap border-b border-gray-200 bg-gray-50 p-2.5"
                    colSpan={row.getVisibleCells().length}
                  >
                    <button
                      className="flex items-center gap-2"
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: {
                          cursor: row.getCanExpand() ? "pointer" : "normal",
                        },
                      }}
                    >
                      {row.getIsExpanded() ? (
                        <ChevronDownIcon className="h-4" />
                      ) : (
                        <ChevronRightIcon className="h-4" />
                      )}
                      <span className="font-semibold">
                        {row.groupingValue as string}
                      </span>
                      <span className="font-normal text-slate-400">
                        ({row.subRows.length})
                      </span>
                    </button>
                  </th>
                </tr>
              );
            }
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={clsx(
                      "overflow-hidden border-gray-100 px-2.5 py-2.5",
                      {
                        "border-b ": table.getRowModel().rows.length !== i + 1,
                      },
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
