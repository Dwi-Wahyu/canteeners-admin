"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerCardData, DashboardRange } from "../lib/dashboard-schema";
import { useEffect, useState, useTransition } from "react";
import { getPartnerCards } from "../lib/dashboard-actions";
import { formatRupiah } from "@/helper/format-rupiah";
import { Store, CreditCard, Receipt, TrendingUp } from "lucide-react";

interface PartnerCardsListProps {
  range: DashboardRange;
  shopId: string;
}

export function PartnerCardsList({ range, shopId }: PartnerCardsListProps) {
  const [partners, setPartners] = useState<PartnerCardData[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getPartnerCards({ range, shopId });
      setPartners(data);
    });
  }, [range, shopId]);

  if (partners.length === 0 && isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner) => (
        <Card key={partner.shopId} className="overflow-hidden">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-4 w-4 text-primary" />
              {partner.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Receipt className="h-3 w-3" /> Total Pesanan
              </span>
              <span className="font-semibold">{partner.totalOrders}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Pendapatan Gross
              </span>
              <span className="font-semibold">{formatRupiah(partner.grossIncome)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <CreditCard className="h-3 w-3" /> Utang Platform
              </span>
              <span className="font-semibold text-red-600">{formatRupiah(partner.platformDebt)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center text-sm font-bold">
              <span>Platform Profit</span>
              <span className="text-green-600">{formatRupiah(partner.platformProfit)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
