"use client";

import {
  BeakerIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";

import { useAuth } from "~/lib/auth-provider";

// Simple sidebar components - replace with actual implementation
const Sidebar = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className="flex w-64 flex-col border-r border-gray-200 bg-white"
    {...props}
  >
    {children}
  </div>
);

const SidebarHeader = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="border-b border-gray-200 p-4" {...props}>
    {children}
  </div>
);

const SidebarBody = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex-1 overflow-y-auto" {...props}>
    {children}
  </div>
);

const SidebarFooter = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="mt-auto border-t border-gray-200 p-4" {...props}>
    {children}
  </div>
);

const SidebarHeading = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className="px-3 py-2 text-sm font-medium uppercase tracking-wider text-gray-500"
    {...props}
  >
    {children}
  </h3>
);

interface SidebarItemProps {
  children: React.ReactNode;
  href?: string;
  current?: boolean;
  className?: string;
  onClick?: () => void;
}

const SidebarItem = ({
  children,
  href,
  current: _current,
  className,
  onClick,
}: SidebarItemProps) => {
  const baseClassName =
    "px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mx-2";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  if (href) {
    return (
      <a href={href} className={`${finalClassName} block`} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <div
      className={finalClassName}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

const SidebarSection = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="py-2" {...props}>
    {children}
  </div>
);

const SidebarSpacer = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex-1" {...props} />
);

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
