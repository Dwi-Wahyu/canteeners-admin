import { PrismaClient } from "@/app/generated/prisma";
import { generateCategorySlug } from "@/helper/generate-category-slug";

const prisma = new PrismaClient();

export async function seedCategories() {
  console.log("Memulai seeding kategori...");
  try {
    const categories = [
      {
        name: "Es Buah",
        image_url:
          "https://mwozu5eodkq4uc39.public.blob.vercel-storage.com/categories/es-buah.jpg",
      },
      {
        name: "Ayam Geprek",
        image_url:
          "https://mwozu5eodkq4uc39.public.blob.vercel-storage.com/categories/ayam-geprek.jpg",
      },
      {
        name: "Gorengan",
        image_url:
          "https://mwozu5eodkq4uc39.public.blob.vercel-storage.com/categories/gorengan.jpg",
      },
    ];

    for (const category of categories) {
      await prisma.category.create({
        data: {
          name: category.name,
          image_url: category.image_url,
          slug: generateCategorySlug(category.name),
        },
      });
    }
  } catch (error) {
    console.error("Gagal melakukan seeding kantin:", error);
  }
}
