"use client";

import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@/types/data-table";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { orderStatusMapping } from "@/constants/order-status-mapping";
import { paymentMethodMapping } from "@/constants/payment-method";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface OrderFiltersProps {
  shops: Option[];
}

export function OrderFilters({ shops }: OrderFiltersProps) {
  const [shopId, setShopId] = useQueryState("shop_id", {
    defaultValue: "",
    shallow: false,
    clearOnDefault: true,
  });

  const [status, setStatus] = useQueryState("status", {
    defaultValue: "",
    shallow: false,
    clearOnDefault: true,
  });

  const [paymentMethod, setPaymentMethod] = useQueryState("payment_method", {
    defaultValue: "",
    shallow: false,
    clearOnDefault: true,
  });

  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    shallow: false,
    clearOnDefault: true,
  });

  const [localName, setLocalName] = useState(name);

  const isFiltered = shopId || status || paymentMethod || name;

  const handleReset = () => {
    setShopId(null);
    setStatus(null);
    setPaymentMethod(null);
    setName(null);
    setLocalName("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setName(localName || null);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama pelanggan..."
            className="pl-8 w-[250px] h-9 text-xs"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm" className="h-9 px-3">
          Cari
        </Button>
      </form>

      <div className="h-6 w-px bg-border mx-1 hidden md:block" />

      <Select value={shopId} onValueChange={setShopId}>
        <SelectTrigger className="w-[180px] h-9 text-xs">
          <SelectValue placeholder="Semua Kedai" />
        </SelectTrigger>
        <SelectContent>
          {shops.map((shop) => (
            <SelectItem key={shop.value} value={shop.value}>
              {shop.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px] h-9 text-xs">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(orderStatusMapping).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
        <SelectTrigger className=" h-9 text-xs">
          <SelectValue placeholder="Semua Pembayaran" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(paymentMethodMapping).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-xs"
          onClick={handleReset}
        >
          <X className="mr-2 h-3 w-3" />
          Reset Filter
        </Button>
      )}
    </div>
  );
}
