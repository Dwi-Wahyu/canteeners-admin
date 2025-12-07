import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import AppTopbar from "./app-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 71)",
          "--header-height": "calc(var(--spacing) * 11)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="w-full">
        <AppTopbar />

        <div className="p-5 pt-1 pl-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
