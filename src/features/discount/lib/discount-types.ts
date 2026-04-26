import { Discount } from "@/generated/prisma";
import { z } from "zod";

export type DiscountTableDataType = Discount & {
  _count: {
    customer_discounts: number;
  };
};

export type GetDiscountTableDataResponseType = {
  data: DiscountTableDataType[];
  pageCount: number;
};

export type DiscountOwnerTableDataType = {
  id: string;
  is_used: boolean;
  used_at: Date | null;
  acquired_at: Date;
  customer: {
    id: string;
    user: {
      name: string;
      username: string | null;
      avatar: string;
    };
  };
};

export type GetDiscountOwnerTableDataResponseType = {
  data: DiscountOwnerTableDataType[];
  pageCount: number;
};

export const CreateDiscountSchema = z.object({
  name: z.string().min(1, "Nama voucher harus diisi"),
  description: z.string().optional(),
  code: z.string().min(3, "Kode minimal 3 karakter").toUpperCase().optional().or(z.literal("")),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().min(1, "Nilai minimal 1"),
  max_discount: z.number().optional().nullable(),
  min_purchase: z.number().optional().nullable(),
  start_date: z.date().optional().nullable(),
  end_date: z.date().optional().nullable(),
});

export type CreateDiscountInput = z.infer<typeof CreateDiscountSchema>;
