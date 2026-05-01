"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateReportStatus } from "@/features/violations/lib/violations-actions";
import { ReportStatus } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ReportStatusFormProps {
  reportId: string;
  currentStatus: ReportStatus;
  currentAdminNote: string | null;
}

export function ReportStatusForm({
  reportId,
  currentStatus,
  currentAdminNote,
}: ReportStatusFormProps) {
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [adminNote, setAdminNote] = useState(currentAdminNote || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateReportStatus(reportId, status, adminNote);

    if (result.success) {
      toast.success("Status laporan berhasil diperbarui");
    } else {
      toast.error(result.error || "Gagal memperbarui status laporan");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Status Laporan</label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as ReportStatus)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Menunggu (Pending)</SelectItem>
            <SelectItem value="UNDER_REVIEW">Sedang Ditinjau</SelectItem>
            <SelectItem value="RESOLVED">Selesai (Resolved)</SelectItem>
            <SelectItem value="REJECTED">Ditolak (Rejected)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Catatan Admin</label>
        <Textarea
          placeholder="Tambahkan catatan untuk pelapor atau alasan penolakan..."
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Simpan Perubahan
      </Button>
    </form>
  );
}
