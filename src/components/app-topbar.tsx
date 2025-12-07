"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, Key, LogOut } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/helper/get-image-url";

export default function AppTopbar() {
  const session = useSession();

  if (!session.data) {
    return <div></div>;
  }

  function handleLogout() {
    signOut({
      redirectTo: "/",
    });
  }

  return (
    <div className="justify-between bg-sidebar shadow flex p-4 mb-4 items-center">
      <div>
        <SidebarTrigger />
      </div>

      <div className="flex gap-3 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center">
            {session.data.user ? (
              <>
                <h1 className="font-semibold hidden md:block text-sm">
                  {session.data.user.name}
                </h1>
                <Avatar className="size-8">
                  <AvatarImage
                    src={session.data.user.avatar}
                    alt={session.data.user.name}
                  />
                  <AvatarFallback className="text-xs">HR</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <>
                <h1 className="font-semibold hidden md:block text-sm">
                  Administrator
                </h1>
                <Avatar className="size-8">
                  <AvatarImage
                    src={"avatars/default-avatar.jpg"}
                    alt={"Administrator"}
                  />
                  <AvatarFallback className="text-xs">HR</AvatarFallback>
                </Avatar>
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={"/admin/profil/"}>
                <CircleUser />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/admin/ganti-password/"}>
                <Key />
                Ganti Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
