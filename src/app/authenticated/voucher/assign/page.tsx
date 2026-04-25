import { getCustomers, getDiscounts } from "@/features/discount/lib/discount-queries";
import { AssignVoucherForm } from "@/features/discount/ui/assign-voucher-form";
import NavButton from "@/components/nav-button";
import { ArrowLeft } from "lucide-react";

export default async function AssignVoucherPage() {
  const [discounts, customers] = await Promise.all([
    getDiscounts(),
    getCustomers(),
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <NavButton variant="outline" size="icon" href="/authenticated/voucher">
          <ArrowLeft className="h-4 w-4" />
        </NavButton>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Berikan Voucher</h1>
          <p className="text-muted-foreground">Pilih voucher dan berikan kepada satu atau lebih pelanggan.</p>
        </div>
      </div>

      <AssignVoucherForm discounts={discounts} customers={customers} />
    </div>
  );
}
