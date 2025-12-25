import { Button } from "@/components/ui/button";
import { getUserReports } from "@/features/violations/lib/violations-queries";

export default async function PelaporanPage() {
  const reports = await getUserReports();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Laporan Pengguna
          </h1>
          <p className="text-muted-foreground text-sm">
            Daftar laporan yang diajukan oleh pengguna dalam sistem.
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pelapor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Terlapor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kategori
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
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
            {reports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  {report.reporter.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {report.reported_user.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                    {report.category}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-4">
                  <Button size={"sm"}>Detail</Button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada laporan yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Komponen Kecil untuk Badge Status
function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    UNDER_REVIEW: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        statusStyles[status] || "bg-gray-100"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
