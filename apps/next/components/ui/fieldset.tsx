import * as Headless from "@headlessui/react";
import type React from "react";

import { cn } from "~/utils/classnames";

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, "as" | "className">) {
  return (
    <Headless.Fieldset
      {...props}
      className={cn(
        className,
        "*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6",
      )}
    />
  );
}

export function Legend({
  className,
  ...props
}: { className?: string } & Omit<Headless.LegendProps, "as" | "className">) {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      className={cn(
        className,
        "data-disabled:opacity-50 text-base/6 font-semibold text-zinc-950 sm:text-sm/6",
      )}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="control"
      {...props}
      className={cn(className, "space-y-8")}
    />
  );
}

export function Field({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
  return (
    <Headless.Field
      {...props}
      className={cn(
        className,
        "[&>[data-slot=label]+[data-slot=control]]:mt-3",
        "[&>[data-slot=label]+[data-slot=description]]:mt-1",
        "[&>[data-slot=description]+[data-slot=control]]:mt-3",
        "[&>[data-slot=control]+[data-slot=description]]:mt-3",
        "[&>[data-slot=control]+[data-slot=error]]:mt-3",
        "*:data-[slot=label]:font-medium",
      )}
    />
  );
}

export function Label({
  className,
  ...props
}: { className?: string } & Omit<Headless.LabelProps, "as" | "className">) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={cn(
        className,
        "data-disabled:opacity-50 select-none text-base/6 text-zinc-950 sm:text-sm/6",
      )}
    />
  );
}

export function Description({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps,
  "as" | "className"
>) {
  return (
    <Headless.Description
      data-slot="description"
      {...props}
      className={cn(
        className,
        "data-disabled:opacity-50 text-base/6 text-zinc-500 sm:text-sm/6",
      )}
    />
  );
}

export function ErrorMessage({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps,
  "as" | "className"
>) {
  return (
    <Headless.Description
      data-slot="error"
      {...props}
      className={cn(
        className,
        "text-japan data-disabled:opacity-50 text-base/6 sm:text-sm/6",
      )}
    />
  );
}
