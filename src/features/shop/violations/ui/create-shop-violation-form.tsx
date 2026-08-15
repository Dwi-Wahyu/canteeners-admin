"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ShopViolationType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createShopViolation } from "../lib/shop-violation-actions";
import { shopViolationTitleMapping } from "@/constants/shop-violation-mapping";

interface CreateShopViolationFormProps {
  shopId: string;
  adminUserId: string;
  onSuccess?: () => void;
}

const VIOLATION_TYPES = Object.keys(
  shopViolationTitleMapping,
) as ShopViolationType[];

export function CreateShopViolationForm({
  shopId,
  adminUserId,
  onSuccess,
}: CreateShopViolationFormProps) {
  const [type, setType] = useState<ShopViolationType | "">("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    setIsLoading(true);
    const result = await createShopViolation({
      shop_id: shopId,
      type: type as ShopViolationType,
      note: note || undefined,
      reviewed_by: adminUserId,
    });

    if (result.success) {
      toast.success("Pelanggaran berhasil dicatat");
      setType("");
      setNote("");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Gagal mencatat pelanggaran");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Jenis Pelanggaran</label>
        <Select
          value={type}
          onValueChange={(v) => setType(v as ShopViolationType)}
        >
          <SelectTrigger className="w-full">
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Catatan Admin{" "}
          <span className="text-muted-foreground">(opsional)</span>
        </label>
        <Textarea
          placeholder="Deskripsikan konteks pelanggaran, nomor order terkait, atau tindakan yang telah diambil..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !type}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Catat Pelanggaran
      </Button>
    </form>
  );
}
