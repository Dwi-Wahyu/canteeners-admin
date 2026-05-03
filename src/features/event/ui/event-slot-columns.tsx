"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { EventSlotAction } from "./event-slot-action";

export const eventSlotColumns: ColumnDef<any>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal" />
    ),
    cell: ({ row }) => (
      <div>
        {format(new Date(row.getValue("date")), "eeee, d MMMM yyyy", {
          locale: id,
        })}
      </div>
    ),
    meta: {
      label: "Tanggal",
      variant: "dateRange",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Waktu Mulai" />
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("start_time")), "HH:mm")}</div>
    ),
  },
  {
    accessorKey: "end_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Waktu Selesai" />
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("end_time")), "HH:mm")}</div>
    ),
  },
  {
    accessorKey: "quota",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kuota" />
    ),
    cell: ({ row }) => <div>{row.getValue("quota")} User</div>,
  },
  {
    accessorKey: "current_usage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Terpakai" />
    ),
    cell: ({ row }) => <div>{row.getValue("current_usage")} User</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <EventSlotAction data={row.original} />,
  },
];
