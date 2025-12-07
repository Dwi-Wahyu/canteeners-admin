import { PrismaClient } from "@/app/generated/prisma";
import { generateCategorySlug } from "@/helper/generate-category-slug";

const prisma = new PrismaClient();

export async function seedCanteens() {
  console.log("Memulai seeding kantin...");
  try {
    await prisma.canteen.createMany({
      data: [
        {
          name: "Kantin Kudapan",
          image_url: "canteens/kudapan.webp",
          slug: generateCategorySlug("Kantin Kudapan"),
        },
        {
          name: "Kantin Sastra",
          image_url: "canteens/kansas.jpeg",
          slug: generateCategorySlug("Kantin Sastra"),
        },
        {
          name: "Kantin Sosiologi",
          image_url: "canteens/kansos.webp",
          slug: generateCategorySlug("Kantin Sosiologi"),
        },
      ],
    });
  } catch (error) {
    console.error("Gagal melakukan seeding kantin:", error);
  }
}
