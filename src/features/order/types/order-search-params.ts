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
});

export type OrderSearchParamsInput = {
  page: number;
  perPage: number;
  name: string;
  createdAt: string;
};
