"use server";

import { prisma } from "@/lib/prisma";
import { ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateReportStatus(id: string, status: ReportStatus, admin_note?: string) {
  try {
    await prisma.userReport.update({
      where: { id },
      data: {
        status,
        admin_note,
      },
    });

    revalidatePath("/authenticated/laporan");
    revalidatePath(`/authenticated/laporan/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update report status:", error);
    return { success: false, error: "Gagal memperbarui status laporan" };
  }
}
