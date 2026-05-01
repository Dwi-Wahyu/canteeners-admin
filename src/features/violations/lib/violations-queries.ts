"use server";

import { prisma } from "@/lib/prisma";

export async function getUserReports() {
  return await prisma.userReport.findMany({
    include: {
      reporter: {
        select: {
          name: true,
        },
      },
      reported_user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getUserReportById(id: string) {
  return await prisma.userReport.findUnique({
    where: { id },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          avatar: true,
          username: true,
        },
      },
      reported_user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          username: true,
        },
      },
    },
  });
}
