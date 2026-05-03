import { z } from "zod";

export const EventSchema = z.object({
  name: z.string().min(1, "Nama event harus diisi"),
  is_active: z.boolean().default(true),
});

export type EventSchemaType = z.infer<typeof EventSchema>;

export const EventSlotSchema = z.object({
  date: z.date({
    required_error: "Tanggal harus diisi",
  }),
  start_time: z.string().min(1, "Waktu mulai harus diisi"),
  end_time: z.string().min(1, "Waktu selesai harus diisi"),
  quota: z.number().min(1, "Kuota minimal 1"),
  event_id: z.number(),
});

export type EventSlotSchemaType = z.infer<typeof EventSlotSchema>;
