"use client";

import * as Headless from "@headlessui/react";
import { Fragment } from "react";

import { cn } from "~/utils/classnames";

export function Listbox<T>({
  className,
  placeholder,
  autoFocus,
  "aria-label": ariaLabel,
  children: options,
  ...props
}: {
  className?: string;
  placeholder?: React.ReactNode;
  autoFocus?: boolean;
  "aria-label"?: string;
  children?: React.ReactNode;
} & Omit<Headless.ListboxProps<typeof Fragment, T>, "as" | "multiple">) {
  return (
    <Headless.Listbox {...props} multiple={false}>
      <Headless.ListboxButton
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        data-slot="control"
        aria-label={ariaLabel}
        className={cn([
          className,
          // Basic layout
          "group relative block w-full",
          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          "before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow",
          // Hide default focus styles
          "focus:outline-hidden",
          // Focus ring
          "data-focus:after:ring-2 data-focus:after:ring-indigo-500 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent",
          // Disabled state
          "data-disabled:opacity-50 data-disabled:before:bg-zinc-950/5 data-disabled:before:shadow-none",
        ])}
      >
        <Headless.ListboxSelectedOption
          as="span"
          options={options}
          placeholder={
            placeholder ? (
              <span className="block truncate text-zinc-500">
                {placeholder}
              </span>
            ) : null
          }
          className={cn([
            // Basic layout
            "relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
            // Set minimum height for when no value is selected
            "min-h-11 sm:min-h-9",
            // Horizontal padding
            "pl-[calc(--spacing(3.5)-1px)] pr-[calc(--spacing(7)-1px)] sm:pl-[calc(--spacing(3)-1px)]",
            // Typography
            "text-left text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 forced-colors:text-[CanvasText]",
            // Border
            "group-data-active:border-zinc-950/20 group-data-hover:border-zinc-950/20 border border-zinc-950/10",
            // Background color
            "bg-transparent",
            // Invalid state
            "group-data-invalid:border-japan group-data-hover:group-data-invalid:border-japan",
            // Disabled state
            "group-data-disabled:border-zinc-950/20 group-data-disabled:opacity-100",
          ])}
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="group-data-disabled:stroke-zinc-600 size-5 stroke-zinc-500 sm:size-4 forced-colors:stroke-[CanvasText]"
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
          >
            <path
              d="M5.75 10.75L8 13L10.25 10.75"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.25 5.25L8 3L5.75 5.25"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Headless.ListboxButton>
      <Headless.ListboxOptions
        transition
        anchor="selection start"
        className={cn(
          // Anchor positioning
          "[--anchor-offset:-1.625rem] [--anchor-padding:--spacing(4)] sm:[--anchor-offset:-1.375rem]",
          // Base styles
          "isolate w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-xl p-1",
          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          "focus:outline-hidden outline outline-1 outline-transparent",
          // Handle scrolling when menu won't fit in viewport
          "overflow-y-scroll overscroll-contain",
          // Popover background
          "bg-white/75 backdrop-blur-xl",
          // Shadows
          "shadow-lg ring-1 ring-zinc-950/10",
          // Transitions
          "data-transition:pointer-events-none data-closed:data-leave:opacity-0 transition-opacity duration-100 ease-in",
        )}
      >
        {options}
      </Headless.ListboxOptions>
    </Headless.Listbox>
  );
}

export function ListboxOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.ListboxOptionProps<"div", T>,
  "as" | "className"
>) {
  const sharedClasses = cn(
    // Base
    "flex min-w-0 items-center",
    // Icons
    "*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 sm:*:data-[slot=icon]:size-4",
    "*:data-[slot=icon]:text-zinc-500 group-data-focus/option:*:data-[slot=icon]:text-white",
    "forced-colors:*:data-[slot=icon]:text-[CanvasText] forced-colors:group-data-focus/option:*:data-[slot=icon]:text-[Canvas]",
    // Avatars
    "*:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:size-5",
  );

  return (
    <Headless.ListboxOption as={Fragment} {...props}>
      {({ selectedOption }) => {
        if (selectedOption) {
          return <div className={cn(className, sharedClasses)}>{children}</div>;
        }

        return (
          <div
            className={cn(
              // Basic layout
              "group/option grid cursor-default grid-cols-[--spacing(5)_1fr] items-baseline gap-x-2 rounded-lg py-2.5 pl-2 pr-3.5 sm:grid-cols-[--spacing(4)_1fr] sm:py-1.5 sm:pl-1.5 sm:pr-3",
              // Typography
              "text-base/6 text-zinc-950 sm:text-sm/6 forced-colors:text-[CanvasText]",
              // Focus
              "outline-hidden data-focus:bg-indigo-500 data-focus:text-white",
              // Forced colors mode
              "forced-colors:data-focus:bg-[Highlight] forced-colors:data-focus:text-[HighlightText] forced-color-adjust-none",
              // Disabled
              "data-disabled:opacity-50",
            )}
          >
            <svg
              className="group-data-selected/option:inline relative hidden size-5 self-center stroke-current sm:size-4"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 8.5l3 3L12 4"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={cn(className, sharedClasses, "col-start-2")}>
              {children}
            </span>
          </div>
        );
      }}
    </Headless.ListboxOption>
  );
}

export function ListboxLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn(
        className,
        "ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0",
      )}
    />
  );
}

export function ListboxDescription({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn(
        className,
        "group-data-focus/option:text-white flex flex-1 overflow-hidden text-zinc-500 before:w-2 before:min-w-0 before:shrink",
      )}
    >
      <span className="flex-1 truncate">{children}</span>
    </span>
  );
}
