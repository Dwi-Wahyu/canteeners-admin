"use server";

import { prisma } from "@/lib/prisma";

export async function getShopViolations(shop_id: string) {
  return await prisma.shopViolation.findMany({
    where: { shop_id },
    orderBy: { created_at: "desc" },
  });
}

export async function getShopViolationById(id: string) {
  return await prisma.shopViolation.findUnique({
    where: { id },
    include: {
      shop: { select: { id: true, name: true } },
      order: { select: { id: true } },
      refund: { select: { id: true } },
    },
  });
}
