import { twMerge, type ClassNameValue } from "tailwind-merge";

type ExtendedClassNameValue = ClassNameValue | { [key: string]: boolean };

export function cn(...inputs: ExtendedClassNameValue[]) {
  return twMerge(
    ...inputs.map((input) => {
      if (
        typeof input === "object" &&
        input !== null &&
        !Array.isArray(input)
      ) {
        return Object.entries(input)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(" ");
      }
      return input;
    }),
  );
}
