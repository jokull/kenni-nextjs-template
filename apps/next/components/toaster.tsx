import { cookies } from "next/headers";

import { dismissToastAction } from "~/actions/toast-actions";

import { ClientToasts } from "./client-toasts";

export async function Toaster() {
  const cookieStore = await cookies();

  const toasts = cookieStore
    .getAll()
    .filter((cookie) => cookie.name.startsWith("toast-") && cookie.value)
    .map((cookie) => ({
      id: cookie.name,
      message: cookie.value,
      dismiss: dismissToastAction.bind(null, cookie.name),
    }));

  return <ClientToasts toasts={toasts} />;
}
