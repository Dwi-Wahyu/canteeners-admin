import { getImageUrl } from "@/helper/get-image-url";
import { getUserReportById } from "@/features/violations/lib/violations-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ReportStatusForm } from "@/features/violations/ui/report-status-form";
import {
  ArrowLeft,
  Calendar,
  User,
  AlertCircle,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getUserReportById(id);

  if (!report) {
    notFound();
  }

  const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
    UNDER_REVIEW: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
    RESOLVED: "bg-green-100 text-green-800 hover:bg-green-100/80",
    REJECTED: "bg-red-100 text-red-800 hover:bg-red-100/80",
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/authenticated/laporan">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Laporan</h1>
          <p className="text-muted-foreground text-sm">
            ID Laporan: {report.id}
          </p>
        </div>
        <div className="ml-auto">
          <Badge className={statusStyles[report.status]}>
            {report.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Report Info & Proof */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Informasi Laporan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Kategori
                  </p>
                  <p className="font-semibold">{report.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Tanggal Kejadian
                  </p>
                  <p>{new Date(report.created_at).toLocaleString("id-ID")}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Deskripsi Laporan
                </p>
                <p className="text-sm bg-muted p-4 rounded-md leading-relaxed">
                  {report.description}
                </p>
              </div>

              {report.proof_url && (
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> Bukti Laporan
                  </p>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img
                      src={getImageUrl(report.proof_url)}
                      alt="Bukti Laporan"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pelapor
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      report.reporter.avatar
                        ? getImageUrl(report.reporter.avatar)
                        : undefined
                    }
                  />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{report.reporter.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.reporter.username || "Tidak ada username"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Terlapor
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-red-100">
                  <AvatarImage
                    src={
                      report.reported_user.avatar
                        ? getImageUrl(report.reported_user.avatar)
                        : undefined
                    }
                  />
                  <AvatarFallback className="bg-red-50 text-red-500">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {report.reported_user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {report.reported_user.username || "Tidak ada username"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Admin Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tindakan Admin</CardTitle>
              <CardDescription>
                Tentukan status laporan dan berikan catatan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportStatusForm
                reportId={report.id}
                currentStatus={report.status}
                currentAdminNote={report.admin_note}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
