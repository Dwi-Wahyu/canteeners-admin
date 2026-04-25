"use server";

import { OrderStatus, PaymentMethod, Prisma } from "@/generated/prisma";
import { OrderSearchParamsInput } from "../types/order-search-params";
import { prisma } from "@/lib/prisma";

export async function getOrders(searchParams: OrderSearchParamsInput) {
  type WhereClause = Prisma.OrderWhereInput;
  const whereClause: WhereClause = {};

  if (searchParams.shop_id) {
    whereClause.shop_id = searchParams.shop_id;
  }

  if (searchParams.status) {
    whereClause.status = searchParams.status as OrderStatus;
  }

  if (searchParams.payment_method) {
    whereClause.payment_method = searchParams.payment_method as PaymentMethod;
  }

  if (searchParams.name) {
    whereClause.customer = {
      user: {
        name: {
          contains: searchParams.name,
          mode: "insensitive",
        },
      },
    };
  }

  const filtered = await prisma.order.count({
    where: whereClause,
  });

  const data = await prisma.order.findMany({
    take: searchParams.perPage,
    skip: (searchParams.page - 1) * searchParams.perPage,
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      status: true,
      total_price: true,
      created_at: true,
      payment_method: true,
      order_items: {
        select: {
          quantity: true,
        },
      },
      customer: {
        select: {
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
  });

  const pageCount = Math.ceil(filtered / searchParams.perPage);

  return { data, pageCount, filtered };
}

export async function getOrderDetail(id: string) {
  return await prisma.order.findUnique({
    where: { id },
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
          selected_options: true,
        },
      },
      applied_discounts: true,
      testimony: true,
      complaint: true,
      refund: true,
    },
  });
}
