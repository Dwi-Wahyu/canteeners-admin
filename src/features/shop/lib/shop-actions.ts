"use server";

import { prisma } from "@/lib/prisma";
import { CreateShopInput } from "./shop-types";
import { Prisma } from "@prisma/client";

export async function createShop(payload: CreateShopInput) {
  try {
    await prisma.shop.create({
      data: payload,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          success: false,
          message: "Kantin atau Pemilik tidak ditemukan.",
        };
      }
    }

    return {
      success: false,
      message: "Gagal membuat kedai. Silakan coba lagi.",
    };
  }
}
