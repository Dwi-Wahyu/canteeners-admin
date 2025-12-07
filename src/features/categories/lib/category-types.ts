import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Tolong isi nama.",
  }),
  image_url: z.string(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
