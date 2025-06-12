"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center text-sm text-center transition rounded-lg border border-black/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] cursor-default bg-white",
    "data-[disabled]:bg-gray-100 data-[disabled]:text-gray-300 data-[disabled]:border-black/5",
    "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-blue-600 data-[focus-visible]:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 data-[hovered]:bg-blue-700 data-[pressed]:bg-blue-800 text-white",
        secondary:
          "bg-gray-100 data-[hovered]:bg-gray-200 data-[pressed]:bg-gray-300 text-gray-800",
        destructive:
          "bg-red-700 data-[hovered]:bg-red-800 data-[pressed]:bg-red-900 text-white",
        icon: "border-0 p-1 flex items-center justify-center text-gray-600 data-[hovered]:bg-black/[5%] data-[pressed]:bg-black/10 data-[disabled]:bg-transparent",
      },
      size: {
        default: "px-5 py-2",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
        icon: "p-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends AriaButtonProps,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <AriaButton
        className={composeRenderProps(className, (className) =>
          twMerge(buttonVariants({ variant, size }), className),
        )}
        {...props}
        ref={ref}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
