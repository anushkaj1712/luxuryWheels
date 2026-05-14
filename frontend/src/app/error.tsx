"use client";

import * as React from "react";

/**
 * Route-level error boundary (Next.js App Router).
 * Keeps a premium, on-brand recovery path instead of a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center text-zinc-100">
      <p className="font-display text-sm uppercase tracking-[0.35em] text-amber-200/80">Drive Luxury Wheels</p>
      <h1 className="mt-4 font-display text-3xl md:text-4xl">Something went off the racing line</h1>
      <p className="mt-4 max-w-md text-sm text-zinc-400">
        A temporary fault interrupted this view. You can retry — if the problem persists, confirm the API is
        reachable and environment variables are set on Vercel / Render.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-xs text-zinc-600">Reference: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-full border border-amber-400/40 bg-amber-400/10 px-8 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-400/20"
      >
        Try again
      </button>
    </div>
  );
}
