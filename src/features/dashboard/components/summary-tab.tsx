"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryMetrics, DashboardRange } from "../lib/dashboard-schema";
import { formatRupiah } from "@/helper/format-rupiah";
import { Users, ShoppingBag, Store, Activity } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getSummaryMetrics } from "../lib/dashboard-actions";

interface SummaryTabProps {
  range: DashboardRange;
  shopId: string;
}

export function SummaryTab({ range, shopId }: SummaryTabProps) {
  const [metrics, setMetrics] = useState<SummaryMetrics | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getSummaryMetrics({ range, shopId });
      setMetrics(data);
    });
  }, [range, shopId]);

  if (!metrics && isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const cards = [
    {
      title: "Total Transaksi",
      value: metrics.totalTransactions,
      description: "Jumlah pesanan selesai",
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Total GMV",
      value: formatRupiah(metrics.totalGMV),
      description: "Pendapatan kotor",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Pengguna Baru/Aktif",
      value: `${metrics.newUsers} / ${metrics.activeUsers}`,
      description: "User baru vs login",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Mitra Hadir",
      value: `${metrics.presentPartners} / ${metrics.totalPartners}`,
      description: "Mitra aktif hari ini",
      icon: Store,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
