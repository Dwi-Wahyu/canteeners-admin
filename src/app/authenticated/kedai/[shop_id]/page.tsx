import { getShopDetail } from "@/features/shop/lib/shop-queries";
import ShopDetailClient from "./shop-detail-client";
import { notFound } from "next/navigation";
import { ShopViolationList } from "@/features/shop/violations/ui/shop-violation-list";
import { CreateShopViolationDialog } from "@/features/shop/violations/ui/create-shop-violation-dialog";
import { auth } from "@/config/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;
  const session = await auth();
  const shop = await getShopDetail(shop_id);

  if (!shop) notFound();

  return (
    <div className="p-6 space-y-6">
      <ShopDetailClient shop={shop} adminUserId={session?.user?.id ?? ""} />

      {/* Card Pelanggaran Kedai */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-destructive" />
            Catatan Pelanggaran
          </CardTitle>
          <CreateShopViolationDialog
            shopId={shop.id}
            adminUserId={session?.user?.id ?? ""}
          />
        </CardHeader>
        <CardContent>
          <ShopViolationList shopId={shop.id} />
        </CardContent>
      </Card>
    </div>
  );
}
