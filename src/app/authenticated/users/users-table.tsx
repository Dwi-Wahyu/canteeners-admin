"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { UserPlus } from "lucide-react";
import NavButton from "@/components/nav-button";
import {
  GetUsersTableDataResponseType,
  UsersTableDataType,
} from "@/features/users/types/queries-return-types";

export default function UsersTable({
  promises,
  columns,
}: {
  promises: GetUsersTableDataResponseType;
  columns: ColumnDef<UsersTableDataType>[];
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
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} />

        <NavButton href="/admin/users/create">
          <UserPlus />
          Input User
        </NavButton>
      </DataTableToolbar>
    </DataTable>
  );
}
