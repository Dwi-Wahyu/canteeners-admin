"use server";

import { prisma } from "@/lib/prisma";
import { ShopSearchParamsType } from "@/validations/search-params/shop-search-params";

export async function getShops(params?: ShopSearchParamsType) {
  return await prisma.shop.findMany({
    where: {
      name: {
        contains: params?.name || "",
        mode: "insensitive",
      },
    },
  });
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
      orders: {
        orderBy: { created_at: "desc" },
        take: 5,
        include: {
          customer: {
            include: { user: true }
          }
        }
      }
    },
  });
}
