"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { 
  DashboardFilterInput, 
  SummaryMetrics, 
  FinancialMetrics, 
  UserTrendData, 
  PartnerRanking, 
  DailyOrderVolume, 
  PartnerCardData 
} from "./dashboard-schema";

function getDateRange(range: string, date: Date = new Date()) {
  switch (range) {
    case "daily":
      return { gte: startOfDay(date), lte: endOfDay(date) };
    case "weekly":
      return { gte: startOfWeek(date, { weekStartsOn: 1 }), lte: endOfWeek(date, { weekStartsOn: 1 }) };
    case "monthly":
      return { gte: startOfMonth(date), lte: endOfMonth(date) };
    default:
      return { gte: startOfDay(date), lte: endOfDay(date) };
  }
}

export async function getSummaryMetrics(filters: DashboardFilterInput): Promise<SummaryMetrics> {
  const dateRange = getDateRange(filters.range, filters.date);
  const shopId = filters.shopId && filters.shopId !== "all" ? filters.shopId : undefined;

  const whereOrder = {
    created_at: dateRange,
    status: "COMPLETED" as const,
    ...(shopId ? { shop_id: shopId } : {}),
  };

  const [orders, newUsersCount, activeUsersCount, totalPartners, presentPartners] = await Promise.all([
    prisma.order.findMany({
      where: whereOrder,
      select: { total_price: true },
    }),
    prisma.user.count({
      where: {
        created_at: dateRange,
        role: "CUSTOMER",
      },
    }),
    prisma.user.count({
      where: {
        last_login: dateRange,
        role: "CUSTOMER",
      },
    }),
    prisma.shop.count(),
    prisma.shop.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);

  const totalTransactions = orders.length;
  const totalGMV = orders.reduce((sum, order) => sum + order.total_price, 0);

  return {
    totalTransactions,
    totalGMV,
    activeUsers: activeUsersCount,
    newUsers: newUsersCount,
    totalPartners,
    presentPartners,
  };
}

export async function getFinancialMetrics(filters: DashboardFilterInput): Promise<FinancialMetrics> {
  const shopId = filters.shopId && filters.shopId !== "all" ? filters.shopId : undefined;

  const unpaidBillings = await prisma.shopBilling.findMany({
    where: {
      status: "UNPAID",
      ...(shopId ? { shop_id: shopId } : {}),
    },
    include: {
      shop: {
        select: {
          name: true,
        },
      },
    },
  });

  const totalCommission = unpaidBillings.reduce((sum, b) => sum + b.commission_total, 0);
  const totalSubsidy = unpaidBillings.reduce((sum, b) => sum + b.subsidy_total, 0);
  const totalRefund = unpaidBillings.reduce((sum, b) => sum + b.refund_total, 0);
  const totalNet = unpaidBillings.reduce((sum, b) => sum + b.net_total, 0);

  // Group by shop
  const shopMetricsMap = new Map<string, { shopId: string; shopName: string; commission: number; subsidy: number; refund: number; net: number }>();

  unpaidBillings.forEach(billing => {
    const existing = shopMetricsMap.get(billing.shop_id);
    if (existing) {
      existing.commission += billing.commission_total;
      existing.subsidy += billing.subsidy_total;
      existing.refund += billing.refund_total;
      existing.net += billing.net_total;
    } else {
      shopMetricsMap.set(billing.shop_id, {
        shopId: billing.shop_id,
        shopName: billing.shop.name,
        commission: billing.commission_total,
        subsidy: billing.subsidy_total,
        refund: billing.refund_total,
        net: billing.net_total,
      });
    }
  });

  return {
    totalCommission,
    totalSubsidy,
    totalRefund,
    totalNet,
    shopMetrics: Array.from(shopMetricsMap.values()),
  };
}

export async function getUserMetrics(filters: DashboardFilterInput): Promise<UserTrendData[]> {
  // Actually, let's implement a daily breakdown for the range
  const days = filters.range === "daily" ? 1 : filters.range === "weekly" ? 7 : 30;
  const trendData: UserTrendData[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const start = startOfDay(d);
    const end = endOfDay(d);
    
    const [newUsers, returningUsers] = await Promise.all([
      prisma.user.count({
        where: { created_at: { gte: start, lte: end }, role: "CUSTOMER" },
      }),
      prisma.user.count({
        where: { 
          last_login: { gte: start, lte: end }, 
          created_at: { lt: start },
          role: "CUSTOMER" 
        },
      }),
    ]);
    
    trendData.push({
      date: start.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      newUsers,
      returningUsers,
    });
  }
  
  return trendData;
}

export async function getPartnerMetrics(filters: DashboardFilterInput): Promise<{ ranking: PartnerRanking[], volume: DailyOrderVolume[] }> {
  const dateRange = getDateRange(filters.range, filters.date);
  const shopId = filters.shopId && filters.shopId !== "all" ? filters.shopId : undefined;

  const shops = await prisma.shop.findMany({
    where: shopId ? { id: shopId } : {},
    select: {
      id: true,
      name: true,
      orders: {
        where: {
          created_at: dateRange,
          status: "COMPLETED",
        },
        select: {
          processed_at: true,
          updated_at: true,
        },
      },
    },
  });

  const ranking: PartnerRanking[] = shops.map(shop => {
    const orders = shop.orders;
    const orderVolume = orders.length;
    
    let totalLeadTime = 0;
    let validLeadTimeCount = 0;
    
    orders.forEach(order => {
      if (order.processed_at && order.updated_at) {
        const diff = (order.updated_at.getTime() - order.processed_at.getTime()) / (1000 * 60); // minutes
        totalLeadTime += diff;
        validLeadTimeCount++;
      }
    });

    return {
      shopId: shop.id,
      name: shop.name,
      orderVolume,
      averageLeadTime: validLeadTimeCount > 0 ? totalLeadTime / validLeadTimeCount : 0,
    };
  }).sort((a, b) => b.orderVolume - a.orderVolume);

  // Daily volume trend
  const days = filters.range === "daily" ? 1 : filters.range === "weekly" ? 7 : 30;
  const volumeTrend: DailyOrderVolume[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const start = startOfDay(d);
    const end = endOfDay(d);

    const volume = await prisma.order.count({
      where: {
        created_at: { gte: start, lte: end },
        status: "COMPLETED",
        ...(shopId ? { shop_id: shopId } : {}),
      },
    });

    volumeTrend.push({
      date: start.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      volume,
    });
  }

  return { ranking, volume: volumeTrend };
}

export async function getPartnerCards(filters: DashboardFilterInput): Promise<PartnerCardData[]> {
  const dateRange = getDateRange(filters.range, filters.date);
  const shopId = filters.shopId && filters.shopId !== "all" ? filters.shopId : undefined;

  const shops = await prisma.shop.findMany({
    where: shopId ? { id: shopId } : {},
    select: {
      id: true,
      name: true,
      orders: {
        where: {
          created_at: dateRange,
          status: "COMPLETED",
        },
        include: {
          order_items: {
            select: { quantity: true }
          }
        }
      },
      billings: {
        where: {
          status: "UNPAID",
        },
      },
    },
  });

  return shops.map(shop => {
    const totalOrders = shop.orders.length;
    const grossIncome = shop.orders.reduce((sum, o) => sum + o.total_price, 0);
    const platformProfit = shop.orders.reduce((sum, o) => {
      const itemsQty = o.order_items.reduce((s, item) => s + item.quantity, 0);
      return sum + itemsQty * 1000;
    }, 0);
    const platformDebt = shop.billings.reduce((sum, b) => sum + b.net_total, 0);

    return {
      shopId: shop.id,
      name: shop.name,
      totalOrders,
      grossIncome,
      platformDebt,
      platformProfit,
    };
  });
}
