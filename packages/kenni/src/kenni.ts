import {
  joseAlgorithmRS256,
  JWSRegisteredHeaders,
  JWTRegisteredClaims,
  parseJWT,
} from "@oslojs/jwt";
import { err, ok, safeTry } from "neverthrow";
import { z } from "zod";

import { safeFetch, safeZodParse } from "@acme/utils";

// OIDC Discovery document structure
const OIDCConfigSchema = z.object({
  issuer: z.string(),
  authorization_endpoint: z.string(),
  token_endpoint: z.string(),
  userinfo_endpoint: z.string(),
  jwks_uri: z.string(),
  scopes_supported: z.array(z.string()),
  response_types_supported: z.array(z.string()),
  response_modes_supported: z.array(z.string()).optional(),
  grant_types_supported: z.array(z.string()).optional(),
  subject_types_supported: z.array(z.string()),
  id_token_signing_alg_values_supported: z.array(z.string()),
});

export type OIDCConfig = z.infer<typeof OIDCConfigSchema>;

// Kenni user claims from ID token
const KenniUserClaimsSchema = z.object({
  sub: z.string(), // Kenni user ID
  iss: z.string(), // Issuer
  aud: z.string(), // Audience (client ID)
  exp: z.number(), // Expiration time
  iat: z.number(), // Issued at time
  nonce: z.string().optional(), // Nonce
  national_id: z.string(), // National ID (kennitala)
  name: z.string(), // Full name
  at_hash: z.string().optional(), // Access token hash
});

export type KenniUserClaims = z.infer<typeof KenniUserClaimsSchema>;

// OAuth2 token response
const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().optional(),
  refresh_token: z.string().optional(),
  id_token: z.string(),
  scope: z.string().optional(),
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;

/**
 * Fetch OIDC configuration from Kenni's well-known endpoint (internal function)
 */
function getKenniOIDCConfig(issuerUrl: string) {
  return safeFetch(`${issuerUrl}/.well-known/openid-configuration`)
    .andThen(safeZodParse(OIDCConfigSchema))
    .mapErr((error) => ({
      type: "config_fetch_failed" as const,
      message: `Failed to fetch OIDC config: ${error.type === "zod" ? error.error.message : error.type}`,
    }));
}

/**
 * Generate authorization URL for Kenni OIDC flow with PKCE
 */
export function createKenniAuthorizationUrl({
  issuerUrl,
  clientId,
  redirectUri,
  codeVerifier,
  state,
  nonce,
}: {
  issuerUrl: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
  state: string;
  nonce: string;
}) {
  // oxlint-disable-next-line func-names
  return safeTry(async function* () {
    // Fetch OIDC configuration
    const config = yield* await getKenniOIDCConfig(issuerUrl);

    // Generate code challenge from verifier (S256 method)
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const codeChallenge = Buffer.from(hashBuffer).toString("base64url");

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      scope: "openid profile national_id",
      redirect_uri: redirectUri,
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authUrl = `${config.authorization_endpoint}?${params.toString()}`;
    return ok(authUrl);
  });
}

/**
 * Exchange authorization code for tokens with PKCE
 */
export async function exchangeCodeForTokens({
  issuerUrl,
  clientId,
  clientSecret,
  code,
  redirectUri,
  codeVerifier,
}: {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}) {
  const configResult = await getKenniOIDCConfig(issuerUrl);
  if (configResult.isErr()) {
    return err(configResult.error);
  }

  const config = configResult.value;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  return safeFetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  }).andThen(safeZodParse(TokenResponseSchema));
}

/**
 * Parse and validate ID token claims with Oslo JWT verification
 * Validates algorithm, expiration, not-before, and payload structure
 */
export function parseIdTokenClaims(idToken: string) {
  const [header, payload] = parseJWT(idToken);

  // Check the JOSE header for supported algorithm
  const headerParameters = new JWSRegisteredHeaders(header);
  if (headerParameters.algorithm() !== joseAlgorithmRS256) {
    return err({
      type: "invalid_claims" as const,
      message: "Unsupported algorithm",
    });
  }

  // Validate timing claims using Oslo
  const claims = new JWTRegisteredClaims(payload);
  if (!claims.verifyExpiration()) {
    return err({
      type: "invalid_claims" as const,
      message: "Expired token",
    });
  }
  if (claims.hasNotBefore() && !claims.verifyNotBefore()) {
    return err({
      type: "invalid_claims" as const,
      message: "Invalid token (not before)",
    });
  }

  // Validate payload structure with Zod
  return safeZodParse(KenniUserClaimsSchema)(payload);
}

/**
 * Fetch user info from Kenni's userinfo endpoint
 */
export function fetchKenniUserInfo({
  issuerUrl,
  accessToken,
}: {
  issuerUrl: string;
  accessToken: string;
}) {
  return getKenniOIDCConfig(issuerUrl).andThen((config) =>
    safeFetch(config.userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }),
  );
}

/**
 * Generate random state for OAuth2 flow
 */
export function generateState(): string {
  return crypto.randomUUID();
}

/**
 * Generate PKCE code verifier
 */
export function generateCodeVerifier(): string {
  // Generate 43-128 character random string for PKCE
  // Per RFC 7636: unreserved characters [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"
  // But Kenni seems to be more restrictive, so let's use only alphanumeric
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(64); // Generate 64 characters (within 43-128 range)
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

/**
 * Generate random nonce for OIDC flow
 */
export function generateNonce(): string {
  return crypto.randomUUID();
}
