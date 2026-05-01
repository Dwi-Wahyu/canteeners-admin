"use server";

import { prisma } from "@/lib/prisma";
import { RefundStatus } from "@prisma/client";

export async function getEscalatedRefunds() {
  return await prisma.refund.findMany({
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
      requested_at: "desc",
    },
  });
}

export async function getRefundDetail(id: string) {
  return await prisma.refund.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: {
            include: {
              user: true,
            },
          },
          shop: {
            include: {
              canteen: true,
            },
          },
          order_items: {
            include: {
              product: true,
            },
          },
        },
      },
      affected_items: {
        include: {
          order_item: {
            include: {
              product: true,
            },
          },
        },
      },
      history: {
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
}
