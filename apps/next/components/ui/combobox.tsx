import * as Headless from "@headlessui/react";
import { Fragment, useState } from "react";

import { cn } from "~/utils/classnames";

type Props = Headless.ComboboxProps<typeof Fragment, false>;

export function Combobox<T extends { id: string; name: string }>({
  className,
  placeholder,
  "aria-label": ariaLabel,
  value,
  options,
  defaultValue,
  onChange,
  ...props
}: {
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
  value?: T | null;
  defaultValue?: T | null;
  onChange: (value: T | null) => void;
  options: T[];
} & Omit<
  Props,
  "by" | "value" | "onChange" | "options" | "virtual" | "defaultValue"
>) {
  const [query, setQuery] = useState("");
  const filteredOptions =
    query.trim() === ""
      ? options
      : options.filter((value) =>
          value.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <Headless.Combobox
      {...props}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      as={Fragment}
      multiple={false}
    >
      <div className={cn("group relative block w-full", className)}>
        <Headless.ComboboxInput
          aria-label={ariaLabel}
          displayValue={(value: T | undefined) => value?.name ?? ""}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          className={cn(
            "relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
            "pl-[calc(--spacing(3.5)-1px)] pr-[calc(--spacing(10)-1px)] sm:pl-[calc(--spacing(3)-1px)] sm:pr-[calc(--spacing(9)-1px)]",
            "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6",
            "focus:outline-hidden border border-zinc-950/10",
            "bg-white",
            "data-invalid:border-japan data-invalid:data-hover:border-japan",
            "data-disabled:border-zinc-950/20 data-disabled:opacity-100",
          )}
          placeholder={placeholder}
        />
        <Headless.ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="group-has-data-disabled:stroke-zinc-600 size-5 stroke-zinc-500 sm:size-4 forced-colors:stroke-[CanvasText]"
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
        </Headless.ComboboxButton>
        <Headless.ComboboxOptions
          className={cn(
            "focus:outline-hidden absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-neutral-200 sm:text-sm",
          )}
        >
          {filteredOptions.map((value) => (
            <Headless.ComboboxOption
              key={value.id}
              value={value}
              className={({ active }) =>
                cn(
                  "relative cursor-default select-none px-4 py-2",
                  active ? "bg-indigo-200 text-indigo-500" : "text-neutral-900",
                )
              }
            >
              {({ selected }) => (
                <span
                  className={cn(
                    "block truncate",
                    selected ? "font-medium" : "font-normal",
                  )}
                >
                  {value.name}
                </span>
              )}
            </Headless.ComboboxOption>
          ))}
        </Headless.ComboboxOptions>
      </div>
    </Headless.Combobox>
  );
}
