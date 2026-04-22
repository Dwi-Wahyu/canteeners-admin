"use server";

import { prisma } from "@/lib/prisma";

export async function getShops() {
  return prisma.shop.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
