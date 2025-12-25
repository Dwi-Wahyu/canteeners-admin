import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Asumsi kamu punya komponen Button
import { getShops } from "@/features/shop/lib/shop-queries";
import { getImageUrl } from "@/helper/get-image-url";
import { PlusCircle, Store } from "lucide-react"; // Ikon tambahan
import Image from "next/image";
import Link from "next/link";
import NavButton from "@/components/nav-button";

export default async function KedaiPage() {
  const shops = await getShops();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Store className="w-8 h-8 text-primary" />
            Daftar Kedai
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola dan pantau semua operasional kedai Anda dalam satu tempat.
          </p>
        </div>

        <NavButton href={"/authenticated/kedai/create"}>
          <PlusCircle />
          Tambah Kedai
        </NavButton>
      </div>

      {shops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Link key={shop.id} href={`/authenticated/kedai/${shop.id}`}>
              <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer">
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden border-b">
                  <Image
                    src={getImageUrl(shop.image_url)}
                    alt={shop.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay tipis saat hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                    {shop.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Klik untuk lihat detail
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl">
          <Store className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-muted-foreground">
            Belum ada kedai terdaftar
          </p>
          <Link
            href="/authenticated/kedai/create"
            className="mt-4 text-primary underline"
          >
            Mulai buat kedai pertama Anda
          </Link>
        </div>
      )}
    </div>
  );
}
