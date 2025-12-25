import { getOrders } from "../lib/order-queries";

export type GetOrdersTableDataResponseType = Awaited<
  ReturnType<typeof getOrders>
>;

export type OrdersTableDataType =
  GetOrdersTableDataResponseType["data"][number];
