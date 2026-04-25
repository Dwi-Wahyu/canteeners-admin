"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableQRCode } from "@/generated/prisma";
import { getImageUrl } from "@/helper/get-image-url";
import { Download, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteTableQRCode } from "./actions";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function QRCodeMejaCard({ data }: { data: TableQRCode }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteTableQRCode({
          id: data.id,
          image_url: data.image_url,
          canteen_id: data.canteen_id,
          map_id: data.map_id,
        });

        if (result.success) {
          toast.success("QR Code berhasil dihapus");
          setIsOpen(false);
        } else {
          toast.error(result.error.message || "Gagal menghapus QR Code");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan");
        console.error(error);
      }
    });
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 items-center p-4">
        <div className="justify-between flex items-center w-full">
          <h1 className="font-semibold">Meja {data.table_number}</h1>

          <div className="flex gap-2">
            <Button variant={"outline"} size={"icon"} asChild>
              <Link
                href={getImageUrl("/table-qrcode/" + data.image_url)}
                target="_blank"
              >
                <Download className="h-4 w-4" />
              </Link>
            </Button>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"} size={"icon"} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus QR Code?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus QR Code Meja {data.table_number} secara permanen dari sistem dan penyimpanan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Hapus
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="aspect-square relative w-full overflow-hidden rounded-md border">
          <img
            src={getImageUrl("/table-qrcode/" + data.image_url)}
            alt={`QR Code Meja ${data.table_number}`}
            className="object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
