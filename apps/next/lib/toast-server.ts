"use server";

import { cookies } from "next/headers";

/**
 * Server action to create a toast message
 */
export async function toast(message: string) {
  const cookieStore = await cookies();
  const id = crypto.randomUUID();

  cookieStore.set(`toast-${id}`, message, {
    path: "/",
    maxAge: 60 * 5, // 5 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

/**
 * Server action to dismiss a toast
 */
export async function dismissToast(id: string) {
  const cookieStore = await cookies();
  cookieStore.delete(id);
}
