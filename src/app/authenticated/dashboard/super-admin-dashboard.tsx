"use client";

import { useQueryState, parseAsString } from "nuqs";
import { DashboardFilters } from "@/features/dashboard/components/dashboard-filters";
import { SummaryTab } from "@/features/dashboard/components/summary-tab";
import { FinancialTab } from "@/features/dashboard/components/financial-tab";
import { UserTab } from "@/features/dashboard/components/user-tab";
import { PartnerTab } from "@/features/dashboard/components/partner-tab";
import { PartnerCardsList } from "@/features/dashboard/components/partner-cards-list";
import { DashboardRange } from "@/features/dashboard/lib/dashboard-schema";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "summary", label: "Ringkasan" },
  { id: "financial", label: "Keuangan" },
  { id: "users", label: "Analitik Pengguna" },
  { id: "partners", label: "Manajemen Mitra" },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useQueryState("tab", parseAsString.withDefault("summary"));
  const [range] = useQueryState("range", parseAsString.withDefault("daily"));
  const [shopId] = useQueryState("shopId", parseAsString.withDefault("all"));

  const dashboardRange = range as DashboardRange;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Super Admin</h2>
      </div>

      <DashboardFilters />

      <div className="space-y-4">
        <div className="flex border-b">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors hover:text-primary relative cursor-pointer",
                activeTab === tab.id 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeTab === "summary" && (
            <div className="space-y-4">
              <SummaryTab range={dashboardRange} shopId={shopId} />
              <UserTab range={dashboardRange} shopId={shopId} />
              <PartnerTab range={dashboardRange} shopId={shopId} />
            </div>
          )}
          
          {activeTab === "financial" && (
            <FinancialTab range={dashboardRange} shopId={shopId} />
          )}
          
          {activeTab === "users" && (
            <UserTab range={dashboardRange} shopId={shopId} />
          )}
          
          {activeTab === "partners" && (
            <div className="space-y-6">
              <PartnerTab range={dashboardRange} shopId={shopId} />
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Partner Cards (Detail Per Mitra)</h3>
                <PartnerCardsList range={dashboardRange} shopId={shopId} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
