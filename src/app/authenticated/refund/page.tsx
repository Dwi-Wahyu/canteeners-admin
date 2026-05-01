import { getEscalatedRefunds } from "@/features/order/lib/refund-queries";
import { formatRupiah } from "@/helper/format-rupiah";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { refundReasonMapping } from "@/constants/refund-mapping";

export default async function RefundEscalatedPage() {
  const refunds = await getEscalatedRefunds();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Refund Dieskalasi</h1>
          <p className="text-muted-foreground text-sm">
            Daftar permintaan refund yang telah dieskalasi ke admin karena tidak terselesaikan antara pelanggan dan kedai.
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelanggan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kedai
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alasan Refund
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alasan Eskalasi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {refunds.map((refund) => (
              <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  #{refund.order_id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {refund.order.customer?.user.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {refund.order.shop.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <Badge variant="outline">
                    {refundReasonMapping[refund.reason as keyof typeof refundReasonMapping]}
                  </Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                  {formatRupiah(refund.amount)}
                </td>
                <td className="px-4 py-4 text-sm max-w-xs">
                   <p className="line-clamp-2" title={refund.escalated_reason || ""}>
                    {refund.escalated_reason || "-"}
                   </p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/authenticated/refund/${refund.id}`}>
                      Detail Refund
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {refunds.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">
                  Tidak ada refund yang dieskalasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
