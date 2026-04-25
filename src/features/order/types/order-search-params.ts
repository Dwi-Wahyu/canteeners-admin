import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const OrderSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString.withDefault(""),
  createdAt: parseAsString.withDefault(""),
  shop_id: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  payment_method: parseAsString.withDefault(""),
});

export type OrderSearchParamsInput = {
  page: number;
  perPage: number;
  name: string;
  createdAt: string;
  shop_id: string;
  status: string;
  payment_method: string;
};
