"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialMetrics, DashboardRange } from "../lib/dashboard-schema";
import { formatRupiah } from "@/helper/format-rupiah";
import { Wallet, Landmark, TicketPercent, ReceiptCent, Store } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getFinancialMetrics } from "../lib/dashboard-actions";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FinancialTabProps {
  range: DashboardRange;
  shopId: string;
}

export function FinancialTab({ range, shopId }: FinancialTabProps) {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getFinancialMetrics({ range, shopId });
      setMetrics(data);
    });
  }, [range, shopId]);

  if (!metrics && isPending) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse h-32" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-8">
      {/* Global Totals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Komisi Platform
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(metrics.totalCommission)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total biaya layanan dari mitra
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subsidi Promo Platform
            </CardTitle>
            <TicketPercent className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(metrics.totalSubsidy)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hutang subsidi promo ke mitra
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Refund
            </CardTitle>
            <ReceiptCent className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(metrics.totalRefund)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total pengembalian dana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Settlement
            </CardTitle>
            <Landmark className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(metrics.totalNet)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalNet >= 0
                ? "Piutang yang harus ditagih"
                : "Hutang yang harus dibayar"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Per Shop Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Store className="h-5 w-5" />
          Detail Keuangan Per Kedai
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.shopMetrics.map((shop) => (
            <Card key={shop.shopId} className="overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-base">{shop.shopName}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Komisi Platform</span>
                  <span className="font-semibold text-primary">{formatRupiah(shop.commission)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subsidi Promo</span>
                  <span className="font-semibold text-orange-600">{formatRupiah(shop.subsidy)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Refund</span>
                  <span className="font-semibold text-destructive">{formatRupiah(shop.refund)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-medium">Net Settlement</span>
                  <span className={cn(
                    "font-bold text-lg",
                    shop.net >= 0 ? "text-green-600" : "text-destructive"
                  )}>
                    {formatRupiah(shop.net)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          {metrics.shopMetrics.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              Tidak ada data penagihan yang tertunda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
