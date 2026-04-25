import {
  createSearchParamsCache,
  parseAsString,
} from "nuqs/server";

export const ShopSearchParams = createSearchParamsCache({
  name: parseAsString.withDefault(""),
});

export type ShopSearchParamsType = {
  name: string;
};
