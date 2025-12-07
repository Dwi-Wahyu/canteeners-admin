import { z } from "zod";
import { getShopOwners, getUsers } from "./user-queries";

export const CreateUserSchema = z.object({
  username: z.string().min(1, "Tolong isi username"),
  password: z.string().min(5, "Password minimal 5 karakter"),
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  avatar: z.string(),
  role: z.enum(["ADMIN", "CUSTOMER", "SHOP_OWNER"]),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  id: z.string(),
  username: z.string().min(1, "Tolong isi username"),
  password: z.string().optional(),
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  avatar: z.string(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// queries return type

export type GetUsers = Awaited<ReturnType<typeof getUsers>>;
export type GetShopOwners = Awaited<ReturnType<typeof getShopOwners>>;
