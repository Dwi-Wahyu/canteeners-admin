"use server";

import { prisma } from "@/lib/prisma";

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function getShopOwners() {
  return await prisma.user.findMany({
    where: {
      role: "SHOP_OWNER",
    },
  });
}
