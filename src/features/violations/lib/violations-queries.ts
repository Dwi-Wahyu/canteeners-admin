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
  });
}
