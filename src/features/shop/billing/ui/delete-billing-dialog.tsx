"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteShopBilling } from "../lib/billing-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Loader, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ShopBilling } from "@/generated/prisma";

export default function DeleteBillingDialog({
  billing,
  shopId,
}: {
  billing: ShopBilling;
  shopId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteShopBilling(billing.id, shopId);
      if (result.success) {
        toast.success("Catatan tagihan berhasil dihapus");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Gagal menghapus tagihan");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending || billing.status === "PAID"}
        >
          <Trash2 /> Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Tagihan?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data tagihan untuk periode
            <span className="font-semibold text-foreground">
              {" "}
              {format(new Date(billing.start_date), "dd/MM")} -{" "}
              {format(new Date(billing.end_date), "dd/MM")}
            </span>{" "}
            akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button
            onClick={() => onDelete()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending && <Loader className="animate-spin" />}
            Hapus Tagihan
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
