import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";

import {
  createKenniAuthorizationUrl,
  generateCodeVerifier,
  generateNonce,
  generateState,
} from "@acme/kenni";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { env } from "~/lib/env";
import { toast } from "~/lib/toast-server";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const nextParam = searchParams["next"];
  const next: string =
    typeof nextParam === "string" ? decodeURIComponent(nextParam) : "/";

  async function startKenniAuth() {
    "use server";
    const redirectUri = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/api/auth/callback`;
    const state = generateState();
    const nonce = generateNonce();
    const codeVerifier = generateCodeVerifier();

    console.info("Starting Kenni authentication, redirect URI:", redirectUri);

    const authUrlResult = await createKenniAuthorizationUrl({
      issuerUrl: env.KENNI_ISSUER_URL,
      clientId: env.KENNI_CLIENT_ID,
      redirectUri,
      codeVerifier,
      state,
      nonce,
    }).orTee((error) => {
      Sentry.captureException(new Error(error.message), {
        extra: { error },
      });
    });

    if (authUrlResult.isErr()) {
      await toast("Ekki tókst að búa til auðkennisslóð");
      throw redirect("/login");
    }

    // Add next parameter and code verifier to state for post-login redirect
    const authUrlWithNext = new URL(authUrlResult.value);
    authUrlWithNext.searchParams.set(
      "state",
      `${state}:${encodeURIComponent(next)}:${codeVerifier}`,
    );

    // Redirect the user to the Kenni authentication URL
    throw redirect(authUrlWithNext.toString());
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Heading
            level={2}
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Innskráning
          </Heading>
          <p className="mt-2 text-sm text-gray-600">
            Skráðu þig inn með Kenni rafrænum skilríkjum
          </p>
          {next && (
            <p className="mt-1 text-xs text-gray-500">
              Þú verður sendur á {next} eftir innskráningu
            </p>
          )}
        </div>

        <div className="mt-8">
          <form action={startKenniAuth}>
            <Button type="submit" className="w-full">
              Kenni Auðkenni
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">
                  Öruggt og þægilegt
                </span>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              Kenni tryggir öryggi og næði þinna persónuupplýsinga
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
