import z from "zod";

const PaymentMethodEnum = z.enum(["QRIS", "BANK_TRANSFER", "CASH"]);

export const PaymentSchema = z.object({
  method: PaymentMethodEnum,

  qr_url: z.string().optional().nullable(),
  account_number: z.string().optional().nullable(),
  note: z.string().optional(),
  additional_price: z.string().optional(),
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;
