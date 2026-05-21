"use server";

import { prisma } from "@/lib/prisma";
import { ShopViolationType } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/firebase/fcm-helper";

import { shopViolationTitleMapping } from "@/constants/shop-violation-mapping";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

interface CreateShopViolationInput {
  shop_id: string;
  type: ShopViolationType;
  note?: string;
  order_id?: string;
  refund_id?: string;
  reviewed_by: string; // admin user_id dari session
}

export async function createShopViolation(input: CreateShopViolationInput) {
  try {
    const violation = await prisma.shopViolation.create({
      data: {
        shop_id: input.shop_id,
        type: input.type,
        source: "ADMIN",
        note: input.note,
        order_id: input.order_id || null,
        refund_id: input.refund_id || null,
        reviewed_by: input.reviewed_by,
        reviewed_at: new Date(),
      },
    });

    // Kirim push notification ke pemilik kedai
    // Ambil user_id pemilik kedai
    const shop = await prisma.shop.findUnique({
      where: { id: input.shop_id },
      include: {
        owner: {
          select: { user_id: true },
        },
      },
    });

    if (shop?.owner?.user_id) {
      const title = shopViolationTitleMapping[input.type] ?? "Pelanggaran Baru";

      // Notifikasi Firestore
      await adminDb.collection("notifications").add({
        recipientId: shop.owner.user_id,
        type: "SHOP_VIOLATION",
        subType: "CREATED",
        title: `Catatan Pelanggaran: ${title}`,
        body:
          input.note ??
          "Kedai Anda menerima catatan pelanggaran baru dari admin. Periksa halaman pelanggaran untuk informasi lebih lanjut.",
        isRead: false,
        intent: "WARNING",
        resourcePath: `/dashboard-kedai/pelanggaran`,
        createdAt: FieldValue.serverTimestamp(),
        senderInfo: {
          name: "Sistem Admin",
        },
      });

      // Push Notification FCM
      await sendPushNotification({
        userId: shop.owner.user_id,
        title: `Catatan Pelanggaran: ${title}`,
        body:
          input.note ??
          "Kedai Anda menerima catatan pelanggaran baru dari admin. Periksa halaman pelanggaran untuk informasi lebih lanjut.",
        data: {
          type: "SHOP_VIOLATION",
          violation_id: violation.id,
          shop_id: input.shop_id,
        },
      });
    }

    revalidatePath(`/authenticated/kedai/${input.shop_id}`);
    revalidatePath(`/authenticated/pelanggaran-mitra`);

    return { success: true, violation };
  } catch (error) {
    console.error("Failed to create shop violation:", error);
    return { success: false, error: "Gagal mencatat pelanggaran" };
  }
}

export async function deleteShopViolation(id: string, shop_id: string) {
  try {
    await prisma.shopViolation.delete({ where: { id } });
    revalidatePath(`/authenticated/kedai/${shop_id}`);
    revalidatePath(`/authenticated/pelanggaran-mitra`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete shop violation:", error);
    return { success: false, error: "Gagal menghapus pelanggaran" };
  }
}
