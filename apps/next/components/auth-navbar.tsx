"use client";

import {
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

import { useAuth, useUserInitials } from "~/lib/auth-provider";

// Simple navbar and dropdown components
const Navbar = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <nav
    className="flex items-center border-b border-gray-200 bg-white px-4 py-3"
    {...props}
  >
    {children}
  </nav>
);

const NavbarSection = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex items-center space-x-4" {...props}>
    {children}
  </div>
);

const NavbarSpacer = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex-1" {...props} />
);

interface NavbarItemProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

const NavbarItem = ({
  children,
  href,
  className,
  onClick,
}: NavbarItemProps) => {
  const baseClassName = "text-sm font-medium text-gray-900";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  if (href) {
    return (
      <a href={href} className={finalClassName} onClick={onClick}>
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

const Dropdown = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="relative inline-block text-left" {...props}>
    {children}
  </div>
);

const DropdownButton = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) => (
  <button
    className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    {...props}
  >
    {children}
  </button>
);

const DropdownMenu = ({
  children,
  anchor: _anchor,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { anchor?: string }) => (
  <div
    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
    {...props}
  >
    <div className="py-1">{children}</div>
  </div>
);

const DropdownItem = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    {...props}
  >
    {children}
  </div>
);

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
