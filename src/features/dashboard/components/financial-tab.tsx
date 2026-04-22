"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialMetrics, DashboardRange } from "../lib/dashboard-schema";
import { formatRupiah } from "@/helper/format-rupiah";
import { Wallet, Landmark } from "lucide-react";
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
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue Stream (Service Fee)
          </CardTitle>
          <Wallet className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatRupiah(metrics.totalServiceFee)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total biaya layanan Rp 1.000 per item
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Settlement & Debt (Utang Platform)
          </CardTitle>
          <Landmark className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatRupiah(metrics.totalDebt)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total dana yang belum ditransfer ke mitra
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
