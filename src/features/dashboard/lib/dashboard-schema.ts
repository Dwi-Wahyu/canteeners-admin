import { z } from "zod";

export type DashboardRange = "daily" | "weekly" | "monthly";

export const DashboardFilterSchema = z.object({
  range: z.enum(["daily", "weekly", "monthly"] as const).default("daily"),
  shopId: z.string().optional().or(z.literal("all")),
  date: z.date().optional(),
});

export type DashboardFilterInput = z.infer<typeof DashboardFilterSchema>;

export type SummaryMetrics = {
  totalTransactions: number;
  totalGMV: number;
  activeUsers: number;
  newUsers: number;
  totalPartners: number;
  presentPartners: number;
};

export type FinancialMetrics = {
  totalCommission: number;
  totalSubsidy: number;
  totalRefund: number;
  totalNet: number;
  shopMetrics: {
    shopId: string;
    shopName: string;
    commission: number;
    subsidy: number;
    refund: number;
    net: number;
  }[];
};

export type UserTrendData = {
  date: string;
  newUsers: number;
  returningUsers: number;
};

export type PartnerRanking = {
  shopId: string;
  name: string;
  orderVolume: number;
  averageLeadTime: number; // in minutes
};

export type DailyOrderVolume = {
  date: string;
  volume: number;
};

export type PartnerCardData = {
  shopId: string;
  name: string;
  totalOrders: number;
  grossIncome: number;
  platformDebt: number;
  platformProfit: number;
};
