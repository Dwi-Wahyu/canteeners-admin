import { getDiscounts } from "@/features/discount/lib/discount-queries";
import DiscountTable from "@/features/discount/ui/discount-table";
import { DiscountColumns } from "@/features/discount/ui/discount-columns";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "@/config/auth";

export default async function VoucherPage() {
  const session = await auth();

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  const discounts = await getDiscounts();

  const promises = {
    data: discounts,
    pageCount: 1, // Basic implementation without pagination for now
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Voucher</h1>
          <p className="text-muted-foreground">
            Daftar voucher/diskon yang tersedia di sistem.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DiscountTable promises={promises} columns={DiscountColumns} />
        </CardContent>
      </Card>
    </div>
  );
}
