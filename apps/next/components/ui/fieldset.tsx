"use client";

import * as React from "react";

import { cn } from "~/utils/classnames";

const Fieldset = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLFieldSetElement>) => {
  return <fieldset className={cn("space-y-6", className)} {...props} />;
};

const FieldGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("space-y-4", className)} {...props} />;
};

export { Fieldset, FieldGroup };
