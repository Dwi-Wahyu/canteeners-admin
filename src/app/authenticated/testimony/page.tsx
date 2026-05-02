import { getAppTestimonies } from "@/features/testimony/lib/testimony-queries";
import { TestimonyTable } from "@/features/testimony/ui/testimony-table";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function TestimonyPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  const testimonies = await getAppTestimonies();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Moderasi Testimoni</h1>
          <p className="text-muted-foreground">
            Kelola testimoni aplikasi yang muncul di halaman utama
          </p>
        </div>
      </div>

      <TestimonyTable initialData={testimonies} />
    </div>
  );
}
