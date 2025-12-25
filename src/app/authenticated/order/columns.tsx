"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight, SquarePen } from "lucide-react";
import { OrdersTableDataType } from "@/features/order/types/order-queries-return-types";
import { formatRupiah } from "@/helper/format-rupiah";
import { orderStatusMapping } from "@/constants/order-status-mapping";
import { Badge } from "@/components/ui/badge";
import NavButton from "@/components/nav-button";

export const OrderColumns: ColumnDef<OrdersTableDataType>[] = [
  {
    header: "Kedai",
    cell({ row }) {
      const { shop } = row.original;

      return <h1>{shop.name}</h1>;
    },
  },
  {
    header: "Pelanggan",
    cell({ row }) {
      const { customer } = row.original;

      return <h1>{customer.user.name}</h1>;
    },
  },
  {
    header: "Total",
    cell({ row }) {
      const { total_price } = row.original;

      return <h1>{formatRupiah(total_price)}</h1>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell({ row }) {
      const { status } = row.original;

      return <Badge>{orderStatusMapping[status]}</Badge>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const order = row.original;

      return (
        <div className="flex gap-1">
          <NavButton
            variant="outline"
            size="icon"
            href={`/authenticated/order/${order.id}`}
          >
            <SquareArrowOutUpRight />
          </NavButton>

          {/* <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteEmployee}
            title="Konfirmasi Penghapusan"
            message={`Apakah Anda yakin ingin menghapus karyawan "${employee.name}" ? Tindakan ini tidak dapat dibatalkan.`}
            confirmButtonText={isDeleting ? "Menghapus..." : "Hapus"}
            cancelButtonText="Batal"
            isLoading={isDeleting}
            confirmButtonVariant="destructive"
          /> */}
        </div>
      );
    },
    size: 5,
  },
];
