"use server";

import { prisma } from "@/lib/prisma";
import {
  GenerateBillingSchema,
  type GenerateBillingInput,
} from "./billing-schema";
import { revalidatePath } from "next/cache";

const FIXED_COMMISSION_PER_ITEM = 1000;

export async function generateShopBilling(payload: GenerateBillingInput) {
  const validated = GenerateBillingSchema.parse(payload);

  try {
    // Ambil semua item dari pesanan yang selesai dalam periode tersebut
    // Kita ambil dari OrderItem karena komisi dihitung per item
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          shop_id: validated.shop_id,
          status: "COMPLETED",
          created_at: {
            gte: validated.start_date,
            lte: validated.end_date,
          },
        },
      },
      select: { quantity: true },
    });

    // Ambil semua refund yang sudah diproses dalam periode tersebut
    const refunds = await prisma.refund.findMany({
      where: {
        order: { shop_id: validated.shop_id },
        status: "PROCESSED",
        processed_at: {
          gte: validated.start_date,
          lte: validated.end_date,
        },
      },
      select: { amount: true },
    });

    // Kalkulasi Berdasarkan Rumus Baru
    // Total Komisi = Total Qty Item * 1.000
    const totalQuantity = orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalCommission = totalQuantity * FIXED_COMMISSION_PER_ITEM;

    // Total Refund (berdasarkan amount di model Refund)
    const totalRefundDeduction = refunds.reduce((sum, r) => sum + r.amount, 0);

    // Final Total = Komisi - Refund
    const grandTotal = totalCommission - totalRefundDeduction;

    const billing = await prisma.shopBilling.create({
      data: {
        shop_id: validated.shop_id,
        start_date: validated.start_date,
        end_date: validated.end_date,
        subtotal: totalCommission,
        refund: totalRefundDeduction,
        total: grandTotal,
        status: "UNPAID",
      },
    });

    revalidatePath(`/authenticated/kedai/${validated.shop_id}/tagihan`);
    return { success: true, data: billing };
  } catch (error) {
    console.error("Billing Error:", error);
    return { success: false, error: "Gagal menghitung tagihan" };
  }
}

export async function updateBillingStatus(
  id: string,
  status: "PAID" | "UNPAID"
) {
  try {
    await prisma.shopBilling.update({
      where: { id },
      data: { status },
    });
    revalidatePath(`/authenticated/kedai`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteShopBilling(id: string, shop_id: string) {
  try {
    await prisma.shopBilling.delete({
      where: { id },
    });

    revalidatePath(`/authenticated/kedai/${shop_id}/tagihan`);

    return { success: true };
  } catch (error) {
    console.error("Delete Billing Error:", error);
    return { success: false, error: "Gagal menghapus data tagihan" };
  }
}

export async function updateBillingToPaid(id: string, shop_id: string) {
  try {
    await prisma.shopBilling.update({
      where: { id },
      data: { status: "PAID" },
    });

    revalidatePath(`/authenticated/kedai/${shop_id}/tagihan`);

    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal update data" };
  }
}
