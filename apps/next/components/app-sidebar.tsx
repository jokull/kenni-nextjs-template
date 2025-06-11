"use client";

import {
  BeakerIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";

import { useAuth } from "~/lib/auth-provider";

import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarSection,
  SidebarSpacer,
} from "./ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
            O
          </div>
          <span className="font-semibold">Acme</span>
        </div>
      </SidebarHeader>

      <SidebarBody>
        <SidebarSection>
          <SidebarHeading>Navigation</SidebarHeading>
          <SidebarItem href="/dashboard" current={pathname === "/dashboard"}>
            <HomeIcon />
            Yfirlit
          </SidebarItem>
          <SidebarItem href="/profile" current={pathname === "/profile"}>
            <UserIcon />
            Mínar síður
          </SidebarItem>
          <SidebarItem href="/demo" current={pathname === "/demo"}>
            <BeakerIcon />
            React 19 Demo
          </SidebarItem>
        </SidebarSection>

        {user.role === "admin" && (
          <SidebarSection>
            <SidebarHeading>Stjórnun</SidebarHeading>
            <SidebarItem href="/admin" current={pathname === "/admin"}>
              <Cog6ToothIcon />
              Stjórnborð
            </SidebarItem>
          </SidebarSection>
        )}

        <SidebarSpacer />
      </SidebarBody>

      <SidebarFooter>
        <SidebarSection>
          <SidebarItem>
            <UserIcon />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-zinc-500">
                {user.role === "admin" ? "Stjórnandi" : "Notandi"}
              </span>
            </div>
          </SidebarItem>
        </SidebarSection>
      </SidebarFooter>
    </Sidebar>
  );
}
