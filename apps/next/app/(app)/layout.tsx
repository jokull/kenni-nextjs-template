import type { ReactNode } from "react";

import { AppSidebar } from "~/components/app-sidebar";
import { AuthLayout } from "~/components/auth-layout";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AuthLayout sidebar={<AppSidebar />}>{children}</AuthLayout>;
}
