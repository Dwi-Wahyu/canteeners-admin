import { seedUsers } from "./seed-users";
import { seedCanteens } from "./seed-canteens";
import { seedCategories } from "./seed-categories";
import { prisma } from "@/lib/prisma";

async function main() {
  // await prisma.user.deleteMany();
  // await prisma.canteen.deleteMany();
  // await prisma.category.deleteMany();

  await seedCanteens();
  // await seedCategories();
  // await seedUsers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
