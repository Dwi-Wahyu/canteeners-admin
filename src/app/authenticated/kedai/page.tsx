import { Card, CardContent } from "@/components/ui/card";
import { getShops } from "@/features/shop/lib/shop-queries";
import Image from "next/image";
import Link from "next/link";

export default async function KedaiPage() {
  const shops = await getShops();

  return (
    <div>
      <h1>Kedai</h1>

      <Link href={"/authenticated/kedai/create"}>Input kedai</Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <Link key={shop.id} href={`/authenticated/kedai/${shop.id}/tagihan`}>
            <Card>
              <CardContent>
                <Image
                  src={
                    "https://mwozu5eodkq4uc39.public.blob.vercel-storage.com/" +
                    shop.image_url
                  }
                  alt=""
                  width={400}
                  height={400}
                  className="rounded-lg shadow mb-2"
                />

                <h1>{shop.name}</h1>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
