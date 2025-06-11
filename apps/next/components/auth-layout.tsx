import type { ReactNode } from "react";

import { AuthProvider } from "~/lib/auth-provider";
import { getServerUser } from "~/lib/server-auth";

import { AuthNavbar } from "./auth-navbar";
import { StackedLayout } from "./ui/stacked-layout";

interface AuthLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

/**
 * Server Component that fetches auth data and provides it to client components
 * This eliminates the need for useEffect on the client side
 */
export async function AuthLayout({ children, sidebar }: AuthLayoutProps) {
  // Fetch user data on the server
  const serverUser = await getServerUser();

  return (
    <AuthProvider initialUser={serverUser}>
      <StackedLayout navbar={<AuthNavbar />} sidebar={sidebar}>
        {children}
      </StackedLayout>
    </AuthProvider>
  );
}
