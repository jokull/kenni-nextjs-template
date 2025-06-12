"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

const Fieldset = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLFieldSetElement>) => {
  return <fieldset className={twMerge("space-y-6", className)} {...props} />;
};

const FieldGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={twMerge("space-y-4", className)} {...props} />;
};

export { Fieldset, FieldGroup };
