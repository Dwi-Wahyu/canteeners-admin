"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { EventAction } from "./event-action";

export const eventColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Event" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue("is_active") ? "default" : "secondary"}>
        {row.getValue("is_active") ? "Aktif" : "Non-aktif"}
      </Badge>
    ),
  },
  {
    id: "slots_count",
    header: "Jumlah Slot",
    cell: ({ row }) => <div>{row.original._count.slots} Slot</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <EventAction data={row.original} />,
  },
];
