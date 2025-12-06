"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookUser,
  Building,
  ChartArea,
  ContactRound,
  DollarSign,
  Truck,
  UserPlus,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { LayoutDashboard, Settings, Store, Tags } from "lucide-react";
import { NavMenu } from "./nav-menu";

export const adminMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/authenticated/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Kantin",
      url: "/authenticated/kantin",
      icon: Building,
    },
    {
      title: "Kedai",
      url: "/authenticated/kedai",
      icon: Store,
    },
    {
      title: "Kategori",
      url: "/authenticated/kategori",
      icon: Tags,
    },
    {
      title: "Riwayat Transaksi",
      url: "/authenticated/transaksi",
      icon: DollarSign,
    },
    {
      title: "Support",
      url: "/authenticated/support",
      icon: ChartArea,
    },
  ],
  navUser: [
    {
      title: "Tambahkan Pengguna",
      url: "/authenticated/users/create",
      icon: UserPlus,
    },
    {
      title: "Kurir",
      url: "/authenticated/users/kurir",
      icon: Truck,
    },
    {
      title: "Pemilik Kedai",
      url: "/authenticated/users/pemilik-kedai",
      icon: ContactRound,
    },
    {
      title: "Pelanggan",
      url: "/authenticated/users/customer",
      icon: BookUser,
    },
  ],
  navSetting: [
    {
      title: "Pengaturan Aplikasi",
      url: "/authenticated/pengaturan-aplikasi",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  const { data, status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return <LoadingSidebarMenu {...props} />;
  }

  if (!data) {
    router.push("/");
    return;
  }

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pb-0">
            <h1 className="text-lg font-bold leading-tight">CANTEENERS</h1>
            <h1 className="text-sm text-muted-foreground">Kantin Naik Level</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-10">
        <NavMenu items={adminMenu.navMain} groupLabel="UTAMA" />

        <NavMenu items={adminMenu.navUser} groupLabel="PENGGUNA" />

        <NavMenu items={adminMenu.navSetting} groupLabel="PENGATURAN" />
      </SidebarContent>
    </Sidebar>
  );
}

function LoadingSidebarMenu({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pb-0 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Image
                src={"/app-logo.svg"}
                width={36}
                height={36}
                alt="app logo"
              />

              <div>
                <h1 className="text-lg font-bold leading-tight">CANTEENERS</h1>
                <h1 className="text-sm text-muted-foreground">
                  Kantin Naik Level
                </h1>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4 pt-6">
        <SidebarSkeleton />
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-16 h-3 bg-sidebar-foreground" />
        <Skeleton className="w-44 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-60 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-44 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-40 h-5 bg-sidebar-foreground" />
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <Skeleton className="w-16 h-3 bg-sidebar-foreground" />
        <Skeleton className="w-40 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-36 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-28 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-36 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
      </div>
    </div>
  );
}
