import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getOrders } from "@/features/order/lib/order-queries";
import { OrderSearchParams } from "@/features/order/types/order-search-params";
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

  const promises = await getOrders(search);

  return (
    <div>
      <Card>
        <CardContent>
          <Suspense fallback={<DataTableSkeleton columnCount={5} />}>
            <OrdersTable promises={promises} columns={OrderColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
