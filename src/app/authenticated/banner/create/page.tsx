import { auth } from "@/config/auth";
import BannerForm from "@/features/banner/ui/banner-form";
import { redirect } from "next/navigation";

export default async function CreateBannerPage() {
  const session = await auth();

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tambah Banner</h1>
        <p className="text-muted-foreground">Buat banner promosi baru</p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <BannerForm mode="create" />
      </div>
    </div>
  );
}
