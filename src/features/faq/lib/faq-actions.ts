"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FaqInput } from "../types/faq-schema";

export async function createFaq(payload: FaqInput) {
  try {
    await prisma.faq.create({
      data: payload,
    });

    revalidatePath("/authenticated/faq");
    return { success: true };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return { success: false, error: "Gagal membuat FAQ" };
  }
}

export async function updateFaq(id: number, payload: FaqInput) {
  try {
    await prisma.faq.update({
      where: { id },
      data: payload,
    });

    revalidatePath("/authenticated/faq");
    return { success: true };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return { success: false, error: "Gagal mengupdate FAQ" };
  }
}

export async function deleteFaq(id: number) {
  try {
    await prisma.faq.delete({
      where: { id },
    });

    revalidatePath("/authenticated/faq");
    return { success: true };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return { success: false, error: "Gagal menghapus FAQ" };
  }
}
