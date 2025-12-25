"use server";

import { Prisma } from "@/generated/prisma";
import { OrderSearchParamsInput } from "../types/order-search-params";
import { prisma } from "@/lib/prisma";

export async function getOrders(searchParams: OrderSearchParamsInput) {
  type WhereClause = Prisma.OrderWhereInput;
  let whereClause: WhereClause = {};

  // if (searchParams.name) {
  //   whereClause["customer"] = {
  //     contains: searchParams.name,
  //   };
  // }

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
