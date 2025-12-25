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

export async function getShopDetail(id: string) {
  return await prisma.shop.findUnique({
    where: { id },
    include: {
      owner: {
        include: { user: true },
      },
      canteen: true,
      payments: true,
      billings: {
        orderBy: { start_date: "desc" },
        take: 5, // Mengambil 5 tagihan terakhir
      },
    },
  });
}
