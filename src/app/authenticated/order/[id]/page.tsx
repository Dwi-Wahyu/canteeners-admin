import { getOrderDetail } from "@/features/order/lib/order-queries";
import { notFound } from "next/navigation";
import OrderDetailClient from "./order-detail-client";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage(props: OrderDetailPageProps) {
  const { id } = await props.params;
  const order = await getOrderDetail(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="p-6">
      <OrderDetailClient order={order} />
    </div>
  );
}
