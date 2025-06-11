"use client";

import {
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

import { useAuth, useUserInitials } from "~/lib/auth-provider";

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./ui/dropdown";
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "./ui/navbar";

export function AuthNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const userInitials = useUserInitials();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return (
      <Navbar>
        <NavbarSection>
          <NavbarItem href="/">Acme</NavbarItem>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <NavbarItem href="/login">
            <UserIcon />
            Innskráning
          </NavbarItem>
        </NavbarSection>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/">Acme</NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <Dropdown>
          <DropdownButton>{userInitials}</DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom end">
            <DropdownItem>
              <UserIcon />
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => router.push("/dashboard")}>
              <UserIcon />
              Mínar síður
            </DropdownItem>
            {user.role === "admin" && (
              <DropdownItem onClick={() => router.push("/admin")}>
                <UserIcon />
                Stjórnun
              </DropdownItem>
            )}
            <DropdownItem onClick={logout}>
              <ArrowRightStartOnRectangleIcon />
              Útskráning
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarSection>
    </Navbar>
  );
}
