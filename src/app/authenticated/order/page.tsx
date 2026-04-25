import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getOrders } from "@/features/order/lib/order-queries";
import { OrderSearchParams } from "@/features/order/types/order-search-params";
import { getShops } from "@/features/shop/lib/shop-queries";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { OrderColumns } from "./columns";
import OrdersTable from "./table";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function OrderListPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = OrderSearchParams.parse(searchParams);

  const [promises, shops] = await Promise.all([getOrders(search), getShops()]);

  return (
    <div>
      <Suspense fallback={<DataTableSkeleton columnCount={5} />}>
        <OrdersTable
          promises={promises}
          columns={OrderColumns}
          shops={shops.map((shop) => ({ label: shop.name, value: shop.id }))}
        />
      </Suspense>
    </div>
  );
}
