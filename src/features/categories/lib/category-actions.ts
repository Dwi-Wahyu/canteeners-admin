"use server";

import { prisma } from "@/lib/prisma";
import { CreateCategoryInput } from "./category-types";
import { generateCategorySlug } from "@/helper/generate-category-slug";
import { revalidatePath } from "next/cache";

export async function createCategory(payload: CreateCategoryInput) {
  try {
    await prisma.category.create({
      data: {
        slug: generateCategorySlug(payload.name),
        ...payload,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/authenticated/kategori");

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
}
