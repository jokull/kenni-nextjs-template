export * from "./fetch";
export * from "./schemas";

export type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends (infer R)[]
    ? Mutable<R>[]
    : T[P] extends readonly (infer R)[]
      ? Mutable<R>[]
      : T[P] extends object
        ? Mutable<T[P]>
        : T[P];
};

export function normalizeEmail(value: string) {
  const email = value.toLowerCase().trim();
  const emailParts = email.split(/@/);

  if (emailParts.length !== 2) {
    return email;
  }

  let username = emailParts[0]!;
  const domain = emailParts[1]!;

  if (["gmail.com", "fastmail.com", "googlemail.com"].includes(domain)) {
    username = username.replaceAll(".", "");
  }

  return username + "@" + domain;
}
