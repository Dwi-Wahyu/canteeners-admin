"use server";

import { prisma } from "@/lib/prisma";
import { CreateShopInput } from "./shop-types";

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

    return {
      success: false,
    };
  }
}
