import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function BullBoardQueuesPage() {
  const session = await auth();

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  return (
    <div className="w-full h-[calc(100vh-100px)] space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Monitoring Antrean (Bull Board)</h1>
        <p className="text-muted-foreground">
          Pantau antrean job real-time (order-queue & refund-queue) langsung melalui tampilan standar Bull Board.
        </p>
      </div>

      <div className="w-full rounded-lg overflow-hidden border border-border bg-card" style={{ minHeight: "700px", height: "calc(100vh - 160px)" }}>
        <iframe
          src="/api/admin/queues/"
          className="w-full h-full border-0"
          style={{ width: "100%", height: "100%", minHeight: "700px" }}
          title="Bull Board Queue Monitoring"
        />
      </div>
    </div>
  );
}
