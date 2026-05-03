"use server";

import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import { ChangePasswordSchema, ChangePasswordSchemaType } from "@/validations/schemas/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function changePassword(payload: ChangePasswordSchemaType) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Anda harus login untuk mengganti kata sandi.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return {
        success: false,
        message: "Pengguna tidak ditemukan.",
      };
    }

    const isPasswordMatch = await bcrypt.compare(
      payload.current_password,
      user.password
    );

    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Kata sandi saat ini salah.",
        errors: {
          current_password: ["Kata sandi saat ini salah."],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(payload.new_password, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    revalidatePath("/authenticated/ganti-password");

    return {
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengganti kata sandi.",
    };
  }
}
