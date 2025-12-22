import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/helper/format-rupiah";

interface Props {
  subtotal: number; // Total Komisi
  refund: number; // Total Potongan Refund
  total: number; // Net Amount
}

export function BillingSummaryCard({ subtotal, refund, total }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Komisi (Subtotal)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRupiah(subtotal)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-destructive">
            Potongan Refund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-{formatRupiah(refund)}</div>
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
            {formatRupiah(total)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
