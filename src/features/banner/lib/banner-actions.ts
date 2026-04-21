"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BannerInput } from "../types/banner-schema";

export async function createBanner(payload: BannerInput) {
  try {
    await prisma.banner.create({
      data: {
        order: payload.order,
        file: payload.file,
        cta_path: payload.cta_path,
      },
    });

    revalidatePath("/authenticated/banner");
    return { success: true };
  } catch (error) {
    console.error("Error creating banner:", error);
    return { success: false, error: "Gagal membuat banner" };
  }
}

export async function updateBanner(id: number, payload: BannerInput) {
  try {
    await prisma.banner.update({
      where: { id },
      data: {
        order: payload.order,
        file: payload.file,
        cta_path: payload.cta_path,
      },
    });

    revalidatePath("/authenticated/banner");
    return { success: true };
  } catch (error) {
    console.error("Error updating banner:", error);
    return { success: false, error: "Gagal memperbarui banner" };
  }
}

export async function deleteBanner(id: number) {
  try {
    await prisma.banner.delete({
      where: { id },
    });

    revalidatePath("/authenticated/banner");
    return { success: true };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return { success: false, error: "Gagal menghapus banner" };
  }
}
