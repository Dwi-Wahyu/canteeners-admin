"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { NavigationButton } from "@/components/navigation-button";
import { getCanteenMap } from "../../../queries";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCode, Loader2 } from "lucide-react";
import { createNewTableQRCode } from "./actions";
import QRCodeMejaCard from "./qrcode-meja-card";
import { getImageUrl } from "@/helper/get-image-url";

export default function QrcodeMejaClient({
  map,
}: {
  map: NonNullable<Awaited<ReturnType<typeof getCanteenMap>>>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleGenerateQRCode = async () => {
    startTransition(async () => {
      try {
        const result = await createNewTableQRCode({
          canteen_id: map.canteen_id,
          canteen_slug: map.canteen.slug!,
          floor: map.floor,
          map_id: map.id,
          previousTableNumber: map.qrcodes.length,
        });

        if (result.success) {
          toast.success(result.message || "Berhasil generate QR Code");
          router.refresh(); // Memperbarui data server-side
        } else {
          toast.error("Terjadi kesalahan saat membuat QR Code");
        }
      } catch (error) {
        toast.error("Gagal generate QR Code");
        console.error(error);
      }
    });
  };

  return (
    <div>
      <div className="my-4 text-center">
        <h1 className="font-semibold text-xl">{map.canteen.name}</h1>
        <h1 className="font-semibold text-lg">Lantai {map.floor}</h1>
      </div>

      <div className="flex justify-center">
        <img
          src={getImageUrl("/canteen-map/" + map.image_url)}
          alt={`Map ${map.canteen.name}`}
          className="rounded-lg shadow w-full md:w-lg"
        />
      </div>

      <div className="my-4 flex justify-between items-center">
        <NavigationButton url={`/authenticated/kantin/${map.canteen_id}`} />

        {map.qrcodes.length > 0 && (
          <Button onClick={handleGenerateQRCode} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tambah QR Code
          </Button>
        )}
      </div>

      {map.qrcodes.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <QrCode />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Data</EmptyTitle>
            <EmptyDescription>
              Klik "Tambah QR Code" untuk menambahkan Qr Code
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleGenerateQRCode} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tambah QR Code
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {map.qrcodes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {map.qrcodes.map((qrcode) => (
            <QRCodeMejaCard data={qrcode} key={qrcode.id} />
          ))}
        </div>
      )}
    </div>
  );
}
