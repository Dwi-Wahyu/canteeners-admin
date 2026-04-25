"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { Plus, UserPlus } from "lucide-react";
import NavButton from "@/components/nav-button";
import { GetDiscountTableDataResponseType, DiscountTableDataType } from "../lib/discount-types";

export default function DiscountTable({
  promises,
  columns,
}: {
  promises: GetDiscountTableDataResponseType;
  columns: ColumnDef<DiscountTableDataType>[];
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
            <NavButton href="/authenticated/voucher/assign">
            <UserPlus className="h-4 w-4" />
            Beri Voucher
            </NavButton>
            <NavButton href="/authenticated/voucher/create">
            <Plus className="h-4 w-4" />
            Tambah Voucher
            </NavButton>
        </div>
      </DataTableToolbar>
    </DataTable>
  );
}
