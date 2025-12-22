import { z } from "zod";

export const FaqSchema = z.object({
  question: z.string().min(1, {
    message: "Pertanyaan wajib diisi.",
  }),
  answer: z.string().min(1, {
    message: "Jawaban wajib diisi.",
  }),
});

export type FaqInput = z.infer<typeof FaqSchema>;
