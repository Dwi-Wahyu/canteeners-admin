"use server";

import { prisma } from "@/lib/prisma";
import { CreateUserInput } from "./user-types";
import bcrypt from "bcryptjs";
import { auth } from "@/config/auth";
import { adminAuth } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

async function checkSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") {
    throw new Error("Unauthorized: Only SUPERADMIN can perform this action");
  }
}

export async function createUser(payload: CreateUserInput) {
  try {
    const created = await prisma.user.create({
      data: {
        name: payload.name,
        username: payload.username,
        password: bcrypt.hashSync(payload.password, 10),
        role: payload.role,
      },
    });

    if (payload.role === "SHOP_OWNER" && created) {
      await prisma.owner.create({
        data: {
          user_id: created.id,
        },
      });
    }

    if (payload.role === "CUSTOMER" && created) {
      await prisma.customer.create({
        data: {
          user_id: created.id,
        },
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
}

export async function deleteUser(id: string) {
  try {
    await checkSuperAdmin();

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, error: { message: "User tidak ditemukan" } };
    }

    // Jika role customer atau owner, hapus dari firebase auth
    if (user.role === "CUSTOMER" || user.role === "SHOP_OWNER") {
      try {
        await adminAuth.deleteUser(id);
      } catch (error: any) {
        // Abaikan jika user tidak ada di firebase
        if (error.code !== "auth/user-not-found") {
          console.error("Firebase Auth delete error:", error);
        }
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/authenticated/users/customer");
    revalidatePath("/authenticated/users/pemilik-kedai");

    return {
      success: true,
      message: "User berhasil dihapus",
    };
  } catch (error: any) {
    console.error("Delete user error:", error);
    return {
      success: false,
      error: { message: error.message || "Gagal menghapus user" },
    };
  }
}
