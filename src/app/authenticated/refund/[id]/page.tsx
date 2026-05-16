import { getRefundDetail } from "@/features/order/lib/refund-queries";
import { formatRupiah } from "@/helper/format-rupiah";
import { getImageUrl } from "@/helper/get-image-url";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  refundReasonMapping,
  refundStatusMapping,
} from "@/constants/refund-mapping";
import {
  ArrowLeft,
  FileText,
  Package,
  Store,
  User,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RefundActionForm } from "@/features/order/ui/refund-action-form";

export default async function RefundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const refund = await getRefundDetail(id);

  if (!refund) {
    notFound();
  }

  const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    PROCESSED: "bg-green-100 text-green-800",
    ESCALATED: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/authenticated/refund">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Refund</h1>
          <p className="text-muted-foreground text-sm">
            ID Refund: {refund.id}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge className={statusStyles[refund.status] || ""}>
            {
              refundStatusMapping[
                refund.status as keyof typeof refundStatusMapping
              ]
            }
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Refund Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Informasi Permintaan Refund
              </CardTitle>
              <CardDescription>
                Detail alasan mengapa refund diminta dan dieskalasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Alasan Utama
                  </p>
                  <p className="font-medium">
                    {
                      refundReasonMapping[
                        refund.reason as keyof typeof refundReasonMapping
                      ]
                    }
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Jumlah Refund
                  </p>
                  <p className="font-bold text-lg text-red-600">
                    {formatRupiah(refund.amount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Metode Pengembalian
                  </p>
                  <p className="font-medium">{refund.disbursement_mode}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Diajukan Pada
                  </p>
                  <p className="font-medium">
                    {new Date(refund.requested_at).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Pesan Pelanggan
                </p>
                <p className="text-sm bg-white p-3 border rounded-md italic">
                  "{refund.description || "Tidak ada deskripsi"}"
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Alasan Eskalasi (Dari Toko)
                </p>
                <p className="text-sm bg-white p-3 border rounded-md text-orange-700 font-medium">
                  {refund.escalated_reason || "Tidak ada alasan spesifik"}
                </p>
              </div>

              {refund.complaint_proof_url && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Bukti Komplain
                  </p>
                  <div className="relative aspect-video max-w-md overflow-hidden rounded-lg border bg-white">
                    <img
                      src={getImageUrl(
                        "/complaint-proof/" + refund.complaint_proof_url,
                      )}
                      alt="Bukti Komplain"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Affected Items */}
          {refund.affected_items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Item yang Direfund
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {refund.affected_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {item.order_item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.order_item.quantity} x{" "}
                          {formatRupiah(item.order_item.price_at_add)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatRupiah(item.order_item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Refund History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Riwayat Status Refund
              </CardTitle>
              <CardDescription>
                Jejak audit pemrosesan refund ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-muted">
                {refund.history.map((log) => (
                  <div key={log.id} className="relative pl-8">
                    <div className="absolute left-0 top-1 h-5 w-5 rounded-full border-4 border-white bg-primary ring-1 ring-primary" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={statusStyles[log.status] || ""}
                        >
                          {
                            refundStatusMapping[
                              log.status as keyof typeof refundStatusMapping
                            ]
                          }
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(log.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {log.actor_name && (
                          <p className="text-xs font-medium text-primary">
                            Oleh: {log.actor_name}
                          </p>
                        )}
                        {log.note && (
                          <p className="text-sm text-muted-foreground italic bg-muted/30 p-2 rounded">
                            {log.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {refund.history.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    Belum ada riwayat aktivitas.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Ringkasan Pesanan Original
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/authenticated/order/${refund.order_id}`}
                    className="text-xs flex items-center gap-1"
                  >
                    Lihat Order <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status Pesanan</span>
                <Badge variant="outline">{refund.order.status}</Badge>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                <span>Total Harga Pesanan</span>
                <span className="text-primary">
                  {formatRupiah(refund.order.total_price)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Admin Decision */}
          <Card>
            <CardHeader>
              <CardTitle>Keputusan Admin</CardTitle>
              <CardDescription>
                Tinjau bukti dan ambil keputusan final untuk mediasi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RefundActionForm
                refundId={refund.id}
                currentStatus={refund.status}
              />
            </CardContent>
          </Card>

          {/* Customer & Shop Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">{refund.order.customer?.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {refund.order.customer?.user.username || "No username"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Store className="h-4 w-4" /> Kedai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">{refund.order.shop.name}</p>
              <p className="text-sm text-muted-foreground">
                {refund.order.shop.canteen.name}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
