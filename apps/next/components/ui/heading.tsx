"use client";

import * as React from "react";
import {
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface HeadingProps extends AriaHeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const getLevelClasses = (level: number) => {
  switch (level) {
    case 1:
      return "text-4xl font-extrabold lg:text-5xl";
    case 2:
      return "text-3xl font-semibold";
    case 3:
      return "text-2xl font-semibold";
    case 4:
      return "text-xl font-semibold";
    case 5:
      return "text-lg font-semibold";
    case 6:
      return "text-base font-semibold";
    default:
      return "text-4xl font-extrabold lg:text-5xl";
  }
};

const Heading = ({ className, level = 1, ...props }: HeadingProps) => {
  return (
    <AriaHeading
      className={twMerge(
        "scroll-m-20 tracking-tight",
        getLevelClasses(level),
        className,
      )}
      level={level}
      {...props}
    />
  );
};

export { Heading };
