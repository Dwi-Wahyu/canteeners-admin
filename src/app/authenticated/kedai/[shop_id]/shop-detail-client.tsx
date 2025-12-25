"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getImageUrl } from "@/helper/get-image-url";
import {
  Store,
  User,
  MapPin,
  Clock,
  CreditCard,
  Star,
  AlertCircle,
  MessagesSquare,
  HandCoins,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { formatRupiah } from "@/helper/format-rupiah";
import NavButton from "@/components/nav-button";
import { getShopDetail } from "@/features/shop/lib/shop-queries";

export default function ShopDetailClient({
  shop,
}: {
  shop: NonNullable<Awaited<ReturnType<typeof getShopDetail>>>;
}) {
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
    SUSPENDED: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start border-b pb-8">
        <div className="relative w-full md:w-48 aspect-square rounded-xl overflow-hidden shadow-md border">
          <Image
            src={getImageUrl(shop.image_url)}
            alt={shop.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{shop.name}</h1>
            <Badge variant="outline" className={statusColors[shop.status]}>
              {shop.status}
            </Badge>
          </div>

          <p className="text-muted-foreground text-lg max-w-2xl">
            {shop.description || "Tidak ada deskripsi untuk kedai ini."}
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-bold">
                {shop.average_rating.toFixed(1)}
              </span>
              <span className="text-yellow-600">
                ({shop.total_ratings} Rating)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4" />
              {shop.canteen.name}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <NavButton
              href={`/authenticated/kedai/${shop.id}/tagihan`}
              variant="outline"
            >
              <HandCoins />
              Buat Tagihan
            </NavButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Detail Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" /> Informasi Operasional
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/50">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Jam Operasional
                  </p>
                  <p className="text-sm font-medium">
                    {shop.open_time
                      ? format(new Date(shop.open_time), "HH:mm")
                      : "--:--"}{" "}
                    -
                    {shop.close_time
                      ? format(new Date(shop.close_time), "HH:mm")
                      : "--:--"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/50">
                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Mode Pesanan
                  </p>
                  <p className="text-sm font-medium">
                    {shop.order_mode.replace("_", " ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Metode
                Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {shop.payments.map((p: any) => (
                  <Badge
                    key={p.method}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {p.method}
                  </Badge>
                ))}
                {shop.payments.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Belum mengatur metode pembayaran.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-primary">
                Pemilik Kedai
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold">{shop.owner.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {shop.owner.user.username}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <NavButton
                href={`/authenticated/percakapan/${shop.owner.user_id}`}
                variant="outline"
                className="w-full"
              >
                <MessagesSquare />
                Lihat Percakapan
              </NavButton>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase">
                Tagihan Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shop.billings.map((bill: any) => (
                <div
                  key={bill.id}
                  className="flex justify-between items-center text-sm border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{formatRupiah(bill.total)}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(bill.start_date), "dd MMM")}
                    </p>
                  </div>
                  <Badge
                    className={
                      bill.status === "PAID" ? "bg-green-500" : "bg-orange-500"
                    }
                  >
                    {bill.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
