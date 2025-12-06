"use server";

import { prisma } from "@/lib/prisma";

export async function getCanteens() {
  return await prisma.canteen.findMany();
}
