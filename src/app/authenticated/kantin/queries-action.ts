"use server";

import { PaymentMethod } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function getShopPayments(shop_id: string) {
  return await prisma.payment.findMany({
    where: {
      shop_id,
    },
  });
}

export async function getShopPayment(shop_id: string, method: PaymentMethod) {
  return await prisma.payment.findFirst({
    where: {
      shop_id,
      method,
    },
  });
}
