"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { deleteAppTestimony } from "../lib/testimony-actions";
import { AppTestimony } from "@/generated/prisma";
import { Star } from "lucide-react";

export const createTestimonyColumns = (
  isDeleting: boolean,
  setIsDeleting: (v: boolean) => void
): ColumnDef<AppTestimony>[] => [
  {
    id: "drag-handle",
    header: "",
    cell: () => (
      <div className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
    ),
  },
  {
    accessorKey: "order",
    header: "Urutan",
  },
  {
    accessorKey: "from",
    header: "Dari",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "message",
    header: "Pesan",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.original.message}>
        {row.original.message}
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      </div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const testimony = row.original;

      const handleDelete = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) return;
        
        setIsDeleting(true);
        const res = await deleteAppTestimony(testimony.id);
        if (res.success) {
          toast.success("Testimoni berhasil dihapus");
        } else {
          toast.error(res.error || "Gagal menghapus testimoni");
        }
        setIsDeleting(false);
      };

      return (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      );
    },
  },
];
