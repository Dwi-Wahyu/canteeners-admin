import { prisma } from "@/lib/prisma";

export async function getAppTestimonies() {
  return await prisma.appTestimony.findMany({
    orderBy: {
      order: "asc",
    },
  });
}
