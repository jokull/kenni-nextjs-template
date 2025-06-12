"use client";

import * as React from "react";
import {
  TextArea as AriaTextArea,
  composeRenderProps,
  type TextAreaProps as AriaTextAreaProps,
} from "react-aria-components";

import { cn } from "~/utils/classnames";

const Textarea = ({ className, ...props }: AriaTextAreaProps) => {
  return (
    <AriaTextArea
      className={composeRenderProps(className, (className) =>
        cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm",
          "data-[focused]:ring-ring data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-offset-2",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          "focus-visible:outline-none",
          className,
        ),
      )}
      {...props}
    />
  );
};

export { Textarea };
