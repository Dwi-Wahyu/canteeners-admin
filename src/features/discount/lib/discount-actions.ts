"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DiscountStatus } from "@prisma/client";
import { CreateDiscountInput } from "./discount-types";

export async function assignVoucherToCustomers(
  discountId: string,
  customerIds: string[],
) {
  try {
    const data = customerIds.map((customerId) => ({
      discount_id: discountId,
      customer_id: customerId,
    }));

    await prisma.customerDiscount.createMany({
      data,
    });

    revalidatePath("/authenticated/voucher");
    return {
      success: true,
      message: "Voucher berhasil diberikan ke pelanggan",
    };
  } catch (error) {
    console.error("Error assigning voucher:", error);
    return { success: false, message: "Gagal memberikan voucher" };
  }
}

export async function deleteDiscount(id: string) {
  try {
    await prisma.discount.delete({
      where: { id },
    });

    revalidatePath("/authenticated/voucher");
    return { success: true, message: "Discount berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting discount:", error);
    return { success: false, message: "Gagal menghapus discount" };
  }
}

export async function toggleDiscountStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await prisma.discount.update({
      where: { id },
      data: { status: newStatus as DiscountStatus },
    });

    revalidatePath("/authenticated/voucher");
    return {
      success: true,
      message: `Discount berhasil ${newStatus === "ACTIVE" ? "diaktifkan" : "dinonaktifkan"}`,
    };
  } catch (error) {
    console.error("Error toggling discount status:", error);
    return { success: false, message: "Gagal mengubah status discount" };
  }
}

export async function createDiscount(data: CreateDiscountInput) {
  try {
    await prisma.discount.create({
      data: {
        ...data,
        status: "ACTIVE",
      },
    });

    revalidatePath("/authenticated/voucher");
    return { success: true, message: "Discount berhasil dibuat" };
  } catch (error) {
    console.error("Error creating discount:", error);
    return { success: false, message: "Gagal membuat discount" };
  }
}

export async function updateDiscount(id: string, data: CreateDiscountInput) {
  try {
    await prisma.discount.update({
      where: { id },
      data,
    });

    revalidatePath("/authenticated/voucher");
    return { success: true, message: "Discount berhasil diperbarui" };
  } catch (error) {
    console.error("Error updating discount:", error);
    return { success: false, message: "Gagal memperbarui discount" };
  }
}

export async function revokeVoucherFromCustomer(customerDiscountId: string) {
  try {
    const customerDiscount = await prisma.customerDiscount.delete({
      where: { id: customerDiscountId },
      include: {
        discount: true,
      },
    });

    revalidatePath(
      `/authenticated/voucher/${customerDiscount.discount_id}/owners`,
    );
    return {
      success: true,
      message: "Voucher berhasil dicabut dari pelanggan",
    };
  } catch (error) {
    console.error("Error revoking voucher:", error);
    return { success: false, message: "Gagal mencabut voucher" };
  }
}
