import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { config } from "dotenv";
import { prisma } from "@/lib/prisma";

config();

const DEFAULT_AVATAR = "avatars/default-avatar.jpg";

export async function seedSuperAdmin() {
  console.log("Memulai seeding Super Admin...");

  const superadminUsername = process.env.SUPERADMIN_USERNAME;
  const superadminPassword = process.env.SUPERADMIN_PASSWORD;

  if (!superadminUsername || !superadminPassword) {
    console.error(
      "SUPERADMIN_USERNAME atau SUPERADMIN_PASSWORD tidak ditemukan di .env. Seeding dibatalkan.",
    );
    return;
  }

  try {
    // ✅ CEK APAKAH ROLE SUPERADMIN ADA
    console.log("🔍 Mengecek Role SUPERADMIN...");
    console.log("Role values:", Object.values(Role));

    const hashedPassword = await bcrypt.hash(superadminPassword, 10);

    console.log("📝 Mencoba upsert user...");

    // 🔥 PERBAIKAN: Hapus relasi admin sementara
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
