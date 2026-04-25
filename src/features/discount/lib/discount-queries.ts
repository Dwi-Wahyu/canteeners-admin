import { prisma } from "@/lib/prisma";

export async function getDiscounts() {
  return await prisma.discount.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: {
      _count: {
        select: {
          customer_discounts: true,
        },
      },
    },
  });
}

export async function getCustomers() {
  return await prisma.customer.findMany({
    include: {
      user: true,
    },
  });
}

export async function getDiscountById(id: string) {
  return await prisma.discount.findUnique({
    where: { id },
  });
}
