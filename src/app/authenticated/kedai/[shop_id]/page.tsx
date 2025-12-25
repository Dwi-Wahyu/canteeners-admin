import { prisma } from "@/lib/prisma"; // Sesuaikan dengan path prisma client kamu
import { notFound } from "next/navigation";
import ShopDetailClient from "./shop-detail-client";
import { getShopDetail } from "@/features/shop/lib/shop-queries";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  const shop = await getShopDetail(shop_id);

  if (!shop) {
    notFound();
  }

  return (
    <div className="p-6">
      <ShopDetailClient shop={shop} />
    </div>
  );
}
