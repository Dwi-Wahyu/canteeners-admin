"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/config/auth";

async function checkSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") {
    throw new Error("Unauthorized: Only SUPERADMIN can perform this action");
  }
}

export async function getAppTestimonies() {
  try {
    return await prisma.appTestimony.findMany({
      orderBy: {
        order: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    return [];
  }
}

export async function updateTestimonyOrder(items: { id: number; order: number }[]) {
  try {
    await checkSuperAdmin();
    
    // Using a transaction to ensure all updates succeed or none
    await prisma.$transaction(
      items.map((item) =>
        prisma.appTestimony.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/authenticated/testimony");
    return { success: true };
  } catch (error) {
    console.error("Error updating testimony order:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal memperbarui urutan testimoni" };
  }
}

export async function deleteAppTestimony(id: number) {
  try {
    await checkSuperAdmin();
    
    await prisma.appTestimony.delete({
      where: { id },
    });

    revalidatePath("/authenticated/testimony");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimony:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal menghapus testimoni" };
  }
}
