"use server";

import { prisma } from "@/lib/prisma";
import { UserSearchParamsInput } from "../types/user-search-params";
import { Prisma, Role } from "@/generated/prisma";

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

export default async function getUsersDataByRole(
  searchParams: UserSearchParamsInput,
  role: Role
) {
  type WhereClause = Prisma.UserWhereInput;
  let whereClause: WhereClause = {
    role,
  };

  if (searchParams.name) {
    whereClause["name"] = {
      contains: searchParams.name,
    };
  }

  const filtered = await prisma.user.count({
    where: whereClause,
  });

  const data = await prisma.user.findMany({
    take: searchParams.perPage,
    skip: (searchParams.page - 1) * searchParams.perPage,
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    include: {
      owner: {
        select: {
          shop: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const pageCount = Math.ceil(filtered / searchParams.perPage);

  return { data, pageCount, filtered };
}
