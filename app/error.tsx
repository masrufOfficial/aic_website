"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-500)]">Something went wrong</p>
      <h1 className="text-4xl font-semibold text-slate-950">The platform hit an unexpected error.</h1>
      <p className="max-w-xl text-sm leading-7 text-slate-600">
        Please try again. If the issue continues, check your environment variables, database connection, or recent changes.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
