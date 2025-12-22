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

// Pastikan kamu membuat fungsi updateBillingToPaid di billing-actions
import { updateBillingToPaid } from "../lib/billing-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react"; // Icon centang untuk sukses
import { format } from "date-fns";
import { ShopBilling } from "@/generated/prisma";

export default function PaidBillingDialog({
  billing,
  shopId,
}: {
  billing: ShopBilling;
  shopId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const onMarkAsPaid = () => {
    startTransition(async () => {
      const result = await updateBillingToPaid(billing.id, shopId);

      if (result.success) {
        toast.success("Tagihan berhasil ditandai sebagai Lunas");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Gagal memperbarui status tagihan");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" disabled={isPending || billing.status === "PAID"}>
          <CheckCircle2 />
          Telah dibayar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menandai tagihan periode{" "}
            <span className="font-semibold text-foreground">
              {format(new Date(billing.start_date), "dd/MM")} -{" "}
              {format(new Date(billing.end_date), "dd/MM")}
            </span>{" "}
            sebagai{" "}
            <span className="text-emerald-600 font-bold">SUDAH DIBAYAR</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <Button onClick={() => onMarkAsPaid()} disabled={isPending}>
            {isPending ? "Memproses..." : "Konfirmasi Bayar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
