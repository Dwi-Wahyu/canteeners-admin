"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { UsersTableDataType } from "@/features/users/types/queries-return-types";
import { getImageUrl } from "@/helper/get-image-url";
import { deleteUser } from "@/features/users/lib/user-action";
import { toast } from "sonner";
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

export const CustomerColumns: ColumnDef<UsersTableDataType>[] = [
  {
    accessorKey: "avatar",
    header: "Pasfoto",
    cell({ row }) {
      const { avatar, name } = row.original;

      return (
        <img
          className="rounded-lg object-cover aspect-square"
          src={getImageUrl(
            avatar.startsWith("http") ? avatar : "/avatar/" + avatar,
          )}
          alt={name}
          width={100}
          height={100}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const user = row.original;
      const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDeleteUser = async () => {
        setIsDeleting(true);
        try {
          const result = await deleteUser(user.id);
          if (result.success) {
            toast.success(result.message || "User berhasil dihapus!");
          } else {
            toast.error(result.error?.message || "Gagal menghapus user.");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          toast.error("Terjadi kesalahan tak terduga saat menghapus user.");
        } finally {
          setIsDeleting(false);
          setIsConfirmDialogOpen(false);
        }
      };

      return (
        <div className="flex gap-1">
          <Button variant={"outline"} size="sm" asChild>
            <Link href={`/authenticated/users/edit/${user.id}`}>
              <SquarePen className="h-4 w-4 mr-1" /> Edit
            </Link>
          </Button>
          <Button variant={"outline"} size="sm" asChild>
            <Link href={`/authenticated/users/detail/${user.id}`}>
              <Eye className="h-4 w-4 mr-1" /> Detail
            </Link>
          </Button>
          <Button
            variant={"outline"}
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setIsConfirmDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-1" /> Hapus
          </Button>

          <AlertDialog
            open={isConfirmDialogOpen}
            onOpenChange={setIsConfirmDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus pelanggan &quot;{user.name}
                  &quot;? Tindakan ini akan menghapus data dari sistem dan
                  Firebase Authentication. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
    size: 5,
  },
];
