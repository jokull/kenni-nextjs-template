import * as Headless from "@headlessui/react";
import React from "react";

import { cn } from "~/utils/classnames";

export const Textarea = ({
  className,
  resizable = true,
  ref,
  ...props
}: {
  className?: string;
  resizable?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
} & Omit<Headless.TextareaProps, "as" | "className">) => {
  return (
    <span
      data-slot="control"
      className={cn([
        className,
        // Basic layout
        "relative block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:focus-within:after:ring-2 sm:focus-within:after:ring-indigo-500",
        // Disabled state
        "has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none",
      ])}
    >
      <Headless.Textarea
        ref={ref}
        {...props}
        className={cn([
          // Basic layout
          "relative block size-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
          // Typography
          "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6",
          // Border
          "data-hover:border-zinc-950/20 border border-zinc-950/10",
          // Background color
          "bg-transparent",
          // Hide default focus styles
          "focus:outline-hidden",
          // Invalid state
          "data-invalid:border-japan data-invalid:data-hover:border-japan",
          // Disabled state
          "disabled:border-zinc-950/20",
          // Resizable
          resizable ? "resize-y" : "resize-none",
        ])}
      />
    </span>
  );
};
