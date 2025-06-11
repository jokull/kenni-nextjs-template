"use server";

import { cookies } from "next/headers";

export async function dismissToastAction(toastId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(toastId);
}
