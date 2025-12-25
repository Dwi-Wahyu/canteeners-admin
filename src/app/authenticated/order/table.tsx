"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import {
  GetOrdersTableDataResponseType,
  OrdersTableDataType,
} from "@/features/order/types/order-queries-return-types";

export default function OrdersTable({
  promises,
  columns,
}: {
  promises: GetOrdersTableDataResponseType;
  columns: ColumnDef<OrdersTableDataType>[];
}) {
  const { data, filtered, pageCount } = promises;

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
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
      <div className="flex justify-between w-full">
        <h1 className="text-xl font-semibold mb-4">Riwayat Order</h1>

        <DataTableSortList table={table} />
      </div>
    </DataTable>
  );
}
