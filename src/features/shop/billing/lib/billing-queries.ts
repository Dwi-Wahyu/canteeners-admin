"use server";

import { prisma } from "@/lib/prisma";

export async function getShopBillings(shop_id: string) {
  return await prisma.shopBilling.findMany({
    where: { shop_id },
    orderBy: { start_date: "desc" },
  });
}

export async function getBillingById(id: string) {
  return await prisma.shopBilling.findUnique({
    where: { id },
    include: { shop: true },
  });
}
