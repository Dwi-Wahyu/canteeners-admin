"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/helper/get-image-url";
import { DiscountOwnerTableDataType } from "../lib/discount-types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { revokeVoucherFromCustomer } from "../lib/discount-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const DiscountOwnersColumns: ColumnDef<DiscountOwnerTableDataType>[] = [
  {
    accessorKey: "customer.user.avatar",
    header: "Pasfoto",
    cell({ row }) {
      const { avatar, name } = row.original.customer.user;

      return (
        <img
          className="rounded-lg object-cover"
          src={getImageUrl("/avatar/" + avatar)}
          alt={name}
          width={50}
          height={50}
        />
      );
    },
  },
  {
    accessorKey: "customer.user.name",
    header: "Nama",
    cell: ({ row }) => row.original.customer.user.name,
  },
  {
    accessorKey: "customer.user.username",
    header: "Username",
    cell: ({ row }) => row.original.customer.user.username || "-",
  },
  {
    accessorKey: "acquired_at",
    header: "Didapatkan Pada",
    cell: ({ row }) => format(new Date(row.original.acquired_at), "PPP p", { locale: localeId }),
  },
  {
    accessorKey: "is_used",
    header: "Status Penggunaan",
    cell: ({ row }) => {
      const isUsed = row.original.is_used;
      return (
        <Badge variant={isUsed ? "default" : "secondary"}>
          {isUsed ? "Sudah Digunakan" : "Belum Digunakan"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "used_at",
    header: "Digunakan Pada",
    cell: ({ row }) => {
      const usedAt = row.original.used_at;
      return usedAt ? format(new Date(usedAt), "PPP p", { locale: localeId }) : "-";
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: function Cell({ row }) {
      const item = row.original;
      const [isOpen, setIsOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const handleRevoke = async () => {
        setIsLoading(true);
        const result = await revokeVoucherFromCustomer(item.id);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        setIsLoading(false);
        setIsOpen(false);
      };

      return (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setIsOpen(true)}
            disabled={item.is_used}
            title={item.is_used ? "Voucher sudah digunakan" : "Cabut Voucher"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cabut Voucher?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin mencabut voucher ini dari pelanggan{" "}
                  <strong>{item.customer.user.name}</strong>? Tindakan ini tidak dapat
                  dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleRevoke();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Mencabut..." : "Ya, Cabut"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
