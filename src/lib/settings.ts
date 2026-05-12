import { prisma } from "@/lib/prisma";
import { orderQueue } from "@/lib/queue";

/**
 * Mendapatkan nilai pengaturan global dengan caching Redis.
 */
export async function getGlobalSetting(key: string, defaultValue: string): Promise<string> {
  // Use redis from orderQueue if available
  const redis = await orderQueue.client;
  const cacheKey = `setting:${key}`;

  try {
    // 1. Try Redis
    const cachedValue = await redis.get(cacheKey);
    if (cachedValue !== null) {
      return cachedValue;
    }

    // 2. Database Fallback
    const setting = await prisma.globalSetting.findUnique({
      where: { key },
    });

    const finalValue = setting ? setting.value : defaultValue;

    // 3. Cache to Redis (TTL 1 hour)
    await redis.set(cacheKey, finalValue, "EX", 3600);

    return finalValue;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return defaultValue;
  }
}

export async function getPaymentTimeoutMinutes(): Promise<number> {
  const value = await getGlobalSetting("payment_timeout_minutes", "15");
  return parseInt(value) || 15;
}
