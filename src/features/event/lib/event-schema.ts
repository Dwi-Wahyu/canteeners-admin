import { z } from "zod";

export const EventSchema = z.object({
  name: z.string().min(1, "Nama event harus diisi"),
  is_active: z.boolean(),
});

export type EventSchemaType = z.infer<typeof EventSchema>;

export const EventSlotSchema = z.object({
  date: z.date({
    message: "Tanggal harus diisi",
  }),
  start_time: z
    .string()
    .min(1, "Waktu mulai harus diisi")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format waktu harus HH:mm"),
  end_time: z
    .string()
    .min(1, "Waktu selesai harus diisi")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format waktu harus HH:mm"),
  quota: z.number().min(1, "Kuota minimal 1"),
  event_id: z.number(),
});

export type EventSlotSchemaType = z.infer<typeof EventSlotSchema>;
