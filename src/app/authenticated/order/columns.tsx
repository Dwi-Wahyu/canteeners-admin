"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquareArrowOutUpRight } from "lucide-react";
import { OrdersTableDataType } from "@/features/order/types/order-queries-return-types";
import { formatRupiah } from "@/helper/format-rupiah";
import { orderStatusMapping } from "@/constants/order-status-mapping";
import { Badge } from "@/components/ui/badge";
import NavButton from "@/components/nav-button";
import { calculateCommission } from "@/helper/pricing-helper";

export const OrderColumns: ColumnDef<OrdersTableDataType>[] = [
  {
    header: "Kedai",
    cell({ row }) {
      const { shop } = row.original;

      return <h1>{shop.name}</h1>;
    },
  },
  {
    header: "Pelanggan",
    cell({ row }) {
      const { customer } = row.original;

      return <h1>{customer.user.name}</h1>;
    },
  },
  {
    header: "Total",
    cell({ row }) {
      const { total_price } = row.original;

      return <h1>{formatRupiah(total_price)}</h1>;
    },
  },
  {
    header: "Komisi",
    cell({ row }) {
      const { order_items, status } = row.original;

      if (
        status === "CANCELLED" ||
        status === "REJECTED" ||
        status === "PAYMENT_REJECTED"
      ) {
        return <h1 className="font-bold text-muted-foreground">{formatRupiah(0)}</h1>;
      }

      const totalQty = order_items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const commission = calculateCommission(totalQty);

      return (
        <h1 className="font-bold text-primary">{formatRupiah(commission)}</h1>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell({ row }) {
      const { status } = row.original;

      return (
        <Badge>
          {orderStatusMapping[status as keyof typeof orderStatusMapping]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const order = row.original;

      return (
        <div className="flex gap-1">
          <NavButton
            variant="outline"
            size="icon"
            href={`/authenticated/order/${order.id}`}
          >
            <SquareArrowOutUpRight />
          </NavButton>
        </div>
      );
    },
    size: 5,
  },
];
