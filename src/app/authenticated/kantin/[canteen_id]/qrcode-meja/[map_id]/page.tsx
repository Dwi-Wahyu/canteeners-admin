import { notFound } from "next/navigation";
import { getCanteenMap, getCanteenWithAllRelations } from "../../../queries";
import QrcodeMejaClient from "./qrcode-meja-client";
import { headers } from "next/headers";

export default async function QrcodeMeja({
  params,
}: {
  params: Promise<{ map_id: string }>;
}) {
  const { map_id } = await params;

  const map = await getCanteenMap(parseInt(map_id));

  if (!map) {
    return notFound();
  }

  return (
    <QrcodeMejaClient
      map={map}
      baseUrl={process.env.NEXT_PUBLIC_BACKEND_URL!}
    />
  );
}
