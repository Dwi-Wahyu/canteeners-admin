"use server";

import { prisma } from "@/lib/prisma";

export async function getEscalatedComplaints() {
  return await prisma.shopComplaint.findMany({
    where: {
      status: "ESCALATED",
    },
    include: {
      order: {
        include: {
          customer: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          shop: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}
