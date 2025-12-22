"use server";

import { prisma } from "@/lib/prisma";

export async function getFaqs() {
  return await prisma.faq.findMany({
    orderBy: {
      id: "desc",
    },
  });
}

export async function getFaqById(id: number) {
  return await prisma.faq.findUnique({
    where: { id },
  });
}
