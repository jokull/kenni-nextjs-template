import React from "react";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import {
  Description,
  fieldBorderStyles,
  FieldError,
  Input,
  Label,
} from "./field";
import { composeTailwindRenderProps, focusRing } from "./utils";

const inputStyles = tv({
  extend: focusRing,
  base: "border-2 rounded-md",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  type?: string;
}

export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  type,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <Input className={inputStyles} placeholder={placeholder} type={type} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
