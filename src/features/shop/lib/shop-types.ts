import { z } from "zod";

export const CreateShopSchema = z.object({
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  owner_id: z.string().min(1, "Tolong pilih owner"),
  image_url: z.string(),
  canteen_id: z.number({
    required_error: "Tolong pilih kantin.",
    invalid_type_error: "Tolong pilih kantin.",
  }),
});

export type CreateShopInput = z.infer<typeof CreateShopSchema>;
