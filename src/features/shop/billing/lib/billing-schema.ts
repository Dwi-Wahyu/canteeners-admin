import { z } from "zod";

export const GenerateBillingSchema = z.object({
  shop_id: z.string().uuid(),
  start_date: z.date(),
  end_date: z.date(),
});

export type GenerateBillingInput = z.infer<typeof GenerateBillingSchema>;

export type BillingSummary = {
  order_count: number;
  total_order_amount: number;
  commission_total: number;
  subsidy_total: number;
  refund_total: number;
  net_total: number;
};
