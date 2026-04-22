"use client";

import { useQueryState, parseAsString } from "nuqs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getShops } from "@/features/dashboard/lib/shop-queries";

export function DashboardFilters() {
  const [range, setRange] = useQueryState("range", parseAsString.withDefault("daily"));
  const [shopId, setShopId] = useQueryState("shopId", parseAsString.withDefault("all"));
  const [shops, setShops] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getShops().then(setShops);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex bg-muted p-1 rounded-lg">
        <Button
          variant={range === "daily" ? "default" : "ghost"}
          size="sm"
          onClick={() => setRange("daily")}
          className={range === "daily" ? "bg-primary text-primary-foreground" : ""}
        >
          Harian
        </Button>
        <Button
          variant={range === "weekly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setRange("weekly")}
          className={range === "weekly" ? "bg-primary text-primary-foreground" : ""}
        >
          Mingguan
        </Button>
        <Button
          variant={range === "monthly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setRange("monthly")}
          className={range === "monthly" ? "bg-primary text-primary-foreground" : ""}
        >
          Bulanan
        </Button>
      </div>

      <Select value={shopId} onValueChange={setShopId}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Semua Kedai" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kedai</SelectItem>
          {shops.map((shop) => (
            <SelectItem key={shop.id} value={shop.id}>
              {shop.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
