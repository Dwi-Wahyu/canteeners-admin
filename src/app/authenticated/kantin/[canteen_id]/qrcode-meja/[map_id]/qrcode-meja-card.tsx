import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableQRCode } from "@/generated/prisma";
import { getImageUrl } from "@/helper/get-image-url";
import { Download } from "lucide-react";
import Link from "next/link";

export default function QRCodeMejaCard({ data }: { data: TableQRCode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 items-center">
        <div className="justify-between flex items-center w-full">
          <h1 className="font-semibold">Meja {data.table_number}</h1>

          <Button variant={"outline"} size={"icon"} asChild>
            <Link
              href={getImageUrl("/table-qrcode/" + data.image_url)}
              target="_blank"
            >
              <Download />
            </Link>
          </Button>
        </div>

        <img src={getImageUrl("/table-qrcode/" + data.image_url)} alt="" />
      </CardContent>
    </Card>
  );
}
