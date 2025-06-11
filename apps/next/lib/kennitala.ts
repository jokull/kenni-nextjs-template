import { getKennitalaBirthDate, parseKennitala } from "is-kennitala";
import { err, ok } from "neverthrow";

/**
 * Parse and validate kennitala with Result type
 */
export function parseKennitalaSafe(kennitala: string) {
  const kennitalData = parseKennitala(kennitala);
  if (!kennitalData) {
    return err({
      type: "invalid_kennitala" as const,
      message: "Invalid kennitala format",
    });
  }

  const birthDate = getKennitalaBirthDate(kennitala);
  if (!birthDate) {
    return err({
      type: "invalid_kennitala" as const,
      message: "Invalid kennitala birth date",
    });
  }

  return ok({
    type: kennitalData.type,
    birthDate,
  });
}
