import NavButton from "@/components/nav-button";
import { auth } from "@/config/auth";
import { getBanners } from "@/features/banner/lib/banner-queries";
import BannerCard from "@/features/banner/ui/banner-card";
import { Image as LucideImage } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BannerPage() {
  const session = await auth();

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  const banners = await getBanners();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banner</h1>
          <p className="text-muted-foreground">
            Kelola banner promosi aplikasi
          </p>
        </div>
        <NavButton href="/authenticated/banner/create">
          <LucideImage className="w-4 h-4 mr-2" />
          Tambah Banner
        </NavButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
        {banners.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-lg text-muted-foreground">
            <LucideImage className="w-12 h-12 mb-4 opacity-20" />
            <p>Belum ada banner yang ditambahkan</p>
          </div>
        )}
      </div>
    </div>
  );
}
