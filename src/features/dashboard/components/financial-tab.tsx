"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialMetrics, DashboardRange } from "../lib/dashboard-schema";
import { formatRupiah } from "@/helper/format-rupiah";
import { Wallet, Landmark, TicketPercent, ReceiptCent } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getFinancialMetrics } from "../lib/dashboard-actions";

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
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
  );
}
