import { Queue } from "bullmq";

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

const isRedisAvailable = process.env.SKIP_REDIS !== "true";

class FallbackQueue {
  private jobs: Map<string, any[]> = new Map();

  async add(name: string, data: any, opts?: any) {
    if (!this.jobs.has(name)) {
      this.jobs.set(name, []);
    }
    this.jobs.get(name)!.push({ data, opts, timestamp: Date.now() });
    return { id: `fallback-${Date.now()}` };
  }

  async process(name: string, handler: Function) {
    return;
  }

  async getJob(id: string) {
    return null;
  }

  async remove() {
    return 0;
  }

  async close() {
    return undefined;
  }
}

export const orderQueue: any = isRedisAvailable
  ? new Queue("order-queue", { connection: redisConnection })
  : new FallbackQueue();

Object.defineProperty(orderQueue, "_isFallback", {
  value: !isRedisAvailable,
  enumerable: false,
});

export const refundQueue: any = isRedisAvailable
  ? new Queue("refund-queue", { connection: redisConnection })
  : new FallbackQueue();

Object.defineProperty(refundQueue, "_isFallback", {
  value: !isRedisAvailable,
  enumerable: false,
});
