"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerRanking, DailyOrderVolume, DashboardRange } from "../lib/dashboard-schema";
import { useEffect, useState, useTransition } from "react";
import { getPartnerMetrics } from "../lib/dashboard-actions";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trophy, Clock } from "lucide-react";

interface PartnerTabProps {
  range: DashboardRange;
  shopId: string;
}

export function PartnerTab({ range, shopId }: PartnerTabProps) {
  const [data, setData] = useState<{ ranking: PartnerRanking[]; volume: DailyOrderVolume[] } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const metrics = await getPartnerMetrics({ range, shopId });
      setData(metrics);
    });
  }, [range, shopId]);

  if (!data && isPending) {
    return <div className="h-[400px] w-full animate-pulse bg-muted rounded" />;
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Volume Pesanan Harian</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.volume}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Peringkat Mitra Terbaik
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.ranking.slice(0, 5).map((partner, index) => (
              <div key={partner.shopId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-muted-foreground w-4">{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium leading-none">{partner.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Rata-rata: {partner.averageLeadTime.toFixed(1)} mnt
                    </p>
                  </div>
                </div>
                <div className="text-sm font-semibold">{partner.orderVolume} Pesanan</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
