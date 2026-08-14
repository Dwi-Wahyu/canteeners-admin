import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GlobalSettingsClient from "./global-settings-client";

export default async function GlobalSettingsPage() {
  const session = await auth();

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  const settings = await prisma.globalSetting.findMany();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan Global</h1>
        <p className="text-muted-foreground">
          Kelola konfigurasi sistem yang berlaku untuk seluruh aplikasi.
        </p>
      </div>

      <GlobalSettingsClient initialSettings={settings} />
    </div>
  );
}
