import { getEscalatedComplaints } from "@/features/order/lib/complaint-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { orderComplaintStatusMapping } from "@/constants/order-complaint-status-mapping";

export default async function ComplaintEscalatedPage() {
  const complaints = await getEscalatedComplaints();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Komplain Dieskalasi</h1>
          <p className="text-muted-foreground text-sm">
            Daftar komplain pelanggan yang telah dieskalasi ke admin karena membutuhkan mediasi pihak ketiga.
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
                Penyebab Komplain
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  #{complaint.order_id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {complaint.order.customer?.user.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {complaint.order.shop.name}
                </td>
                <td className="px-4 py-4 text-sm max-w-xs">
                  <p className="line-clamp-2" title={complaint.cause}>
                    {complaint.cause}
                  </p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <Badge variant="destructive" className="bg-red-600">
                    {orderComplaintStatusMapping[complaint.status as keyof typeof orderComplaintStatusMapping]}
                  </Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(complaint.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/authenticated/order/${complaint.order_id}`}>
                      Detail Order
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">
                  Tidak ada komplain yang dieskalasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
