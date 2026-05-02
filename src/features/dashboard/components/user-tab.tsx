"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTrendData, DashboardRange } from "../lib/dashboard-schema";
import { useEffect, useState, useTransition } from "react";
import { getUserMetrics } from "../lib/dashboard-actions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface UserTabProps {
  range: DashboardRange;
  shopId: string;
}

export function UserTab({ range, shopId }: UserTabProps) {
  const [data, setData] = useState<UserTrendData[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const trendData = await getUserMetrics({ range, shopId });
      setData(trendData);
    });
  }, [range, shopId]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Pertumbuhan Pengguna (Baru vs Kembali)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          {isPending ? (
            <div className="h-full w-full flex items-center justify-center animate-pulse bg-muted rounded" />
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Legend />
                <Bar 
                  dataKey="newUsers" 
                  name="Pengguna Baru" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="returningUsers" 
                  name="Pengguna Kembali" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
