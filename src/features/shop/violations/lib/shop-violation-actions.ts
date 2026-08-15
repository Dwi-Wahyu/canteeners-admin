"use server";

import { prisma } from "@/lib/prisma";
import { ShopViolationType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { shopViolationTitleMapping } from "@/constants/shop-violation-mapping";

interface CreateShopViolationInput {
  shop_id: string;
  type: ShopViolationType;
  note?: string;
  order_id?: string;
  refund_id?: string;
  reviewed_by: string;
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

      await prisma.notification.create({
        data: {
          recipient_id: shop.owner.user_id,
          type: "COMPLAINT",
          subtype: "VIOLATION_CREATED",
          title: `Catatan Pelanggaran: ${title}`,
          body:
            input.note ??
            "Kedai Anda menerima catatan pelanggaran baru dari admin. Periksa halaman pelanggaran untuk informasi lebih lanjut.",
          data: {
            resourcePath: `/dashboard-kedai/pelanggaran`,
            violation_id: violation.id,
            shop_id: input.shop_id,
          },
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
