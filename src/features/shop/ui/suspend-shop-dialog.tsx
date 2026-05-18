"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Ban, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { suspendShop, unsuspendShop } from "../lib/shop-actions";
import { ShopViolationType } from "@/generated/prisma";
import { shopViolationTitleMapping } from "@/constants/shop-violation-mapping";

const VIOLATION_TYPES = Object.keys(
  shopViolationTitleMapping,
) as ShopViolationType[];

export function SuspendShopDialog({
  shopId,
  adminUserId,
  isSuspended,
}: {
  shopId: string;
  adminUserId: string;
  isSuspended: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [createViolation, setCreateViolation] = useState(false);
  const [violationType, setViolationType] = useState<ShopViolationType | "">("");

  const handleSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Alasan penangguhan wajib diisi");
      return;
    }
    if (createViolation && !violationType) {
      toast.error("Pilih jenis pelanggaran");
      return;
    }

    setIsLoading(true);
    const result = await suspendShop({
      shopId,
      reason,
      adminUserId,
      createViolation,
      violationType: violationType as ShopViolationType,
    });

    if (result.success) {
      toast.success("Kedai berhasil dinonaktifkan");
      setOpen(false);
      setReason("");
      setCreateViolation(false);
      setViolationType("");
    } else {
      toast.error(result.message || "Terjadi kesalahan");
    }
    setIsLoading(false);
  };

  const handleUnsuspend = async () => {
    setIsLoading(true);
    const result = await unsuspendShop({ shopId });
    if (result.success) {
      toast.success("Kedai berhasil diaktifkan kembali");
      setOpen(false);
    } else {
      toast.error(result.message || "Terjadi kesalahan");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isSuspended ? (
          <Button variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full sm:w-auto">
            <CheckCircle className="w-4 h-4 mr-2" />
            Aktifkan Kedai
          </Button>
        ) : (
          <Button variant="destructive" className="w-full sm:w-auto">
            <Ban className="w-4 h-4 mr-2" />
            Nonaktifkan Kedai
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSuspended ? "Aktifkan Kembali Kedai" : "Nonaktifkan Kedai"}
          </DialogTitle>
        </DialogHeader>

        {isSuspended ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin mencabut status penangguhan pada kedai ini?
              Kedai akan dapat kembali beroperasi dan menerima pesanan.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Batal
              </Button>
              <Button onClick={handleUnsuspend} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Aktifkan Kedai
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSuspend} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alasan Penangguhan</label>
              <Textarea
                placeholder="Masukkan alasan mengapa kedai ini dinonaktifkan..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Alasan ini akan dikirimkan kepada pemilik kedai melalui notifikasi.
              </p>
            </div>

            <div className="border rounded-lg p-3 space-y-3 bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createViolation"
                  checked={createViolation}
                  onCheckedChange={(c) => setCreateViolation(c as boolean)}
                />
                <label
                  htmlFor="createViolation"
                  className="text-sm font-medium cursor-pointer"
                >
                  Catat sebagai Pelanggaran
                </label>
              </div>

              {createViolation && (
                <div className="space-y-2 pl-6 animate-in slide-in-from-top-1">
                  <Select
                    value={violationType}
                    onValueChange={(v) => setViolationType(v as ShopViolationType)}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Pilih jenis pelanggaran" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIOLATION_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {shopViolationTitleMapping[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Batal
              </Button>
              <Button type="submit" variant="destructive" disabled={isLoading || !reason}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Nonaktifkan
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
