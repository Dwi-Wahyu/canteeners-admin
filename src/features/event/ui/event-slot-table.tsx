"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

interface EventSlotTableProps {
  promises: {
    data: any[];
    pageCount: number;
    total: number;
  };
  columns: any[];
}

export function EventSlotTable({ promises, columns }: EventSlotTableProps) {
  const { data, pageCount } = promises;

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
