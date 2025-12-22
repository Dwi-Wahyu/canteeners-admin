import { getShopBillings } from "@/features/shop/billing/lib/billing-queries";
import { BillingTable } from "@/features/shop/billing/ui/billing-table";
import { notFound } from "next/navigation";
import { getShopById } from "@/features/shop/lib/shop-queries";
import { GenerateBillingDialog } from "@/features/shop/billing/ui/generate-billing-dialog";

interface Props {
  params: Promise<{ shop_id: string }>;
}

export default async function ShopBillingPage({ params }: Props) {
  const { shop_id } = await params;

  const shop = await getShopById(shop_id);

  if (!shop) notFound();

  const billings = await getShopBillings(shop_id);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tagihan {shop.name}
          </h1>
          <p className="text-muted-foreground">
            Kelola komisi dan pantau status pembayaran tagihan kedai.
          </p>
        </div>

        <GenerateBillingDialog shopId={shop_id} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Riwayat Penagihan</h2>
        <BillingTable billings={billings} shopId={shop_id} />
      </div>
    </div>
  );
}
