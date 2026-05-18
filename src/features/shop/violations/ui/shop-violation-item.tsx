"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { AlertTriangle, Trash2 } from "lucide-react";
import { shopViolationTitleMapping } from "@/constants/shop-violation-mapping";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteShopViolation } from "../lib/shop-violation-actions";
import { toast } from "sonner";
import { ShopViolation } from "@/generated/prisma";

const violationTypeColorMap: Record<string, string> = {
  HIGH_DAILY_CANCEL_RATE: "bg-yellow-100 text-yellow-800",
  SLOW_ORDER_CONFIRMATION: "bg-yellow-100 text-yellow-800",
  HIGH_ORDER_LATE_RATE: "bg-orange-100 text-orange-800",
  REFUND_IGNORED: "bg-red-100 text-red-800",
  REFUND_SLOW_RESPONSE: "bg-orange-100 text-orange-800",
  POLICY_VIOLATION: "bg-red-100 text-red-800",
  REFUND_FRAUD_SUSPECTED: "bg-red-100 text-red-900 font-bold",
  REPEATED_CRITICAL_VIOLATIONS: "bg-red-100 text-red-900 font-bold",
};

export function ShopViolationItem({
  violation: v,
}: {
  violation: ShopViolation;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus pelanggaran ini?")) return;

    setIsDeleting(true);
    const result = await deleteShopViolation(v.id, v.shop_id);
    if (result.success) {
      toast.success("Pelanggaran berhasil dihapus");
    } else {
      toast.error(result.error ?? "Gagal menghapus pelanggaran");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/50">
      <div className="size-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0 mt-0.5">
        <AlertTriangle className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">
            {shopViolationTitleMapping[v.type] ?? v.type}
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${violationTypeColorMap[v.type] ?? ""}`}
          >
            {v.source}
          </Badge>
        </div>
        {v.note && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {v.note}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1">
          {format(new Date(v.created_at), "d MMM yyyy, HH:mm", {
            locale: idLocale,
          })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive h-8 w-8 -mt-1 -mr-1"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
