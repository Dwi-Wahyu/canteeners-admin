import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import SuperAdminDashboard from "./super-admin-dashboard";
import AdminDashboard from "./admin-dashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const role = session.user.role;

  if (role === "SUPERADMIN") {
    return <SuperAdminDashboard />;
  }

  // Fetch metrics for Admin role
  const [reportsCount, escalatedRefundsCount, escalatedComplaintsCount] = await Promise.all([
    prisma.userReport.count(),
    prisma.refund.count({ where: { status: "ESCALATED" } }),
    prisma.shopComplaint.count({ where: { status: "ESCALATED" } }),
  ]);

  return (
    <AdminDashboard
      reportsCount={reportsCount}
      escalatedRefundsCount={escalatedRefundsCount}
      escalatedComplaintsCount={escalatedComplaintsCount}
    />
  );
}
