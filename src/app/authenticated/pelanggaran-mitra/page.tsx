import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { shopViolationTitleMapping } from "@/constants/shop-violation-mapping";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteViolationButton } from "@/features/shop/violations/ui/delete-violation-button";

export default async function PelanggaranMitraPage() {
  const violations = await prisma.shopViolation.findMany({
    orderBy: { created_at: "desc" },
    include: {
      shop: { select: { id: true, name: true } },
    },
    take: 100,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pelanggaran Mitra</h1>
        <p className="text-muted-foreground text-sm">
          Riwayat catatan pelanggaran seluruh kedai dalam sistem.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kedai
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Jenis Pelanggaran
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sumber
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {violations.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium">{v.shop.name}</td>
                <td className="px-4 py-4 text-sm">
                  {shopViolationTitleMapping[v.type] ?? v.type}
                </td>
                <td className="px-4 py-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs">
                    {v.source}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {format(new Date(v.created_at), "d MMM yyyy, HH:mm", {
                    locale: idLocale,
                  })}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/authenticated/kedai/${v.shop.id}`}>
                        Lihat Kedai
                      </Link>
                    </Button>
                    <DeleteViolationButton id={v.id} shopId={v.shop.id} />
                  </div>
                </td>
              </tr>
            ))}
            {violations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada catatan pelanggaran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
