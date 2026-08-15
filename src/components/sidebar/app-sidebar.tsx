"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  BookUser,
  Building,
  Calendar,
  ContactRound,
  DollarSign,
  FileText,
  HelpCircle,
  Image as LucideImage,
  Layers,
  MessageSquareQuote,
  TicketPercent,
  Truck,
  UserPlus,
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
      title: "Riwayat Order",
      url: "/authenticated/order",
      icon: FileText,
    },
    {
      title: "Kategori",
      url: "/authenticated/kategori",
      icon: Tags,
    },
    {
      title: "Banner",
      url: "/authenticated/banner",
      icon: LucideImage,
    },
    {
      title: "Testimoni",
      url: "/authenticated/testimony",
      icon: MessageSquareQuote,
    },
    {
      title: "Voucher",
      url: "/authenticated/voucher",
      icon: TicketPercent,
    },
    {
      title: "Event",
      url: "/authenticated/event",
      icon: Calendar,
    },
    {
      title: "Pusat Laporan",
      url: "/authenticated/laporan",
      icon: AlertCircle,
      child: [
        {
          title: "Laporan",
          url: "/authenticated/laporan",
        },
        {
          title: "Refund",
          url: "/authenticated/refund",
        },
        {
          title: "Komplain",
          url: "/authenticated/komplain",
        },
        {
          title: "Pelanggaran Mitra",
          url: "/authenticated/pelanggaran-mitra",
        },
      ],
    },
  ],
  navUser: [
    {
      title: "Tambahkan Pengguna",
      url: "/authenticated/users/create",
      icon: UserPlus,
    },
    // {
    //   title: "Kurir",
    //   url: "/authenticated/users/kurir",
    //   icon: Truck,
    // },
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
      title: "Pengaturan Global",
      url: "/authenticated/pengaturan",
      icon: Settings,
    },
    {
      title: "Monitoring Antrean",
      url: "/authenticated/queues",
      icon: Layers,
    },
    {
      title: "FAQ",
      url: "/authenticated/faq",
      icon: HelpCircle,
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

  const role = data.user.role;

  const filteredNavMain = adminMenu.navMain.filter((item) => {
    if (role === "SUPERADMIN") return true;
    if (role === "ADMIN") {
      return !["Kantin", "Kategori", "Banner", "Testimoni", "Voucher", "Event"].includes(item.title);
    }
    return false;
  });

  const filteredNavUser = adminMenu.navUser.filter((item) => {
    if (role === "SUPERADMIN") return true;
    // ADMIN cannot see user management
    return false;
  });

  const filteredNavSetting = adminMenu.navSetting.filter((item) => {
    if (role === "SUPERADMIN") return true;
    // ADMIN cannot see settings/FAQ
    return false;
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pb-0">
            {open && (
              <div>
                <h1 className="text-lg font-bold leading-tight">CANTEENERS</h1>
                <h1 className="text-sm text-muted-foreground">
                  Kantin Naik Level
                </h1>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-10">
        <NavMenu items={filteredNavMain} groupLabel="UTAMA" />

        {filteredNavUser.length > 0 && (
          <NavMenu items={filteredNavUser} groupLabel="PENGGUNA" />
        )}

        {filteredNavSetting.length > 0 && (
          <NavMenu items={filteredNavSetting} groupLabel="PENGATURAN" />
        )}
      </SidebarContent>
    </Sidebar>
  );
}

function LoadingSidebarMenu({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pb-0">
            {open && (
              <div>
                <h1 className="text-lg font-bold leading-tight">CANTEENERS</h1>
                <h1 className="text-sm text-muted-foreground">
                  Kantin Naik Level
                </h1>
              </div>
            )}
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
