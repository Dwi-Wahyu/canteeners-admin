import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { handle } from "hono/vercel";
import { orderQueue, refundQueue } from "@/lib/queue";

/**
 * Route Handler Next.js App Router untuk menyajikan UI Bull Board secara native
 * tanpa perlu Express atau backend khusus UI.
 * Endpoint: /api/admin/queues
 */

const serverAdapter = new HonoAdapter(serveStatic);
serverAdapter.setBasePath("/api/admin/queues");

const queues: any[] = [];

if (orderQueue && !orderQueue._isFallback) {
  try {
    queues.push(new BullMQAdapter(orderQueue));
  } catch (e) {
    console.warn("Could not attach orderQueue to Bull Board:", e);
  }
}

if (refundQueue && !refundQueue._isFallback) {
  try {
    queues.push(new BullMQAdapter(refundQueue));
  } catch (e) {
    console.warn("Could not attach refundQueue to Bull Board:", e);
  }
}

createBullBoard({
  queues,
  serverAdapter,
});

const app = serverAdapter.registerPlugin();

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
