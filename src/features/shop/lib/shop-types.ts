import { z } from "zod";

export const CreateShopSchema = z.object({
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  owner_id: z.string().min(1, "Tolong pilih owner"),
  image_url: z.string(),
  canteen_id: z.number(),
});

export type CreateShopInput = z.infer<typeof CreateShopSchema>;
