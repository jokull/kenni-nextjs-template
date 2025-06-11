"use client";

import { Heading } from "~/components/ui/heading";
import { useAuth, useUserInitials } from "~/lib/auth-provider";

export default function DemoPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const userInitials = useUserInitials();

  if (!isAuthenticated || !user) {
    return (
      <div>Not authenticated - this should not happen in the (app) layout</div>
    );
  }

  return (
    <div className="space-y-8">
      <Heading>React 19 Auth Demo</Heading>

      <div className="space-y-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Auth State</h2>
          <div className="space-y-2">
            <p>
              <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
            </p>
            <p>
              <strong>User Name:</strong> {user.name}
            </p>
            <p>
              <strong>User Role:</strong> {user.role}
            </p>
            <p>
              <strong>User Initials:</strong> {userInitials}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">React 19 Features</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">✅ use() Hook</h3>
              <p className="text-sm text-zinc-600">
                Auth context consumed with React 19&apos;s use() hook for
                flexible consumption
              </p>
            </div>

            <div>
              <h3 className="font-medium">✅ Server-First</h3>
              <p className="text-sm text-zinc-600">
                Auth data fetched on server, no useEffect on client
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Actions</h2>
          <div className="flex gap-2">
            <button
              onClick={logout}
              className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
