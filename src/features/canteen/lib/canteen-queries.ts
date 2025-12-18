"use server";

import { prisma } from "@/lib/prisma";

export async function getCanteens() {
  return await prisma.canteen.findMany();
}

export async function getCanteenById(id: number) {
  return await prisma.canteen.findUnique({
    where: {
      id,
    },
  });
}
