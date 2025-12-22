"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/helper/format-rupiah";
import DeleteBillingDialog from "./delete-billing-dialog";
import PaidBillingDialog from "./paid-billing-dialog";

interface Props {
  billings: any[];
  shopId: string;
}

export function BillingTable({ billings, shopId }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Periode</TableHead>
            <TableHead>Komisi (Subtotal)</TableHead>
            <TableHead>Refund</TableHead>
            <TableHead>Total Bersih</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                Belum ada riwayat tagihan untuk kedai ini.
              </TableCell>
            </TableRow>
          ) : (
            billings.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-sm">
                  {format(new Date(item.start_date), "dd MMM")} -{" "}
                  {format(new Date(item.end_date), "dd MMM yyyy")}
                </TableCell>
                <TableCell>{formatRupiah(item.subtotal)}</TableCell>
                <TableCell className="text-destructive">
                  -{formatRupiah(item.refund)}
                </TableCell>
                <TableCell className="font-bold">
                  {formatRupiah(item.total)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "PAID" ? "default" : "destructive"}
                  >
                    {item.status === "PAID" ? "Lunas" : "Belum Bayar"}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <PaidBillingDialog billing={item} shopId={shopId} />
                  <DeleteBillingDialog billing={item} shopId={shopId} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
