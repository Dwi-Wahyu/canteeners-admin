import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
} from "nuqs/server";

export const EventSlotSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  date: parseAsArrayOf(parseAsString, ",").withDefault([]),
});

export type EventSlotSearchParamsInput = {
  page: number;
  perPage: number;
  date: string[];
};
