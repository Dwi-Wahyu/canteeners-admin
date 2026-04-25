"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import {
  GetOrdersTableDataResponseType,
  OrdersTableDataType,
} from "@/features/order/types/order-queries-return-types";
import { Option } from "@/types/data-table";
import { OrderFilters } from "@/features/order/ui/order-filters";

export default function OrdersTable({
  promises,
  columns,
  shops,
}: {
  promises: GetOrdersTableDataResponseType;
  columns: ColumnDef<OrdersTableDataType>[];
  shops: Option[];
}) {
  const { data, pageCount } = promises;

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
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Riwayat Order</h1>
          <DataTableSortList table={table} />
        </div>

        <OrderFilters shops={shops} />
      </div>
    </DataTable>
  );
}
