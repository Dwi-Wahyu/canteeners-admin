"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateRefundStatus } from "@/features/order/lib/refund-actions";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RefundStatus } from "@/generated/prisma";

interface RefundActionFormProps {
  refundId: string;
  currentStatus: RefundStatus;
}

export function RefundActionForm({
  refundId,
  currentStatus,
}: RefundActionFormProps) {
  const [status, setStatus] = useState<RefundStatus>(currentStatus);
  const [rejectedReason, setRejectedReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await updateRefundStatus(refundId, status, rejectedReason);

    if (result.success) {
      toast.success("Status refund berhasil diperbarui");
    } else {
      toast.error(result.error || "Gagal memperbarui status refund");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tentukan Status Refund</label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as RefundStatus)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ESCALATED">Tetap Eskalasi</SelectItem>
            <SelectItem value="APPROVED">Setujui Refund</SelectItem>
            <SelectItem value="REJECTED">Tolak Refund</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {status === "REJECTED" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Alasan Penolakan</label>
          <Textarea
            placeholder="Berikan alasan mengapa refund ditolak..."
            value={rejectedReason}
            onChange={(e) => setRejectedReason(e.target.value)}
            rows={3}
          />
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Proses Keputusan
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan mengubah status refund menjadi{" "}
              <span className="font-bold">
                {status === "APPROVED"
                  ? "DISETUJUI"
                  : status === "REJECTED"
                    ? "DITOLAK"
                    : "ESCALATED"}
              </span>
              . Keputusan admin bersifat final dalam sistem ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
