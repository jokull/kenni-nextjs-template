import { requireServerAdminUser } from "~/lib/server-auth";

export default async function AdminPage() {
  const { session, user } = await requireServerAdminUser("/admin");

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Admin Panel</h1>
      <div className="space-y-2">
        <p>Welcome, Admin {session.name}!</p>
        <p>Role: {session.role}</p>
        <p>User ID: {session.userId}</p>
        <p>Personal Code: {user.personalCode}</p>
        <p>Email: {user.email || "Not provided"}</p>
        <p>Created: {user.createdAt?.toLocaleDateString()}</p>
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-xl font-semibold">Admin Tools</h2>
        <p className="text-gray-600">Admin functionality coming soon...</p>
      </div>
    </div>
  );
}
