"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { ChevronLeft } from "lucide-react";
import NavButton from "@/components/nav-button";
import { GetDiscountOwnerTableDataResponseType, DiscountOwnerTableDataType } from "../lib/discount-types";

export default function DiscountOwnersTable({
  promises,
  columns,
}: {
  promises: GetDiscountOwnerTableDataResponseType;
  columns: ColumnDef<DiscountOwnerTableDataType>[];
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
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} />

        <div className="flex gap-2">
            <NavButton href="/authenticated/voucher" variant="outline">
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </NavButton>
        </div>
      </DataTableToolbar>
    </DataTable>
  );
}
