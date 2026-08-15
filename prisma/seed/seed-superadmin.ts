import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { config } from "dotenv";
import { prisma } from "@/lib/prisma";

config();

const DEFAULT_AVATAR = "avatars/default-avatar.jpg";

export async function seedSuperAdmin() {
  console.log("Memulai seeding Super Admin & Admin...");

  const superadminUsername = process.env.SUPERADMIN_USERNAME;
  const superadminPassword = process.env.SUPERADMIN_PASSWORD;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!superadminUsername || !superadminPassword) {
    console.error(
      "SUPERADMIN_USERNAME atau SUPERADMIN_PASSWORD tidak ditemukan di .env. Seeding Super Admin dibatalkan.",
    );
  } else {
    try {
      console.log("🔍 Mengecek Role SUPERADMIN...");
      console.log("Role values:", Object.values(Role));

      const hashedPassword = await bcrypt.hash(superadminPassword, 10);

      console.log("📝 Mencoba upsert Super Admin...");

      const result = await prisma.user.upsert({
        where: { username: superadminUsername },
        update: {
          password: hashedPassword,
          role: Role.SUPERADMIN,
          updated_at: new Date(),
        },
        create: {
          name: "Super Admin",
          username: superadminUsername,
          password: hashedPassword,
          role: Role.SUPERADMIN,
          avatar: DEFAULT_AVATAR,
          admin: {
            create: {},
          },
        },
      });

      console.log(`✅ Super Admin '${superadminUsername}' berhasil di-seed.`);
      console.log("User ID:", result.id);
    } catch (error: any) {
      console.error("❌ Gagal melakukan seeding Super Admin:");
      console.error("Message:", error.message);
      console.error("Code:", error.code);
      console.error("Meta:", error.meta);
      console.error("Stack:", error.stack);
      throw error;
    }
  }

  if (!adminUsername || !adminPassword) {
    console.error(
      "ADMIN_USERNAME atau ADMIN_PASSWORD tidak ditemukan di .env. Seeding Admin dibatalkan.",
    );
  } else {
    try {
      console.log("🔍 Mengecek Role ADMIN...");

      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

      console.log("📝 Mencoba upsert Admin...");

      const adminResult = await prisma.user.upsert({
        where: { username: adminUsername },
        update: {
          password: hashedAdminPassword,
          role: Role.ADMIN,
          updated_at: new Date(),
        },
        create: {
          name: "Admin",
          username: adminUsername,
          password: hashedAdminPassword,
          role: Role.ADMIN,
          avatar: DEFAULT_AVATAR,
          admin: {
            create: {},
          },
        },
      });

      console.log(`✅ Admin '${adminUsername}' berhasil di-seed.`);
      console.log("User ID:", adminResult.id);
    } catch (error: any) {
      console.error("❌ Gagal melakukan seeding Admin:");
      console.error("Message:", error.message);
      console.error("Code:", error.code);
      console.error("Meta:", error.meta);
      console.error("Stack:", error.stack);
      throw error;
    }
  }
}

if (require.main === module) {
  seedSuperAdmin()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
