"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRupiah } from "@/helper/format-rupiah";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  CreditCard,
  MapPin,
  Package,
  Store,
  User,
} from "lucide-react";
import NavButton from "@/components/nav-button";
import { getOrderDetail } from "@/features/order/lib/order-queries";
import { orderStatusMapping } from "@/constants/order-status-mapping";
import { paymentMethodMapping } from "@/constants/payment-method.tsx";
import { postOrderTypeMapping } from "@/constants/post-order-type-mapping";
import { Separator } from "@/components/ui/separator";
import { calculateCommission } from "@/helper/pricing-helper";

export default function OrderDetailClient({
  order,
}: {
  order: NonNullable<Awaited<ReturnType<typeof getOrderDetail>>>;
}) {
  const totalQty = order.order_items.reduce((acc, item) => acc + item.quantity, 0);
  const isCancelled = order.status === "CANCELLED" || order.status === "REJECTED" || order.status === "PAYMENT_REJECTED";
  const commission = isCancelled ? 0 : calculateCommission(totalQty);

  const orderStatusColors: Record<string, string> = {
    PENDING_CONFIRMATION: "bg-yellow-100 text-yellow-800 border-yellow-200",
    WAITING_PAYMENT: "bg-blue-100 text-blue-800 border-blue-200",
    PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <NavButton variant="outline" size="icon" href="/authenticated/order">
          <ArrowLeft className="h-4 w-4" />
        </NavButton>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Order</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            ID: <span className="font-mono">{order.id}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Status & Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">Status Pesanan</CardTitle>
                <CardDescription>Informasi status saat ini.</CardDescription>
              </div>
              <Badge variant="outline" className={orderStatusColors[order.status] || ""}>
                {orderStatusMapping[order.status as keyof typeof orderStatusMapping]}
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    Waktu Order
                  </p>
                  <p className="text-sm font-medium">
                    {format(new Date(order.created_at), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    Tipe Pesanan
                  </p>
                  <p className="text-sm font-medium">
                    {postOrderTypeMapping[order.post_order_type as keyof typeof postOrderTypeMapping]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" /> Rincian Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 py-2 border-b last:border-0">
                    <div className="space-y-1">
                      <p className="font-bold text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatRupiah(item.price_at_add)}
                      </p>
                      {item.selected_options.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selected_options.map((opt) => (
                            <Badge key={opt.id} variant="secondary" className="text-[10px] py-0">
                              {opt.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {item.note && (
                        <p className="text-xs italic text-muted-foreground mt-1">
                          Catatan: {item.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatRupiah(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal Produk</span>
                  <span>{formatRupiah(order.order_items.reduce((acc, item) => acc + item.subtotal, 0))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Komisi Platform</span>
                  <span className={isCancelled ? "text-muted-foreground line-through" : ""}>
                    {formatRupiah(commission)}
                  </span>
                </div>
                {order.total_discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-red-600 font-medium">
                    <span>Potongan Diskon</span>
                    <span>-{formatRupiah(order.total_discount_amount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total Bayar</span>
                  <span>{formatRupiah(order.total_price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Customer & Shop Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">{order.customer.user.name}</p>
              <p className="text-sm text-muted-foreground">{order.customer.email || order.customer.user.username}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Store className="w-4 h-4" /> Kedai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">{order.shop.name}</p>
              <p className="text-sm text-muted-foreground">{order.shop.canteen.name}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {paymentMethodMapping[order.payment_method as keyof typeof paymentMethodMapping]}
              </p>
            </CardContent>
          </Card>

          {(order.post_order_type === "DELIVERY_TO_TABLE" || order.table_number) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Lokasi Meja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold">Meja {order.table_number}</p>
                <p className="text-sm text-muted-foreground">Lantai {order.floor}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
