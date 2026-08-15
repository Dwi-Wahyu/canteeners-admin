"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteShopViolation } from "@/features/shop/violations/lib/shop-violation-actions";
import { toast } from "sonner";

export function DeleteViolationButton({
  id,
  shopId,
}: {
  id: string;
  shopId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus pelanggaran ini?")) return;

    setIsDeleting(true);
    const result = await deleteShopViolation(id, shopId);
    if (result.success) {
      toast.success("Pelanggaran berhasil dihapus");
    } else {
      toast.error(result.error ?? "Gagal menghapus pelanggaran");
      setIsDeleting(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
      className="gap-2"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      Hapus
    </Button>
  );
}
