"use client";

import * as React from "react";
import {
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
} from "react-aria-components";

import { cn } from "~/utils/classnames";

interface HeadingProps extends AriaHeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = ({ className, level = 1, ...props }: HeadingProps) => {
  return (
    <AriaHeading
      className={cn(
        "scroll-m-20 tracking-tight",
        {
          "text-4xl font-extrabold lg:text-5xl": level === 1,
          "text-3xl font-semibold": level === 2,
          "text-2xl font-semibold": level === 3,
          "text-xl font-semibold": level === 4,
          "text-lg font-semibold": level === 5,
          "text-base font-semibold": level === 6,
        },
        className,
      )}
      level={level}
      {...props}
    />
  );
};

export { Heading };
