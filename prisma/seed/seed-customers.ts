import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function seedCustomers() {
  console.log("Memulai seeding customers...");

  const customers = [
    {
      name: "Budi Santoso",
      username: "budi",
      password: "password123",
      email: "budi@example.com",
      phone_number: "081234567890",
      referral_code: "BUDI123",
    },
    {
      name: "Siti Aminah",
      username: "siti",
      password: "password123",
      email: "siti@example.com",
      phone_number: "081234567891",
      referral_code: "SITI456",
    },
  ];

  try {
    for (const customer of customers) {
      const hashedPassword = await bcrypt.hash(customer.password, 10);

      await prisma.user.upsert({
        where: { username: customer.username },
        update: {
          name: customer.name,
          password: hashedPassword,
        },
        create: {
          name: customer.name,
          username: customer.username,
          password: hashedPassword,
          role: Role.CUSTOMER,
          customer: {
            create: {
              email: customer.email,
              phone_number: customer.phone_number,
              referral_code: customer.referral_code,
            },
          },
        },
      });
      console.log(`Customer '${customer.username}' berhasil di-seed.`);
    }

    console.log("Seeding customers selesai.");
  } catch (error) {
    console.error("Gagal melakukan seeding customers:", error);
  }
}
