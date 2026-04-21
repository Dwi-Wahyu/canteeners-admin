import { z } from "zod";

export const BannerSchema = z.object({
  order: z.coerce.number().min(0, "Urutan harus berupa angka positif"),
  file: z.string().min(1, "File banner harus diisi"),
  cta_path: z.string().nullable().optional(),
});

export type BannerInput = z.infer<typeof BannerSchema>;
