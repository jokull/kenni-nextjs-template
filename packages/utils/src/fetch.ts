import { err, ResultAsync } from "neverthrow";

export type FetchError<E> = NetworkError | HttpError<E> | ParseError;

export interface NetworkError {
  type: "network";
  error: Error;
}

export interface HttpError<E = unknown> {
  type: "http";
  url: string;
  status: number;
  headers: Headers;
  json?: E | undefined;
}

export interface ParseError {
  type: "parse";
  error: Error;
}

export function safeFetch<T = unknown, E = unknown>(
  input: URL | string,
  init?: RequestInit,
  fetcher: typeof globalThis.fetch = globalThis.fetch,
): ResultAsync<T, FetchError<E>> {
  return ResultAsync.fromPromise(
    fetcher(input, init),
    (error): NetworkError => ({
      type: "network",
      error: error instanceof Error ? error : new Error(String(error)),
    }),
  ).andThen((response) => {
    if (!response.ok) {
      return ResultAsync.fromSafePromise(
        response.json().catch(() => null),
      ).andThen((json) => {
        const error: HttpError<E> = {
          type: "http" as const,
          url: input.toString(),
          status: response.status,
          headers: response.headers,
          json: json as E | undefined,
        };
        return err(error);
      });
    }
    return ResultAsync.fromPromise(
      response.json() as Promise<T>,
      (error): ParseError => ({
        type: "parse",
        error: error instanceof Error ? error : new Error(String(error)),
      }),
    );
  });
}
