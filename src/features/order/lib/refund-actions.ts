"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/config/auth";
import { RefundStatus } from "@/generated/prisma";
import { syncRefundToFirestore } from "@/lib/firebase/sync-refund";

export async function updateRefundStatus(
  id: string,
  status: RefundStatus,
  rejected_reason?: string,
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const refund = await prisma.refund.findUnique({
      where: { id },
      select: { order_id: true },
    });

    if (!refund) {
      return { success: false, error: "Refund tidak ditemukan" };
    }

    await prisma.$transaction([
      prisma.refund.update({
        where: { id },
        data: {
          status,
          rejected_reason: status === "REJECTED" ? rejected_reason : null,
          processed_at:
            status === "PROCESSED" ||
            status === "APPROVED" ||
            status === "REJECTED"
              ? new Date()
              : undefined,
        },
      }),
      prisma.refundHistory.create({
        data: {
          refund_id: id,
          status,
          note:
            status === "REJECTED"
              ? rejected_reason
              : `Admin memproses refund ke status ${status}`,
          actor_id: session.user.id,
          actor_name: session.user.name,
        },
      }),
    ]);

    // Sync to Firestore for real-time update on customer & shop side
    await syncRefundToFirestore(id, {
      status: status as string,
    });

    revalidatePath("/authenticated/refund");
    revalidatePath(`/authenticated/refund/${id}`);
    revalidatePath(`/authenticated/order/${refund.order_id}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update refund status:", error);
    return { success: false, error: "Gagal memperbarui status refund" };
  }
}
