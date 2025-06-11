import * as Headless from "@headlessui/react";

import { cn } from "~/utils/classnames";

export function RadioGroup({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.RadioGroupProps,
  "as" | "className"
>) {
  return (
    <Headless.RadioGroup
      data-slot="control"
      {...props}
      className={cn(
        className,
        // Basic groups
        "**:data-[slot=label]:font-normal space-y-3",
        // With descriptions
        "has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium",
      )}
    />
  );
}

export function RadioField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={cn(
        className,
        // Base layout
        "grid grid-cols-[1.125rem_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]",
        // Control layout
        "*:data-[slot=control]:col-start-1 *:data-[slot=control]:row-start-1 *:data-[slot=control]:justify-self-center",
        // Label layout
        "*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1 *:data-[slot=label]:justify-self-start",
        // Description layout
        "*:data-[slot=description]:col-start-2 *:data-[slot=description]:row-start-2",
        // With description
        "has-data-[slot=description]:**:data-[slot=label]:font-medium",
      )}
    />
  );
}

const base = [
  // Basic layout
  "relative isolate flex size-[1.1875rem] shrink-0 rounded-full sm:size-[1.0625rem]",
  // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
  "before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-white before:shadow",
  // Background color when checked
  "group-data-checked:before:bg-(--radio-checked-bg)",
  // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
  // Border
  "border border-zinc-950/15 group-data-checked:border-transparent group-data-hover:group-data-checked:border-transparent group-data-hover:border-zinc-950/30 group-data-checked:bg-(--radio-checked-border)",
  // Inner highlight shadow
  "after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_1px_--theme(--color-white/15%)]",
  // Indicator color (light mode)
  "[--radio-indicator:transparent] group-data-checked:[--radio-indicator:var(--radio-checked-indicator)] group-data-hover:group-data-checked:[--radio-indicator:var(--radio-checked-indicator)] group-data-hover:[--radio-indicator:var(--color-zinc-900)]/10",
  // Indicator color (dark mode)
  // Focus ring
  "group-data-focus:outline group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-indigo-500",
  // Disabled state
  "group-data-disabled:opacity-50",
  "group-data-disabled:border-zinc-950/25 group-data-disabled:bg-zinc-950/5 group-data-disabled:[--radio-checked-indicator:var(--color-zinc-950)]/50 group-data-disabled:before:bg-transparent",
];

const colors = {
  "dark/zinc": [
    "[--radio-checked-bg:var(--color-zinc-900)] [--radio-checked-border:var(--color-zinc-950)]/90 [--radio-checked-indicator:var(--color-white)]",
  ],
  "dark/white": [
    "[--radio-checked-bg:var(--color-zinc-900)] [--radio-checked-border:var(--color-zinc-950)]/90 [--radio-checked-indicator:var(--color-white)]",
  ],
  white:
    "[--radio-checked-bg:var(--color-white)] [--radio-checked-border:var(--color-zinc-950)]/15 [--radio-checked-indicator:var(--color-zinc-900)]",
  dark: "[--radio-checked-bg:var(--color-zinc-900)] [--radio-checked-border:var(--color-zinc-950)]/90 [--radio-checked-indicator:var(--color-white)]",
  zinc: "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:var(--color-zinc-600)] [--radio-checked-border:var(--color-zinc-700)]/90",
  red: "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.red.600)] [--radio-checked-border:theme(colors.red.700/90%)]",
  orange:
    "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.orange.500)] [--radio-checked-border:theme(colors.orange.600/90%)]",
  amber:
    "[--radio-checked-bg:var(--color-amber-400)] [--radio-checked-border:var(--color-amber-500)]/80 [--radio-checked-indicator:var(--color-amber-950)]",
  yellow:
    "[--radio-checked-bg:theme(colors.yellow.300)] [--radio-checked-border:theme(colors.yellow.400/80%)] [--radio-checked-indicator:theme(colors.yellow.950)]",
  lime: "[--radio-checked-bg:theme(colors.lime.300)] [--radio-checked-border:theme(colors.lime.400/80%)] [--radio-checked-indicator:theme(colors.lime.950)]",
  green:
    "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.green.600)] [--radio-checked-border:theme(colors.green.700/90%)]",
  emerald:
    "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.emerald.600)] [--radio-checked-border:theme(colors.emerald.700/90%)]",
  teal: "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.teal.600)] [--radio-checked-border:theme(colors.teal.700/90%)]",
  cyan: "[--radio-checked-bg:theme(colors.cyan.300)] [--radio-checked-border:theme(colors.cyan.400/80%)] [--radio-checked-indicator:theme(colors.cyan.950)]",
  sky: "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.sky.500)] [--radio-checked-border:theme(colors.sky.600/80%)]",
  blue: "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.blue.600)] [--radio-checked-border:theme(colors.blue.700/90%)]",
  indigo:
    "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.indigo.500)] [--radio-checked-border:theme(colors.indigo.600/90%)]",
  violet:
    "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.violet.500)] [--radio-checked-border:theme(colors.violet.600/90%)]",
  purple:
    "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.purple.500)] [--radio-checked-border:theme(colors.purple.600/90%)]",
  fuchsia:
    "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.fuchsia.500)] [--radio-checked-border:theme(colors.fuchsia.600/90%)]",
  pink: "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.pink.500)] [--radio-checked-border:theme(colors.pink.600/90%)]",
  rose: "[--radio-checked-indicator:var(--color-white)] [--radio-checked-bg:theme(colors.rose.500)] [--radio-checked-border:theme(colors.rose.600/90%)]",
};

type Color = keyof typeof colors;

export function Radio({
  color = "dark/zinc",
  className,
  ...props
}: { color?: Color; className?: string } & Omit<
  Headless.RadioProps,
  "as" | "className" | "children"
>) {
  return (
    <Headless.Radio
      data-slot="control"
      {...props}
      className={cn(className, "focus:outline-hidden group inline-flex")}
    >
      <span className={cn([base, colors[color]])}>
        <span
          className={cn(
            "bg-(--radio-indicator) size-full rounded-full border-[4.5px] border-transparent bg-clip-padding",
            // Forced colors mode
            "forced-colors:group-data-checked:border-[Highlight] forced-colors:border-[Canvas]",
          )}
        />
      </span>
    </Headless.Radio>
  );
}
