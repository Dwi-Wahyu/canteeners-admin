import { auth } from "@/config/auth";
import { getBannerById } from "@/features/banner/lib/banner-queries";
import BannerForm from "@/features/banner/ui/banner-form";
import { notFound, redirect } from "next/navigation";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  const { id } = await params;
  const banner = await getBannerById(Number(id));

  if (!banner) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Banner</h1>
        <p className="text-muted-foreground">Perbarui informasi banner</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <BannerForm
          mode="edit"
          initialData={{
            id: banner.id,
            order: banner.order,
            file: banner.file,
            cta_path: banner.cta_path,
          }}
        />
      </div>
    </div>
  );
}
