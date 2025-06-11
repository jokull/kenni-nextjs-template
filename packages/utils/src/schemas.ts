import { err, ok, type Result } from "neverthrow";
import type { z, ZodError, ZodSchema } from "zod";

export interface ZodParseError<T> {
  type: "zod";
  error: ZodError<T>;
}

export function safeZodParse<TSchema extends ZodSchema>(
  schema: TSchema,
): (
  data: unknown,
) => Result<z.infer<TSchema>, ZodParseError<z.infer<TSchema>>> {
  return (data: unknown) => {
    const result = schema.safeParse(data);

    return result.success
      ? ok(result.data)
      : err({
          type: "zod",
          error: result.error,
        });
  };
}
