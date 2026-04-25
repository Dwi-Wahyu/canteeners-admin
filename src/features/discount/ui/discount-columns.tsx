"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash, Power, PowerOff, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteDiscount, toggleDiscountStatus } from "../lib/discount-actions";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/helper/format-rupiah";
import Link from "next/link";

import { DiscountTableDataType } from "../lib/discount-types";

export const DiscountColumns: ColumnDef<DiscountTableDataType>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => row.original.code || "-",
  },
  {
    accessorKey: "type",
    header: "Tipe",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.type === "PERCENTAGE" ? "Persentase" : "Fixed (Nominal)"}
      </Badge>
    ),
  },
  {
    accessorKey: "value",
    header: "Nilai",
    cell: ({ row }) => {
      const { type, value } = row.original;
      return type === "PERCENTAGE" ? `${value}%` : formatRupiah(value);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
          {status === "ACTIVE" ? "Aktif" : "Nonaktif"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const discount = row.original;
      const [isLoading, setIsLoading] = useState(false);

      const handleDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus discount "${discount.name}"?`)) return;
        
        setIsLoading(true);
        const result = await deleteDiscount(discount.id);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        setIsLoading(false);
      };

      const handleToggleStatus = async () => {
        setIsLoading(true);
        const result = await toggleDiscountStatus(discount.id, discount.status);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        setIsLoading(false);
      };

      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/authenticated/voucher/edit/${discount.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={isLoading}
            title={discount.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
          >
            {discount.status === "ACTIVE" ? (
              <PowerOff className="h-4 w-4 text-yellow-600" />
            ) : (
              <Power className="h-4 w-4 text-green-600" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
