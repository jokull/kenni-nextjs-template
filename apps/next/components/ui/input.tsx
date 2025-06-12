"use client";

import {
  Input as AriaInput,
  TextField as AriaTextField,
  composeRenderProps,
  type InputProps as AriaInputProps,
} from "react-aria-components";

import { cn } from "~/utils/classnames";

const TextField = AriaTextField;

const Input = ({ className, ...props }: AriaInputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(className, (className) =>
        cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          "data-[focused]:ring-ring data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-offset-2",
          "focus-visible:outline-none",
          className,
        ),
      )}
      {...props}
    />
  );
};

export { Input, TextField };
