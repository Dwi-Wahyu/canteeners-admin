import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/helper/format-rupiah";

interface Props {
  commission_total: number; // Total Komisi
  subsidy_total: number; // Total Subsidi
  refund_total: number; // Total Potongan Refund
  net_total: number; // Net Amount
}

export function BillingSummaryCard({
  commission_total,
  subsidy_total,
  refund_total,
  net_total,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Komisi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatRupiah(commission_total)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-600">
            Subsidi Promo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRupiah(subsidy_total)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-destructive">
            Potongan Refund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            -{formatRupiah(refund_total)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Total Tagihan Bersih
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatRupiah(net_total)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
