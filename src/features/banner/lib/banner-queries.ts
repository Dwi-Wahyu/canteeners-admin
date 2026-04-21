import { prisma } from "@/lib/prisma";

export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: {
      order: "asc",
    },
  });
}

export async function getBannerById(id: number) {
  return await prisma.banner.findUnique({
    where: {
      id,
    },
  });
}
