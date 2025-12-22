"use server";

import { prisma } from "@/lib/prisma";

export async function getShops() {
  return await prisma.shop.findMany();
}

export async function getShopById(id: string) {
  return await prisma.shop.findFirst({
    where: {
      id,
    },
  });
}
