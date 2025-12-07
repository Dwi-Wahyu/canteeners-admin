"use server";

import { prisma } from "@/lib/prisma";
import { CreateUserInput } from "./user-types";
import bcrypt from "bcryptjs";

export async function createUser(payload: CreateUserInput) {
  try {
    const created = await prisma.user.create({
      data: {
        name: payload.name,
        username: payload.username,
        password: bcrypt.hashSync(payload.password, 10),
        role: payload.role,
      },
    });

    if (payload.role === "SHOP_OWNER" && created) {
      await prisma.owner.create({
        data: {
          user_id: created.id,
        },
      });
    }

    if (payload.role === "CUSTOMER" && created) {
      await prisma.customer.create({
        data: {
          user_id: created.id,
        },
      });
    }

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
