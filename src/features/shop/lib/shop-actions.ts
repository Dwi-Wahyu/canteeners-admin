"use server";

import { prisma } from "@/lib/prisma";
import { CreateShopInput } from "./shop-types";
import { Prisma, ShopViolationType } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/firebase/fcm-helper";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { createShopViolation } from "../violations/lib/shop-violation-actions";

export async function createShop(payload: CreateShopInput) {
  try {
    await prisma.shop.create({
      data: payload,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          success: false,
          message: "Kantin atau Pemilik tidak ditemukan.",
        };
      }
    }

    return {
      success: false,
      message: "Gagal membuat kedai. Silakan coba lagi.",
    };
  }
}

export async function suspendShop({
  shopId,
  reason,
  adminUserId,
  createViolation,
  violationType,
  violationNote,
}: {
  shopId: string;
  reason: string;
  adminUserId: string;
  createViolation?: boolean;
  violationType?: ShopViolationType;
  violationNote?: string;
}) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        owner: {
          select: { user_id: true },
        },
      },
    });

    if (!shop) {
      return { success: false, message: "Kedai tidak ditemukan" };
    }

    await prisma.shop.update({
      where: { id: shopId },
      data: {
        status: "SUSPENDED",
        suspended_reason: reason,
      },
    });

    if (createViolation && violationType) {
      await createShopViolation({
        shop_id: shopId,
        type: violationType,
        note: violationNote || reason,
        reviewed_by: adminUserId,
      });
    }

    if (shop.owner?.user_id) {
      // Notifikasi Firestore
      await adminDb.collection("notifications").add({
        recipientId: shop.owner.user_id,
        type: "SHOP_VIOLATION",
        subType: "SUSPENDED",
        title: "🛑 Kedai Anda Dinonaktifkan Sementara",
        body: `Kedai ditangguhkan oleh admin dengan alasan: ${reason}`,
        isRead: false,
        intent: "ERROR",
        resourcePath: `/dashboard-kedai/pelanggaran`,
        createdAt: FieldValue.serverTimestamp(),
        senderInfo: {
          name: "Sistem Admin",
        },
      });

      // Push Notification FCM
      await sendPushNotification({
        userId: shop.owner.user_id,
        title: "🛑 Kedai Anda Dinonaktifkan Sementara",
        body: `Kedai ditangguhkan oleh admin dengan alasan: ${reason}`,
        data: {
          type: "INFO",
        },
      });
    }

    revalidatePath(`/authenticated/kedai/${shopId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to suspend shop:", error);
    return { success: false, message: "Gagal menonaktifkan kedai" };
  }
}

export async function unsuspendShop({ shopId }: { shopId: string }) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        owner: {
          select: { user_id: true },
        },
      },
    });

    if (!shop) {
      return { success: false, message: "Kedai tidak ditemukan" };
    }

    await prisma.shop.update({
      where: { id: shopId },
      data: {
        status: "INACTIVE",
        suspended_reason: null,
      },
    });

    if (shop.owner?.user_id) {
      // Notifikasi Firestore
      await adminDb.collection("notifications").add({
        recipientId: shop.owner.user_id,
        type: "SHOP_VIOLATION",
        subType: "SUSPENDED",
        title: "✅ Kedai Anda Telah Diaktifkan Kembali",
        body: "Penangguhan kedai telah dicabut. Anda dapat kembali beroperasi.",
        isRead: false,
        intent: "SUCCESS",
        resourcePath: `/dashboard-kedai/pelanggaran`,
        createdAt: FieldValue.serverTimestamp(),
        senderInfo: {
          name: "Sistem Admin",
        },
      });

      // Push Notification FCM
      await sendPushNotification({
        userId: shop.owner.user_id,
        title: "✅ Kedai Anda Telah Diaktifkan Kembali",
        body: "Penangguhan kedai telah dicabut. Anda dapat kembali beroperasi.",
        data: {
          type: "INFO",
        },
      });
    }

    revalidatePath(`/authenticated/kedai/${shopId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to unsuspend shop:", error);
    return { success: false, message: "Gagal mengaktifkan kembali kedai" };
  }
}
