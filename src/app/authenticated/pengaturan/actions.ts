"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { orderQueue } from "@/lib/queue";

export async function updateGlobalSetting(key: string, value: string) {
  try {
    // 1. Save / Update to Database
    await prisma.globalSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // 2. Update Redis Cache immediately so main app and worker get instant updates
    const redis = await orderQueue.client;
    if (redis && typeof redis.set === "function") {
      await redis.set(`setting:${key}`, value);
    }

    revalidatePath("/authenticated/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("Update Setting Error:", error);
    return { success: false, message: "Gagal memperbarui pengaturan" };
  }
}
