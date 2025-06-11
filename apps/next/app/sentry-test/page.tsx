"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryTestPage() {
  const throwError = () => {
    throw new Error("Sentry Test Error - Client Side");
  };

  const captureMessage = () => {
    Sentry.captureMessage("Test message from Next.js App Router");
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Sentry Test Page</h1>
      <div className="space-y-4">
        <button
          onClick={throwError}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Throw Error
        </button>
        <button
          onClick={captureMessage}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
