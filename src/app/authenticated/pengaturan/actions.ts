"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { orderQueue } from "@/lib/queue"; // Make sure to add this import if needed or use redis directly

export async function updateGlobalSetting(key: string, value: string) {
  try {
    await prisma.globalSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // Update Redis cache
    const redis = await orderQueue.client;
    await redis.set(`setting:${key}`, value);

    revalidatePath("/authenticated/pengaturan");
    return { success: true };
  } catch (error) {
    console.error("Update Setting Error:", error);
    return { success: false, message: "Gagal memperbarui pengaturan" };
  }
}
