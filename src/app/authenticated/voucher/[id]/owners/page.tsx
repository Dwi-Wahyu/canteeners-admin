import { getDiscountById, getDiscountOwners } from "@/features/discount/lib/discount-queries";
import DiscountOwnersTable from "@/features/discount/ui/discount-owners-table";
import { DiscountOwnersColumns } from "@/features/discount/ui/discount-owners-columns";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { DiscountOwnerTableDataType } from "@/features/discount/lib/discount-types";

export default async function DiscountOwnersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const discount = await getDiscountById(id);

  if (!discount) {
    notFound();
  }

  const owners = await getDiscountOwners(id);
  
  const promises = {
    data: owners as unknown as DiscountOwnerTableDataType[],
    pageCount: 1,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pemilik Voucher: {discount.name}</h1>
          <p className="text-muted-foreground">
            Daftar pelanggan yang memiliki voucher ini {discount.code ? `(${discount.code})` : ""}.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DiscountOwnersTable promises={promises} columns={DiscountOwnersColumns} />
        </CardContent>
      </Card>
    </div>
  );
}
