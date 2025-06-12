"use client";

import { Label as AriaLabel, type LabelProps } from "react-aria-components";

import { cn } from "~/utils/classnames";

const Label = ({ className, ...props }: LabelProps) => (
  <AriaLabel
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
      className,
    )}
    {...props}
  />
);

export { Label };
