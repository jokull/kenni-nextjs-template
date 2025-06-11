"use client";

import { useEffect, useOptimistic, useTransition } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

import type { Toast } from "~/lib/toast-types";

interface ClientToastsProps {
  toasts: (Toast & { dismiss: () => Promise<void> })[];
}

export function ClientToasts({ toasts }: ClientToastsProps) {
  const [optimisticToasts, setOptimisticToasts] = useOptimistic(
    toasts,
    (currentToasts, removedId: string) =>
      currentToasts.filter((toast) => toast.id !== removedId),
  );

  const [, startTransition] = useTransition();

  useEffect(() => {
    // Display toasts when component mounts or toasts change
    optimisticToasts.forEach((toastItem) => {
      toast(toastItem.message, {
        id: toastItem.id,
        onDismiss: () => {
          setOptimisticToasts(toastItem.id);
          startTransition(async () => {
            await toastItem.dismiss();
          });
        },
        onAutoClose: () => {
          setOptimisticToasts(toastItem.id);
          startTransition(async () => {
            await toastItem.dismiss();
          });
        },
      });
    });
  }, [optimisticToasts, setOptimisticToasts]);

  return <SonnerToaster position="bottom-right" richColors />;
}
